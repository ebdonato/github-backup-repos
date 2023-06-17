# Github Backup Repositories

## The Script

The script automates the process of cloning GitHub repositories, both public and private, and then zips them into a single file. Here's a breakdown of what the script does:

> Before executing this script, make sure to uncomment and properly set the USERNAME, TOKEN, and REPOS_PER_PAGE variables to match your GitHub credentials and desired configuration.

1. It sets up some initial configuration, including the GitHub username, personal access token, and the number of repositories per page (REPOS_PER_PAGE). Note that in the script you provided, the variables are commented out and need to be uncommented and properly set before executing the script.
1. The script creates a temporary folder, $TMP_FOLDER, to store the cloned repositories.
1. It uses the GitHub API to retrieve a list of repositories associated with the authenticated user. The script uses the provided personal access token for authentication and fetches the repositories using the specified number of repositories per page.
1. For each repository, the script iterates through the list and extracts the repository name from the SSH URL.
1. The script clones each repository into the temporary folder using the HTTPS URL with the provided personal access token for authentication.
1. After cloning or updating each repository, the script continues to the next repository until all repositories have been processed.
1. Next, the script creates a timestamp to generate a unique name for the ZIP file that will contain all the repositories.
1. It changes the working directory to the temporary folder and uses the zip command to recursively compress all the repository contents into a single ZIP file.
1. The script then returns to the previous working directory.
1. Finally, it removes the temporary folder and all cloned repositories.
1. The script concludes by printing a message indicating that all repositories have been downloaded and zipped into the specified file.

> Please note that this script requires jq (a lightweight and flexible command-line JSON processor) to parse the API response, curl to make HTTP requests, and zip to create ZIP files. Make sure you have all of them installed on before running the script.

## The Docker Image

To build the Docker image, save the Dockerfile in a directory, navigate to that directory in the terminal, and run the following command:

```shell
docker build -t github-sync-image .
```

This command builds the image and assigns it the name github-sync-image.

Once the image is built, you can run a container from it, passing the USERNAME and TOKEN as environment variables, and mapping a local folder to the container's volume:

```shell
docker run -e USERNAME=your_username -e TOKEN=your_personal_access_token -e REPOS_PER_PAGE=100-v /path/to/local/folder:/app github-sync-image
```

Setup the environment variables as follows:

-   USERNAME: your GitHub username
-   TOKEN: your personal access token
-   REPOS_PER_PAGE: the number of repositories to retrieve per page. Defaults to 100

Replace `/path/to/local/folder` with the path to the local folder where you want to store backup zipped file locally.

## GitHub Personal Access Token

To generate a personal access token on GitHub, follow these steps:

1. Log in to your GitHub account.
1. Click on your profile icon in the top-right corner, and then click on "Settings" in the dropdown menu.
1. In the left sidebar, click on "Developer settings."
1. In the left sidebar, click on "Personal access tokens."
1. Click on the "Generate new token" button.
1. Provide a meaningful note to describe the token (e.g., "GitHub Sync Script").
1. Select the desired scopes for the token. For your use case, make sure to select the "repo" scope to access repositories. You may also select additional scopes based on your requirements.
1. Click on the "Generate token" button.
1. GitHub will generate a new personal access token. Make sure to copy and save this token in a secure place, as it will only be displayed once.

> Remember that personal access tokens grant significant access to your GitHub account, so treat them with care and avoid sharing them with others.
