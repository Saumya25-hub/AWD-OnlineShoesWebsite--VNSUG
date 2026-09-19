@echo off
setlocal enabledelayedexpansion
title Online Shoes Store - One-Click Launcher (React AWD)
color 0E

echo ==============================================================================
echo          ONLINE SHOES STORE - ONE-CLICK LAUNCHER
echo          BCA Semester 5 - 501 Advanced Web Development (AWD)
echo ==============================================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

:: -------------------------------------------------------------
:: 1. Start Backend Server (Express + MongoDB on Port 5000)
:: -------------------------------------------------------------
echo [*] Starting Backend Server (Port 5000)...
cd /d "%PROJECT_DIR%backend"
start "ShoeStore Backend" cmd.exe /k "title ShoeStore Backend (Port 5000) && node server.js"

timeout /t 2 /nobreak >NUL

:: -------------------------------------------------------------
:: 2. Start Frontend Server (Vite + React on Port 5173)
:: -------------------------------------------------------------
echo [*] Starting Frontend Server (Port 5173)...
cd /d "%PROJECT_DIR%frontend"
start "ShoeStore Frontend" cmd.exe /k "title ShoeStore Frontend (Port 5173) && npm.cmd run dev"

timeout /t 3 /nobreak >NUL

:: -------------------------------------------------------------
:: 3. Open React Website in Browser (Client & Admin Tabs)
:: -------------------------------------------------------------
echo.
echo ==============================================================================
echo [SUCCESS] Opening Online Shoes Store in your browser tabs:
echo           1. Client Store: http://localhost:5173/
echo           2. Admin Panel:  http://localhost:5173/admin
echo ==============================================================================
echo.

:: Open Client Website in tab 1
start "" "http://localhost:5173/"

:: Short wait to allow the browser to register the first tab before opening the second
timeout /t 2 /nobreak >NUL

:: Open Admin Panel in tab 2
start "" "http://localhost:5173/admin"

echo Demo Credentials for Store:
echo   - Customer: rahul@gmail.com        ^| Password: user123
echo   - Admin:    admin@shoestore.com    ^| Password: admin123
echo.
echo Keep the Backend and Frontend command windows open while testing.
echo Press any key to close this launcher window...
pause >NUL
