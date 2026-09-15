param(
    [string]$ProjectRoot = $PSScriptRoot,
    [switch]$Deep,
    [switch]$DryRun,
    [switch]$KeepTransportArtifacts
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Get-FullPath([string]$Path) {
    return [System.IO.Path]::GetFullPath($Path)
}

if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container)) {
    throw "Catalyst project directory not found: $ProjectRoot"
}

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path.TrimEnd('\', '/')
$packagePath = Join-Path $ProjectRoot "package.json"
$srcPath = Join-Path $ProjectRoot "src"
$docsPath = Join-Path $ProjectRoot "docs"

if (-not (Test-Path -LiteralPath $packagePath -PathType Leaf) -or
    -not (Test-Path -LiteralPath $srcPath -PathType Container) -or
    -not (Test-Path -LiteralPath $docsPath -PathType Container)) {
    throw "Refusing to clean '$ProjectRoot': this does not look like a complete Catalyst project root."
}

try {
    $package = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
    if ($package.name -ne "catalyst") {
        throw "package.json name is '$($package.name)', not 'catalyst'."
    }
}
catch {
    throw "Refusing to clean '$ProjectRoot': package.json could not be validated as Catalyst. $($_.Exception.Message)"
}

$rootPrefix = $ProjectRoot + [System.IO.Path]::DirectorySeparatorChar
$removedCount = 0
$reclaimedBytes = [int64]0

function Get-RelativeDisplayPath([string]$Path) {
    $full = Get-FullPath $Path
    if ($full.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $full.Substring($rootPrefix.Length)
    }
    return $full
}

function Assert-InProject([string]$Path) {
    $full = Get-FullPath $Path
    if (-not $full.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to remove a path outside the Catalyst project: $full"
    }
    return $full
}

function Get-PathBytes([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) { return [int64]0 }
    $item = Get-Item -LiteralPath $Path -Force
    if (-not $item.PSIsContainer) { return [int64]$item.Length }

    $sum = Get-ChildItem -LiteralPath $Path -Recurse -Force -File -ErrorAction SilentlyContinue |
        Measure-Object -Property Length -Sum
    if ($null -eq $sum.Sum) { return [int64]0 }
    return [int64]$sum.Sum
}

function Remove-CatalystPath([string]$Path, [string]$Reason) {
    if (-not (Test-Path -LiteralPath $Path)) { return }
    $safePath = Assert-InProject $Path
    $relative = Get-RelativeDisplayPath $safePath
    $bytes = Get-PathBytes $safePath

    if ($DryRun) {
        Write-Host "[dry-run] $relative" -ForegroundColor DarkGray
        Write-Host "          $Reason" -ForegroundColor DarkGray
        return
    }

    Remove-Item -LiteralPath $safePath -Recurse -Force
    $script:removedCount += 1
    $script:reclaimedBytes += $bytes
    Write-Host "Removed  $relative" -ForegroundColor DarkGreen
}

function Remove-RootPattern([string]$Pattern, [string]$Reason) {
    Get-ChildItem -LiteralPath $ProjectRoot -Force -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like $Pattern } |
        ForEach-Object { Remove-CatalystPath $_.FullName $Reason }
}

function Remove-ExactResearchDuplicate([string]$Name) {
    $rootCopy = Join-Path $ProjectRoot $Name
    $canonicalCopy = Join-Path (Join-Path $ProjectRoot "docs\research") $Name
    if (-not (Test-Path -LiteralPath $rootCopy -PathType Leaf)) { return }
    if (-not (Test-Path -LiteralPath $canonicalCopy -PathType Leaf)) {
        Write-Warning "Preserving root research file '$Name' because no canonical docs/research copy exists."
        return
    }

    $rootHash = (Get-FileHash -LiteralPath $rootCopy -Algorithm SHA256).Hash
    $canonicalHash = (Get-FileHash -LiteralPath $canonicalCopy -Algorithm SHA256).Hash
    if ($rootHash -eq $canonicalHash) {
        Remove-CatalystPath $rootCopy "Exact duplicate of docs/research/$Name."
    }
    else {
        Write-Warning "Preserving root research file '$Name' because it differs from docs/research/$Name. Reconcile it manually."
    }
}

