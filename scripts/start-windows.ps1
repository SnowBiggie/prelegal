$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
docker compose up --build -d
Write-Host "Prelegal is running at http://localhost:8000"
