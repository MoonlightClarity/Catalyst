param(
  [Parameter(Mandatory=$true)][string]$ChatUrl,
  [ValidateSet('draft','send')][string]$Action = 'draft',
  [Parameter(Mandatory=$true)][string]$Message
)

$Key = 'cb_fe30e99f006b4f9c92ad5c9d83390cf9'
$bytes = [System.Text.Encoding]::UTF8.GetBytes($Message)
$payload = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+','-').Replace('/','_')
$baseUrl = $ChatUrl.Split('#')[0]
Write-Output "$baseUrl#catalyst-bridge=$Key.$Action.$payload"
