// ─── Conteneur DI ─────────────────────────────────────────────────────────────
export { container } from './container/Container';

// ─── Repositories ─────────────────────────────────────────────────────────────
export { InMemoryQuoteRepository } from './persistence/in-memory/InMemoryQuoteRepository';
export { PrismaQuoteRepository } from './persistence/prisma/repositories/PrismaQuoteRepository';

// ─── Services IA ──────────────────────────────────────────────────────────────
export { GroqAIQuoteService } from './ai/groq/GroqAIQuoteService';
