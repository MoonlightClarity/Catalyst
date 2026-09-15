param(
    [string]$ProjectRoot = $PSScriptRoot,
    [switch]$SkipInstall,
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

# Retained only as a guard for old instructions or saved shell history.
# The 0.6.3 overlay upgrader used release-manifest/Tauri assumptions and
# duplicated validation that is now owned by the canonical root scripts.
$installCommand = "powershell -File .\install.ps1"
$testCommand = "powershell -File .\test.ps1 -Full"

throw @"
upgrade_063.ps1 is retired and must not be used on the current Catalyst workspace.
It belonged to the old 0.6.3 overlay flow and can no longer safely validate or mutate this source tree.

Use the canonical harness instead:
  Install dependencies: $installCommand
  Full validation:      $testCommand
  Start Catalyst:       powershell -File .\run.ps1

Project root supplied: $ProjectRoot
"@
