param(
    [string]$ProjectRoot = $PSScriptRoot,
    [switch]$SkipInstall
)
$ErrorActionPreference = "Stop"

function Test-CatalystDevServer {
    param([int]$Attempts = 2)

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        try {
            $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:5173" -TimeoutSec 2
            if ($response.StatusCode -eq 200 -and $response.Content -match "<title>\s*Catalyst\s*</title>") {
                return $true
            }
        } catch {
            # A busy or still-starting local dev server can miss one probe.
        }
        if ($attempt -lt $Attempts) { Start-Sleep -Milliseconds 250 }
    }
    return $false
}

$Harness = Join-Path $PSScriptRoot "scripts\catalyst-harness.ps1"
if (-not (Test-Path -LiteralPath $Harness -PathType Leaf)) {
    throw "Catalyst harness helper not found: $Harness"
}
. $Harness

$context = Resolve-CatalystProject -ProjectRoot $ProjectRoot
$ProjectRoot = $context.Root
[void](Assert-CatalystLockfile -ProjectRoot $ProjectRoot)
[void](Assert-CatalystNpmScript -Package $context.Package -Name "dev")
$npm = Get-CatalystNpmCommand
[void](Assert-CatalystLockfileConsistency -ProjectRoot $ProjectRoot -Package $context.Package -NpmCommand $npm)
$dependenciesReady = Test-CatalystDependenciesReady -ProjectRoot $ProjectRoot -RequiredCommands @("vite")
$dependencyProblem = $null
if ($dependenciesReady) {
    try {
        [void](Assert-CatalystInstalledTree -ProjectRoot $ProjectRoot -NpmCommand $npm)
    } catch {
        $dependencyProblem = $_.Exception.Message
        $dependenciesReady = $false
    }
}

if (-not $dependenciesReady) {
    if ($SkipInstall) {
        if ($dependencyProblem) {
            throw "$dependencyProblem Rerun run.ps1 without -SkipInstall to restore dependencies."
        }
        throw "Catalyst dependencies are missing or incomplete. Run install.ps1, or rerun run.ps1 without -SkipInstall."
    }
    $installScript = Join-Path $ProjectRoot "install.ps1"
    if (-not (Test-Path -LiteralPath $installScript -PathType Leaf)) {
        throw "install.ps1 was not found in Catalyst root: $ProjectRoot"
    }
    & $installScript -ProjectRoot $ProjectRoot
    $dependenciesReady = Test-CatalystDependenciesReady -ProjectRoot $ProjectRoot -RequiredCommands @("vite")
    if (-not $dependenciesReady) {
        throw "Catalyst dependency installation completed, but the Vite runtime is still missing from node_modules."
    }
}

$alreadyRunning = Test-CatalystDevServer
if ($alreadyRunning) {
    Write-Host "Catalyst is already running at http://127.0.0.1:5173."
    return
}

try {
    $portOccupied = Test-NetConnection -ComputerName 127.0.0.1 -Port 5173 -InformationLevel Quiet -WarningAction SilentlyContinue
} catch {
    $portOccupied = $false
}
if ($portOccupied) {
    throw "Port 5173 is in use, but Catalyst did not respond to the local identity check. If Catalyst is still starting, retry run.ps1; otherwise stop the process using port 5173."
}

Write-Host "Starting Catalyst with the XML-backed web runtime at http://127.0.0.1:5173..."
Invoke-CatalystNpm -ProjectRoot $ProjectRoot -NpmCommand $npm -Arguments @("run", "dev", "--", "--strictPort") -FailureLabel "Catalyst dev runtime"
