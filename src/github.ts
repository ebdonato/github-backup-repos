import * as fs from "fs";
import AdmZip from "adm-zip";
import axios from "axios";
import shell from "shelljs";

import {
    FILENAME,
    GITHUB_USERNAME,
    GITHUB_TOKEN,
    GITHUB_REPOS_PER_PAGE,
} from "./constants";

interface GitHubRepoInfo {
    name: string;
    owner: {
        login: string;
    };
}

export async function getAllRepositories(folderName = "temp") {
    const folderPath = `./${folderName}`;

    try {
        const url = `https://api.github.com/user/repos?per_page=${GITHUB_REPOS_PER_PAGE}`;

        const response = await axios({
            url,
            method: "GET",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        const repositories = response.data as GitHubRepoInfo[];

        !fs.existsSync(folderPath) && fs.mkdirSync(folderPath);
        !fs.existsSync("public") && fs.mkdirSync("public");

        const zip = new AdmZip();

        shell.cd(folderPath);
        shell.rm("-rf", ".");

        for (const repository of repositories) {
            const repoName = repository.name;
            const repoOwner = repository.owner.login;

            if (repoOwner !== GITHUB_USERNAME) continue;

            const repoUrl = `https://${GITHUB_TOKEN}:x-oauth-basic@github.com/${GITHUB_USERNAME}/${repoName}`;

            if (shell.exec(`git clone "${repoUrl}"`).code === 0) {
                zip.addLocalFolder(repoName);
                console.log(`Repository ${repoName} cloned successfully!`);
            }
        }

        shell.cd("..");
        zip.writeZip("public/" + FILENAME);
        shell.rm("-rf", folderName);

        console.log("Repositories cloned and zipped successfully!");
    } catch (error: unknown) {
        console.error("Github Error:", error);
    }
}
