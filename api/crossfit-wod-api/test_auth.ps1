# Test script for auth endpoints

# Test 1: Register new user
Write-Host "=== TESTING REGISTER ENDPOINT ===" -ForegroundColor Green
$registerBody = @{
    name = "Fix Test User"
    email = "fixtest3@test.com"
    password = "123456"
    role = "atleta"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "✅ REGISTER SUCCESS:" -ForegroundColor Green
    $registerResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ REGISTER FAILED:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test 2: Login with the registered user  
Write-Host "`n=== TESTING LOGIN ENDPOINT ===" -ForegroundColor Green
$loginBody = @{
    email = "testuser@test.com"  # Using existing user
    password = "123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "✅ LOGIN SUCCESS:" -ForegroundColor Green
    $loginResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ LOGIN FAILED:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}