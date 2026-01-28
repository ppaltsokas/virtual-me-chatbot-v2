param($file)
$content = Get-Content $file
$newContent = $content | ForEach-Object {
    if ($_ -match '^pick ced73dd') {
        $_ -replace '^pick', 'reword'
    } else {
        $_
    }
}
Set-Content -Path $file -Value $newContent
