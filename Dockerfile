FROM alpine:latest

# Install required dependencies
RUN apk update && apk add --no-cache git curl jq zip

# Set the working directory
WORKDIR /app

# Set the default value for REPOS_PER_PAGE
ENV REPOS_PER_PAGE=100

# Copy the script into the container
COPY github_sync.sh /script/github_sync.sh

# Set the script as the entrypoint
ENTRYPOINT ["/bin/sh", "/script/github_sync.sh"]

# Expose the folder with the repositories
VOLUME /app
