Add-Type @'
using System;
using System.Text;
using System.Runtime.InteropServices;
public class WinEnum {
  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc cb, IntPtr lp);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int max);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
}
'@
$rows = New-Object System.Collections.Generic.List[object]
[WinEnum]::EnumWindows({ param($h,$l)
  if([WinEnum]::IsWindowVisible($h)){
    $sb=New-Object Text.StringBuilder 512; [void][WinEnum]::GetWindowText($h,$sb,512)
    [uint32]$procId=0; [void][WinEnum]::GetWindowThreadProcessId($h,[ref]$procId)
    $p=Get-Process -Id $procId -ErrorAction SilentlyContinue
    if($p -and $p.ProcessName -eq 'opera' -and $sb.Length -gt 0){
      $rows.Add([pscustomobject]@{Handle=$h;Pid=$procId;Title=$sb.ToString()})
    }
  }; return $true
},[IntPtr]::Zero) | Out-Null
$rows | Format-Table -AutoSize
