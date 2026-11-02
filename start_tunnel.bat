@echo off
title Cloudflare Tunnel for Claude Mobile
cd /d "%~dp0"
echo ===================================================
echo  Starting Cloudflare Quick Tunnel for Museverse MCP
echo  Target: http://localhost:8000
echo ===================================================
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:8000
pause
