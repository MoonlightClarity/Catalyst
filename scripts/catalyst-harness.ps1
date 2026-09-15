$ErrorActionPreference = "Stop"

function Resolve-CatalystProject {
    param([Parameter(Mandatory = $true)][string]$ProjectRoot)

    if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
        throw "Catalyst project directory was not specified."
    }
    if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container)) {
        throw "Catalyst project directory not found: $ProjectRoot"
    }

    $root = (Resolve-Path -LiteralPath $ProjectRoot).Path
    $packageJson = Join-Path $root "package.json"
    if (-not (Test-Path -LiteralPath $packageJson -PathType Leaf)) {
        throw "package.json not found in Catalyst root: $root"
    }

    try {
        $package = Get-Content -LiteralPath $packageJson -Raw | ConvertFrom-Json
    } catch {
        throw "package.json could not be parsed: $($_.Exception.Message)"
    }

    if ($package.name -ne "catalyst") {
        throw "The selected directory is not a Catalyst project: $root"
    }

    [pscustomobject]@{
        Root = $root
        PackageJson = $packageJson
        Package = $package
    }
}

function Assert-CatalystLockfile {
    param([Parameter(Mandatory = $true)][string]$ProjectRoot)

    $lockPath = Join-Path $ProjectRoot "package-lock.json"
    if (-not (Test-Path -LiteralPath $lockPath -PathType Leaf)) {
        throw "package-lock.json was not found. Catalyst requires it for reproducible dependency state; run install.ps1 -UpdateLockfile only when intentionally creating or regenerating it."
    }
}

function Get-CatalystNpmCommand {
    $npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
    if (-not $npm) { $npm = Get-Command npm -ErrorAction SilentlyContinue }
    if (-not $npm) {
        throw "npm was not found. Install Node.js/npm and try again."
    }
    return $npm.Source
}

function Assert-CatalystNpmScript {
    param(
        [Parameter(Mandatory = $true)]$Package,
        [Parameter(Mandatory = $true)][string]$Name
    )

    if (-not $Package.scripts) {
        throw "package.json does not define any npm scripts."
    }
    $property = $Package.scripts.PSObject.Properties[$Name]
    if (-not $property -or [string]::IsNullOrWhiteSpace([string]$property.Value)) {
        throw "Required npm script '$Name' is missing from package.json."
    }
    return [string]$property.Value
}

function Test-CatalystDependenciesReady {
    param(
        [Parameter(Mandatory = $true)][string]$ProjectRoot,
        [string[]]$RequiredCommands = @()
    )

    $nodeModules = Join-Path $ProjectRoot "node_modules"
    if (-not (Test-Path -LiteralPath $nodeModules -PathType Container)) {
        return $false
    }
    foreach ($command in $RequiredCommands) {
        $commandPath = Join-Path $nodeModules (".bin\{0}.cmd" -f $command)
        if (-not (Test-Path -LiteralPath $commandPath -PathType Leaf)) {
            return $false
        }
    }
    return $true
}

function Assert-CatalystDependenciesReady {
    param(
        [Parameter(Mandatory = $true)][string]$ProjectRoot,
        [string[]]$RequiredCommands = @()
    )

    $nodeModules = Join-Path $ProjectRoot "node_modules"
    if (-not (Test-Path -LiteralPath $nodeModules -PathType Container)) {
        throw "node_modules was not found. Run install.ps1 first."
    }
    foreach ($command in $RequiredCommands) {
        $commandPath = Join-Path $nodeModules (".bin\{0}.cmd" -f $command)
        if (-not (Test-Path -LiteralPath $commandPath -PathType Leaf)) {
            throw "Catalyst dependencies are incomplete: local command '$command' is missing. Run install.ps1 to restore node_modules."
        }
    }
}
function Invoke-CatalystNpm {
    param(
        [Parameter(Mandatory = $true)][string]$ProjectRoot,
        [Parameter(Mandatory = $true)][string]$NpmCommand,
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [Parameter(Mandatory = $true)][string]$FailureLabel,
        [switch]$Quiet
    )

    Push-Location $ProjectRoot
    try {
        $nativeOutput = $null
        if ($Quiet) {
            $nativeOutput = & $NpmCommand @Arguments 2>&1
        } else {
            & $NpmCommand @Arguments
        }
        $nativeExitCode = $LASTEXITCODE
        if ($null -eq $nativeExitCode) {
            throw "$FailureLabel did not report a native process exit code."
        }
        if ($nativeExitCode -ne 0) {
            $detail = ""
            if ($Quiet -and $nativeOutput) {
                $tail = @($nativeOutput | ForEach-Object { [string]$_ } | Select-Object -Last 12)
                if ($tail.Count -gt 0) { $detail = "`n" + ($tail -join "`n") }
            }
            throw "$FailureLabel failed with exit code $nativeExitCode.$detail"
        }
    } finally {
        Pop-Location
    }
}

function Assert-CatalystLockfileConsistency {
    param(
        [Parameter(Mandatory = $true)][string]$ProjectRoot,
        [Parameter(Mandatory = $true)]$Package,
        [Parameter(Mandatory = $true)][string]$NpmCommand
    )

    [void](Assert-CatalystNpmScript -Package $Package -Name "lockfile:check")
    try {
        Invoke-CatalystNpm -ProjectRoot $ProjectRoot -NpmCommand $NpmCommand -Arguments @("run", "lockfile:check") -FailureLabel "Lockfile consistency check" -Quiet
    } catch {
        throw "Catalyst package-lock.json is not consistent with package.json. $($_.Exception.Message)"
    }
}

function Assert-CatalystInstalledTree {
    param(
        [Parameter(Mandatory = $true)][string]$ProjectRoot,
        [Parameter(Mandatory = $true)][string]$NpmCommand
    )

    try {
        Invoke-CatalystNpm -ProjectRoot $ProjectRoot -NpmCommand $NpmCommand -Arguments @("ls", "--depth=0", "--json") -FailureLabel "Installed dependency tree check" -Quiet
    } catch {
        throw "Catalyst installed dependencies do not satisfy package.json. Run install.ps1 to restore node_modules. $($_.Exception.Message)"
    }
}
