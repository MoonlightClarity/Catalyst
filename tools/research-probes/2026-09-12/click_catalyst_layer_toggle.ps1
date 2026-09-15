Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class NativeMouse {
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint flags, uint dx, uint dy, uint data, UIntPtr info);
}
'@
$target = Get-Process opera -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*Catalyst*' } | Select-Object -First 1
$ws = New-Object -ComObject WScript.Shell
$null = $ws.AppActivate($target.Id)
Start-Sleep -Milliseconds 400
[NativeMouse]::SetCursorPos(1445,90) | Out-Null
[NativeMouse]::mouse_event(0x0002,0,0,0,[UIntPtr]::Zero)
[NativeMouse]::mouse_event(0x0004,0,0,0,[UIntPtr]::Zero)
Write-Output 'LAYER_TOGGLE_CLICK_SENT'
