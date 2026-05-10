// packages/core/src/index.ts

import "reflect-metadata"; // Crucial pour que les décorateurs fonctionnent partout

export * from './domain/entities/Quote';
export * from './domain/interfaces/IAIService';
export * from './domain/interfaces/IQuoteRepository';
export * from './domain/use-cases/CreateQuoteFromVoice';
export * from './infrastructure/services/AIQuoteService';
export * from './infrastructure/InMemoryQuoteRepository';
export * from './utils/normalizeUnit';

// AJOUTE CECI :
export { container } from './infrastructure/Container';