function Remove-ExactScreenshotDuplicates {
    $rootScreenshots = Join-Path $ProjectRoot "screenshots"
    $canonicalScreenshots = Join-Path $ProjectRoot "docs\research\screenshots"
    if (-not (Test-Path -LiteralPath $rootScreenshots -PathType Container)) { return }
    if (-not (Test-Path -LiteralPath $canonicalScreenshots -PathType Container)) {
        Write-Warning "Preserving root screenshots/ because docs/research/screenshots/ does not exist."
        return
    }

    $rootFiles = Get-ChildItem -LiteralPath $rootScreenshots -Recurse -Force -File -ErrorAction SilentlyContinue
    foreach ($file in $rootFiles) {
        $relative = $file.FullName.Substring($rootScreenshots.Length).TrimStart('\', '/')
        $canonical = Join-Path $canonicalScreenshots $relative
        if (-not (Test-Path -LiteralPath $canonical -PathType Leaf)) { continue }
        $a = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
        $b = (Get-FileHash -LiteralPath $canonical -Algorithm SHA256).Hash
        if ($a -eq $b) {
            Remove-CatalystPath $file.FullName "Exact duplicate of docs/research/screenshots/$relative."
        }
    }

    if (-not $DryRun) {
        Get-ChildItem -LiteralPath $rootScreenshots -Recurse -Force -Directory -ErrorAction SilentlyContinue |
            Sort-Object FullName -Descending |
            ForEach-Object {
                if (-not (Get-ChildItem -LiteralPath $_.FullName -Force -ErrorAction SilentlyContinue)) {
                    Remove-Item -LiteralPath $_.FullName -Force
                }
            }
        if (Test-Path -LiteralPath $rootScreenshots -PathType Container) {
            if (-not (Get-ChildItem -LiteralPath $rootScreenshots -Force -ErrorAction SilentlyContinue)) {
                Remove-Item -LiteralPath $rootScreenshots -Force
                Write-Host "Removed  screenshots (empty after duplicate pruning)" -ForegroundColor DarkGreen
            }
        }
    }
}

Write-Host "Catalyst workspace cleanup" -ForegroundColor Cyan
Write-Host "Root: $ProjectRoot"
if ($DryRun) { Write-Host "Mode: preview only (-DryRun)" -ForegroundColor Yellow }
elseif ($Deep) { Write-Host "Mode: deep" -ForegroundColor Yellow }
else { Write-Host "Mode: routine" }
Write-Host ""

# Routine generated frontend/test output.
foreach ($relative in @("dist", ".vite", "coverage")) {
    Remove-CatalystPath (Join-Path $ProjectRoot $relative) "Generated build/test output."
}

foreach ($pattern in @("*.tsbuildinfo", "*.log", "npm-debug.log*", "yarn-error.log*", "pnpm-debug.log*")) {
    Remove-RootPattern $pattern "Generated compiler/package-manager output."
}

# Research handoff files that were historically extracted into the project root.
foreach ($name in @(
    "ARTIFACT_INDEX.md",
    "CURRENT_STATE.md",
    "DECISION_LOG.md",
    "ENGINEERING_FINDINGS.md",
    "NEXT_STEPS.md",
    "PASS_LOG.md",
    "PORTRAYAL_EXECUTION.md",
    "RESEARCH_SYNTHESIS.md",
    "SOURCE_INDEX.md"
)) {
    Remove-ExactResearchDuplicate $name
}
Remove-ExactScreenshotDuplicates

# Standalone checkpoint checksum manifests do not belong in the source root.
Remove-CatalystPath (Join-Path $ProjectRoot "CHECKSUMS.txt") "Standalone checkpoint checksum manifest."

# Transport artifacts are safe to remove after they have been applied. Keep them only when explicitly requested.
if (-not $KeepTransportArtifacts) {
    foreach ($pattern in @(
        "apply_*.ps1",
        "catalyst-*-overlay.zip",
        "catalyst-*-source.zip",
        "catalyst-*-handoff.zip",
        "catalyst-*-SHA256SUMS.txt"
    )) {
        Remove-RootPattern $pattern "Applied/generated handoff transport artifact."
    }
}

# Deep cleanup intentionally removes installed dependencies and requires reinstall afterward.
if ($Deep) {
    Remove-CatalystPath (Join-Path $ProjectRoot "node_modules") "Installed npm dependencies; reinstall with install.ps1."
}

Write-Host ""
if ($DryRun) {
    Write-Host "Preview complete. No files were changed." -ForegroundColor Cyan
}
else {
    $reclaimedMB = [math]::Round($reclaimedBytes / 1MB, 2)
    Write-Host "Cleanup complete: removed $removedCount item(s), reclaimed approximately $reclaimedMB MB." -ForegroundColor Cyan
}

if (Test-Path -LiteralPath (Join-Path $ProjectRoot "specs") -PathType Container) {
    Write-Host "Preserved  specs\ (unmanaged top-level content; review/integrate before deleting)." -ForegroundColor Yellow
}
if (Test-Path -LiteralPath (Join-Path $ProjectRoot "screenshots") -PathType Container) {
    Write-Host "Preserved  screenshots\ content that is not an exact copy of docs\research\screenshots\." -ForegroundColor Yellow
}
if ($Deep) {
    Write-Host "Deep cleanup removed installed dependencies. Run .\install.ps1 before the next full validation." -ForegroundColor Yellow
}
