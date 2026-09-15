param(
    [string]$ProjectRoot = $PSScriptRoot,
    [string]$OutputZip = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($OutputZip)) {
    $parent = Split-Path -Parent $ProjectRoot
    $OutputZip = Join-Path $parent "catalyst-source.zip"
}

if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container)) {
    throw "Catalyst project directory not found: $ProjectRoot"
}

$requiredResearch = @(
    "docs\source-archive-standard.md",
    "docs\research\README.md",
    "docs\research\CURRENT_STATE.md",
    "docs\research\RESEARCH_SYNTHESIS.md",
    "docs\research\DECISION_LOG.md",
    "docs\research\PASS_LOG.md",
    "docs\research\SOURCE_INDEX.md",
    "docs\research\ENGINEERING_FINDINGS.md",
    "docs\research\NEXT_STEPS.md"
)

foreach ($relativePath in $requiredResearch) {
    $fullPath = Join-Path $ProjectRoot $relativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        throw "Required Catalyst source/research file is missing: $relativePath"
    }
    if ((Get-Item -LiteralPath $fullPath).Length -eq 0) {
        throw "Required Catalyst source/research file is empty: $relativePath"
    }
}

$xmlRepository = Join-Path $ProjectRoot "src\persistence\xmlRepository.ts"
$xmlCodec = Join-Path $ProjectRoot "src\persistence\xml.ts"
if (-not (Test-Path -LiteralPath $xmlRepository -PathType Leaf) -or -not (Test-Path -LiteralPath $xmlCodec -PathType Leaf)) {
    throw "Catalyst XML persistence source is incomplete. src/persistence/xmlRepository.ts and src/persistence/xml.ts must be present in source handoffs."
}

$tar = Get-Command tar.exe -ErrorAction SilentlyContinue
if (-not $tar) { $tar = Get-Command tar -ErrorAction SilentlyContinue }
if (-not $tar) { throw "tar was not found on this system." }

if (Test-Path -LiteralPath $OutputZip) { Remove-Item -LiteralPath $OutputZip -Force }

Write-Host "Gathering Catalyst source + integrated research..."
Write-Host "Project: $ProjectRoot"
Write-Host "Output:  $OutputZip"

& $tar.Source -a -c -f $OutputZip `
    --exclude="legacy/tauri-shell" `
    --exclude="src-tauri/target" `
    --exclude="node_modules" `
    --exclude="dist" `
    --exclude="build" `
    --exclude=".git" `
    --exclude=".next" `
    --exclude=".vite" `
    --exclude="coverage" `
    --exclude="tools/chatgpt-bridge-extension" `
    --exclude="*.tsbuildinfo" `
    --exclude="*.log" `
    --exclude="catalyst-*.zip" `
    --exclude="catalyst-*-SHA256SUMS.txt" `
    -C $ProjectRoot .

if ($LASTEXITCODE -ne 0) { throw "Source archive creation failed with exit code $LASTEXITCODE." }
if (-not (Test-Path -LiteralPath $OutputZip -PathType Leaf)) { throw "Archive was not created: $OutputZip" }

$sizeMB = [math]::Round((Get-Item -LiteralPath $OutputZip).Length / 1MB, 2)
Write-Host ""
Write-Host "Created: $OutputZip"
Write-Host "Size:    $sizeMB MB"
Write-Host "Includes active Catalyst source + integrated research; excludes the archived legacy Tauri shell and generated build output."
