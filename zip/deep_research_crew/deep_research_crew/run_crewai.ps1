$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$venvScripts = Join-Path $projectRoot ".venv\Scripts"

$env:PATH = "$venvScripts;$env:PATH"
$env:CREWAI_DMN = "1"
$env:PYTHONIOENCODING = "utf-8"

Set-Location $projectRoot
& (Join-Path $venvScripts "crewai.exe") run
