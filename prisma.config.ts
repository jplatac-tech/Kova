import "dotenv/config";
import { defineConfig } from "prisma/config";
import { getDatabaseUrl, sanitizeDatabaseUrl } from "./src/lib/database-url";

const url = sanitizeDatabaseUrl(
  process.env.POSTGRES_URL_NON_POOLING?.trim() || getDatabaseUrl(),
);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
