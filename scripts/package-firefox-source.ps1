$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$package = Get-Content (Join-Path $root 'package.json') -Raw | ConvertFrom-Json
$source = Join-Path $root 'release\firefox-source'
$archive = Join-Path $root ("release\catalyst-" + $package.version + "-source.zip")

if (-not (Test-Path $source)) {
  throw 'release\firefox-source does not exist. Run the source staging script first.'
}

if (Test-Path $archive) {
  Remove-Item $archive -Force
}

Compress-Archive -Path (Join-Path $source '*') -DestinationPath $archive -CompressionLevel Optimal
Write-Output ("Firefox reviewer source archive: " + $archive)
