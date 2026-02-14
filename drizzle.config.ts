// @ts-nocheck
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    dialect: "sqlite",
    schema: "./lib/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL || "file:sqlite.db",
        authToken: process.env.TURSO_AUTH_TOKEN,
    },
});
