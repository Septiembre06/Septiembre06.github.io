Param()

Write-Host "Este script inicializará git y empujará al remoto que indiques."
$remote = Read-Host "Pega la URL del remoto (ej: https://github.com/TU_USUARIO/TU_REPO.git)"
if(-not $remote){ Write-Host "No se proporcionó remoto. Abortando."; exit 1 }

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin $remote
Write-Host "Empujando a $remote ..."
git push -u origin main

Write-Host "Hecho. Si activas GitHub Pages en el repo, la página estará disponible en unos minutos."
