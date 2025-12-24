try {
    $body = @{ username = 'admin'; password = 'admin' } | ConvertTo-Json
    $r = Invoke-WebRequest -Uri 'http://localhost:8082/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10
    Write-Host 'STATUS:' $r.StatusCode
    Write-Host 'BODY:'
    Write-Host $r.Content
} catch {
    if ($_.Exception.Response -ne $null) {
        $resp = $_.Exception.Response
        $stream = $resp.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host 'ERROR-STATUS:' $resp.StatusCode
        Write-Host 'ERROR-BODY:'
        Write-Host ($reader.ReadToEnd())
    } else {
        Write-Host 'ERROR:' $_.Exception.Message
    }
}
