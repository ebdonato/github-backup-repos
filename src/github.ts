import * as fs from "fs";
import AdmZip from "adm-zip";
import fetch from "node-fetch";
import shell from "shelljs";

import {
    FILENAME,
    GITHUB_USERNAME,
    GITHUB_TOKEN,
    GITHUB_REPOS_PER_PAGE,
} from "./constants";

export async function getAllRepositories(folderName = "temp") {
    const folderPath = `./${folderName}`;

    try {
        const response = await fetch(
            `https://api.github.com/user/repos?per_page=${GITHUB_REPOS_PER_PAGE}`,
            {
                method: "GET",
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        const repositories = (await response.json()) as {
            name: string;
            owner: { login: string };
        }[];

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
