param(
    [string]$ProjectRoot = $PSScriptRoot,
    [string]$OutputZip = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($OutputZip)) {
    $parent = Split-Path -Parent $ProjectRoot
    $stamp = Get-Date -Format "yyyy-MM-dd-HHmm"
    $OutputZip = Join-Path $parent "catalyst-research-handoff-$stamp.zip"
}

$required = @(
    "docs\source-archive-standard.md",
    "docs\research\README.md",
    "docs\research\CURRENT_STATE.md",
    "docs\research\RESEARCH_SYNTHESIS.md",
    "docs\research\DECISION_LOG.md",
    "docs\research\PASS_LOG.md",
    "docs\research\SOURCE_INDEX.md",
    "docs\research\ENGINEERING_FINDINGS.md",
    "docs\research\NEXT_STEPS.md",
    "docs\research\PORTRAYAL_EXECUTION.md"
)

foreach ($relativePath in $required) {
    $fullPath = Join-Path $ProjectRoot $relativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        throw "Required research handoff file is missing: $relativePath"
    }
    if ((Get-Item -LiteralPath $fullPath).Length -eq 0) {
        throw "Required research handoff file is empty: $relativePath"
    }
}

$tar = Get-Command tar.exe -ErrorAction SilentlyContinue
if (-not $tar) { $tar = Get-Command tar -ErrorAction SilentlyContinue }
if (-not $tar) { throw "tar was not found on this system." }
if (Test-Path -LiteralPath $OutputZip) { Remove-Item -LiteralPath $OutputZip -Force }

$include = @(
    "docs/research",
    "docs/source-archive-standard.md",
    "docs/visual-analytical-language-v0.1.md",
    "docs/mapping-model-v0.1.md",
    "docs/mapping-model-review-v0.1.md",
    "docs/working-picture-model-v0.1.md",
    "docs/portrayal-standard-v0.1.md",
    "docs/navigation-grammar-v0.1.md",
    "docs/representation-matrix-v0.1.md",
    "docs/architecture-working-picture-amendment.md",
    "docs/roadmap.md",
    "docs/adr/0015-analytical-portrayal-language.md",
    "docs/adr/0016-analytical-maps-over-graph-substrate.md",
    "docs/adr/0017-working-picture-primary-surface.md",
    "docs/adr/0018-recognition-first-portrayal.md"
)

Push-Location $ProjectRoot
try {
    & $tar.Source -a -c -f $OutputZip @include
    if ($LASTEXITCODE -ne 0) { throw "Research handoff creation failed with exit code $LASTEXITCODE." }
} finally {
    Pop-Location
}

$hash = (Get-FileHash -LiteralPath $OutputZip -Algorithm SHA256).Hash.ToLower()
$sizeMB = [math]::Round((Get-Item -LiteralPath $OutputZip).Length / 1MB, 2)
Write-Host ""
Write-Host "Created: $OutputZip"
Write-Host "Size:    $sizeMB MB"
Write-Host "SHA256:  $hash"
