@echo off
title Museverse MCP Server (SSE Mode)
cd /d "%~dp0"
echo ===================================================
echo  Starting Museverse MCP Server in SSE Mode
echo  Ready for Claude Mobile and Claude Web
echo ===================================================
python mcp_server.py --sse
pause
