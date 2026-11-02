@echo off
title Museverse Mobile MCP Launcher
cd /d %~dp0
echo =========================================================
echo  Starting Museverse MCP Server + Cloudflare Tunnel...
echo =========================================================
echo.
:: 1. Start MCP Server in a new window
start "Museverse MCP Server" cmd /k "python mcp_server.py --sse"

:: 2. Wait 2 seconds for server to start
timeout /t 2 /nobreak > nul

:: 3. Start Cloudflare Tunnel in a new window
start "Cloudflare Tunnel" cmd /k "\"C:\Program Files (x86)\cloudflared\cloudflared.exe\" tunnel --url http://localhost:8000"

echo.
echo [OK] Both windows have opened!
echo Look at the Cloudflare Tunnel window to copy your https://...trycloudflare.com link.
echo.
pause
