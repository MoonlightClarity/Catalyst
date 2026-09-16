param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$OutputDirectory,
    [switch]$Force,
    [switch]$KeepTemp
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path $ProjectRoot).Path
$Staging = Join-Path $ProjectRoot 'release\user-build'
if (-not $OutputDirectory) {
    $OutputDirectory = Join-Path $ProjectRoot 'release\package-output'
}
$FinalOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$TempOutput = Join-Path $env:TEMP "Catalyst-package-output-$Timestamp"

Write-Host 'Verifying Catalyst release staging...'
Push-Location $ProjectRoot
try {
    & npm.cmd run release:verify
    if ($LASTEXITCODE -ne 0) { throw 'Release staging verification failed.' }
}
finally {
    Pop-Location
}

$Package = Get-Content (Join-Path $Staging 'package.json') -Raw | ConvertFrom-Json
$ArtifactName = $Package.build.win.artifactName
if (-not $ArtifactName) { throw 'Desktop release package is missing build.win.artifactName.' }
$BuiltArtifact = Join-Path $TempOutput $ArtifactName
$FinalArtifact = Join-Path $FinalOutput $ArtifactName
if ((Test-Path -LiteralPath $FinalArtifact) -and -not $Force) {
    throw "Refusing to overwrite existing artifact without -Force: $FinalArtifact"
}

New-Item -ItemType Directory -Force -Path $TempOutput, $FinalOutput | Out-Null
Write-Host "Packaging portable build via temporary output: $TempOutput"
Push-Location $Staging
try {
    & npx.cmd electron-builder --win portable "--config.directories.output=$TempOutput"
    if ($LASTEXITCODE -ne 0) { throw 'electron-builder failed.' }
}
finally {
    Pop-Location
}

if (-not (Test-Path -LiteralPath $BuiltArtifact)) {
    throw "Expected portable artifact was not produced: $BuiltArtifact"
}
Copy-Item -LiteralPath $BuiltArtifact -Destination $FinalArtifact -Force
$Hash = (Get-FileHash -LiteralPath $FinalArtifact -Algorithm SHA256).Hash.ToLowerInvariant()
$ChecksumPath = "$FinalArtifact.sha256"
Set-Content -LiteralPath $ChecksumPath -Encoding ascii -Value "$Hash  $ArtifactName"
Write-Host "Portable artifact: $FinalArtifact"
Write-Host "SHA-256: $Hash"
Write-Host "Checksum file: $ChecksumPath"
if (-not $KeepTemp) { Remove-Item -LiteralPath $TempOutput -Recurse -Force }
