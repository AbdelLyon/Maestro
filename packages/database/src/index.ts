 // packages/database/src/index.ts
// Entry point du package @maestro/database

// Ré-export “tout” depuis le client Prisma généré.
// On évite les exports nommés (PrismaClient/Prisma) qui peuvent varier selon la version générée.
export * from "@prisma/client";
