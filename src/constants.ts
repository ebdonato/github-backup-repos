import "dotenv/config";

export const PORT = process.env.PORT || "3000";

export const FILENAME = process.env.FILENAME || "github_repositories.zip";

export const BEARER_TOKEN =
    process.env.BEARER_TOKEN || "abcdefghijklmnopqrstuvwxyz";

export const LIMITER_MINUTES = parseInt(process.env.LIMITER_MINUTES || "2");

export const LIMITER_MAX_REQUEST = parseInt(
    process.env.LIMITER_MAX_REQUEST || "5"
);

export const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "ebdonato";

export const GITHUB_TOKEN =
    process.env.GITHUB_TOKEN || "abcdefghijklmnopqrstuvwxyz";

export const GITHUB_REPOS_PER_PAGE = process.env.GITHUB_REPOS_PER_PAGE || 100;
