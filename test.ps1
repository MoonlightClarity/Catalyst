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
$scriptName = if ($Full) { "check:full" } else { "check" }
[void](Assert-CatalystNpmScript -Package $context.Package -Name $scriptName)

[void](Assert-CatalystDependenciesReady -ProjectRoot $ProjectRoot -RequiredCommands @("tsc", "vite"))
$npm = Get-CatalystNpmCommand
[void](Assert-CatalystLockfileConsistency -ProjectRoot $ProjectRoot -Package $context.Package -NpmCommand $npm)
[void](Assert-CatalystInstalledTree -ProjectRoot $ProjectRoot -NpmCommand $npm)

Write-Host "Running Catalyst validation via npm run $scriptName..."
Invoke-CatalystNpm -ProjectRoot $ProjectRoot -NpmCommand $npm -Arguments @("run", $scriptName) -FailureLabel "Catalyst validation"
Write-Host ""
Write-Host "Catalyst validation passed."
