param(
    [string]$ProjectRoot = $PSScriptRoot,
    [Alias("Install")]
    [switch]$UpdateLockfile
)
$ErrorActionPreference = "Stop"

$Harness = Join-Path $PSScriptRoot "scripts\catalyst-harness.ps1"
if (-not (Test-Path -LiteralPath $Harness -PathType Leaf)) {
    throw "Catalyst harness helper not found: $Harness"
}
. $Harness

$context = Resolve-CatalystProject -ProjectRoot $ProjectRoot
$ProjectRoot = $context.Root
if (-not $UpdateLockfile) {
    [void](Assert-CatalystLockfile -ProjectRoot $ProjectRoot)
}
$npm = Get-CatalystNpmCommand
$installMode = if ($UpdateLockfile) { "install" } else { "ci" }

if ($UpdateLockfile) {
    Write-Host "Installing Catalyst dependencies with npm install (lockfile updates allowed)..."
} else {
    Write-Host "Installing Catalyst dependencies with npm $installMode..."
}
Invoke-CatalystNpm -ProjectRoot $ProjectRoot -NpmCommand $npm -Arguments @($installMode) -FailureLabel "Dependency installation"

try {
    [void](Assert-CatalystDependenciesReady -ProjectRoot $ProjectRoot -RequiredCommands @("tsc", "vite"))
    [void](Assert-CatalystInstalledTree -ProjectRoot $ProjectRoot -NpmCommand $npm)
    [void](Assert-CatalystLockfileConsistency -ProjectRoot $ProjectRoot -Package $context.Package -NpmCommand $npm)
} catch {
    throw "npm $installMode reported success, but Catalyst dependency state is incomplete or inconsistent. $($_.Exception.Message)"
}

Write-Host ""
Write-Host "Catalyst dependencies installed successfully."
