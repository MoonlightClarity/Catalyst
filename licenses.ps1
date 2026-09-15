param(
    [string]$ProjectRoot = $PSScriptRoot,
    [switch]$Full
)
$ErrorActionPreference = "Stop"

$Harness = Join-Path $PSScriptRoot "scripts\catalyst-harness.ps1"
if (-not (Test-Path -LiteralPath $Harness -PathType Leaf)) {
    throw "Catalyst harness helper not found: $Harness"
}
. $Harness

$context = Resolve-CatalystProject -ProjectRoot $ProjectRoot
$ProjectRoot = $context.Root
[void](Assert-CatalystLockfile -ProjectRoot $ProjectRoot)
[void](Assert-CatalystNpmScript -Package $context.Package -Name "licenses")
[void](Assert-CatalystDependenciesReady -ProjectRoot $ProjectRoot)
$npm = Get-CatalystNpmCommand
[void](Assert-CatalystLockfileConsistency -ProjectRoot $ProjectRoot -Package $context.Package -NpmCommand $npm)
[void](Assert-CatalystInstalledTree -ProjectRoot $ProjectRoot -NpmCommand $npm)

Write-Host "Checking Catalyst dependency licenses..."
$npmArgs = @("run", "licenses")
if ($Full) { $npmArgs += @("--", "--full") }
Invoke-CatalystNpm -ProjectRoot $ProjectRoot -NpmCommand $npm -Arguments $npmArgs -FailureLabel "License check"
Write-Host ""
Write-Host "Catalyst license check passed."
