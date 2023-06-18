import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import parseBearerToken from "parse-bearer-token";

import { getAllRepositories } from "./github";
import {
    BEARER_TOKEN,
    FILENAME,
    LIMITER_MAX_REQUEST,
    LIMITER_MINUTES,
    PORT,
} from "./constants";

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(
    rateLimit({
        windowMs: LIMITER_MINUTES * 60 * 1000,
        max: LIMITER_MAX_REQUEST,
        standardHeaders: true,
        message: "Bloqueado por excesso de requisições. Tente mais tarde.",
    })
);

app.get("/", async (req, res) => {
    try {
        const token = parseBearerToken(req);

        if (!token) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        if (token !== BEARER_TOKEN) {
            res.status(403).send({ message: "Unauthorized" });
            return;
        }

        await getAllRepositories();

        res.setHeader("Content-Type", "application/zip");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${FILENAME}`
        );

        const filePath = path.join(__dirname, "../public", FILENAME);

        res.sendFile(filePath);
    } catch (error: unknown) {
        const errorMessage = (error as Error).message;

        res.status(500).send({ error: errorMessage });
    }
});

app.get("/health", (_, res) => {
    res.send("Hello World!");
});

app.all("*", (_, res) => {
    res.status(404).send("🚫 Rota Inválida 🚫");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
