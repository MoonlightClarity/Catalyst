$wins = Get-Process opera -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }
$wins | Select-Object Id, MainWindowHandle, MainWindowTitle | Format-List
$target = $wins | Where-Object { $_.MainWindowTitle -like '*Catalyst*' } | Select-Object -First 1
if (-not $target) { Write-Output 'NO_CATALYST_WINDOW'; exit 2 }
$ws = New-Object -ComObject WScript.Shell
$activated = $ws.AppActivate($target.Id)
Start-Sleep -Milliseconds 400
Write-Output ("ACTIVATED=" + $activated + "; TITLE=" + $target.MainWindowTitle)
$ws.SendKeys('{F6}')
Write-Output 'F6_SENT_TO_CATALYST_WINDOW'
