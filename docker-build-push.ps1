# Set-ExecutionPolicy Bypass -Scope Process -Force; .\docker-build-push.ps1

param
(
    $dockeruser = "ebdonato"
)

# Get the current directory name
$currentDir = (Get-Item -Path ".\").Name

# Build the Docker image with the current directory name as the image name
Write-Host "Building Image"
docker build -t $currentDir .

# Tag the image with the Docker Hub repository URL
$imageTag = "$dockeruser/$currentDir"

# Tag the image with the Docker Hub repository URL
docker tag $currentDir $imageTag

# Login to Docker Hub
docker login

Write-Host "Pushing Image"
# Push the image to Docker Hub
docker push $imageTag
