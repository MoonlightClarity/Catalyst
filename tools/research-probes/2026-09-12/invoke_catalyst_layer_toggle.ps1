Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
$target = Get-Process opera -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*Catalyst*' } | Select-Object -First 1
if (-not $target) { Write-Output 'NO_CATALYST_WINDOW'; exit 2 }
$root = [System.Windows.Automation.AutomationElement]::FromHandle($target.MainWindowHandle)
$cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::NameProperty, 'Source above · F6')
$el = $root.FindFirst([System.Windows.Automation.TreeScope]::Descendants, $cond)
if (-not $el) { Write-Output 'TOGGLE_NOT_FOUND'; exit 3 }
Write-Output ("FOUND=" + $el.Current.ControlType.ProgrammaticName + '; NAME=' + $el.Current.Name)
$pattern = $el.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern)
$pattern.Invoke()
Write-Output 'TOGGLE_INVOKED'
