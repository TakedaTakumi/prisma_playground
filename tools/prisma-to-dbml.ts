#!/usr/bin/env bun

import { $ } from "bun";
import { existsSync, mkdirSync } from "fs";

const SCHEMA_PATH = "./prisma/schema.prisma";
const SQL_OUTPUT = "./dbml/schema.sql";
const DBML_OUTPUT = "./dbml/schema.dbml";

async function main() {
  console.log("🔄 Converting Prisma schema to DBML...\n");

  // Create dbml directory if it doesn't exist
  if (!existsSync("./dbml")) {
    mkdirSync("./dbml", { recursive: true });
  }

  try {
    // Step 1: Prisma schema -> SQL using prisma migrate
    console.log("📝 Step 1: Generating SQL from Prisma schema...");
    await $`prisma migrate diff \
      --from-empty \
      --to-schema-datamodel ${SCHEMA_PATH} \
      --script > ${SQL_OUTPUT}`;
    console.log(`✅ SQL generated: ${SQL_OUTPUT}\n`);

    // Step 2: SQL -> DBML using @dbml/cli
    console.log("📝 Step 2: Converting SQL to DBML...");
    await $`sql2dbml ${SQL_OUTPUT} --postgres -o ${DBML_OUTPUT}`;
    console.log(`✅ DBML generated: ${DBML_OUTPUT}\n`);

    console.log("🎉 Conversion completed successfully!");
  } catch (error) {
    console.error("❌ Error during conversion:", error);
    process.exit(1);
  }
}

main();
