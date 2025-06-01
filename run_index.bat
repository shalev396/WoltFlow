@echo off
REM --------------------------------------------
REM run_index.bat
REM    - Detects if PC just booted (≤ 5 min)
REM    - Runs index.py inside the .venv
REM    - If just booted, shuts down immediately afterward
REM --------------------------------------------

REM 1) Compute system uptime (minutes) via PowerShell
for /f %%u in ('
    powershell -NoProfile -Command ^
      "[math]::Floor((New-TimeSpan -Start (Get-CimInstance Win32_OperatingSystem).LastBootUpTime -End (Get-Date)).TotalMinutes)"
') do set "UPTIME=%%u"

echo System uptime is %UPTIME% minute(s).

REM 2) Change to the project directory
cd /d "C:\Projects\My Github\WoltFlow\Server\WoltFlow"

REM 3) Run the Python script inside the virtual environment
"C:\Projects\My Github\WoltFlow\Server\WoltFlow\.venv\Scripts\python.exe" "C:\Projects\My Github\WoltFlow\Server\WoltFlow\index.py"

REM 4) If PC just booted (uptime ≤ 5), shut it down
if %UPTIME% LEQ 15 (
    echo Uptime ≤ 15 minutes → shutting down PC.
    shutdown /s /t 0
) else (
    echo Uptime > 15 minutes → leaving PC on.
)

