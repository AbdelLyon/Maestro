// ============================================================================
// Domain Layer
// ============================================================================

// Entities
export * from "./domain/entities/Quote";
export * from "./domain/entities/Company";
export * from "./domain/entities/User";
export * from "./domain/entities/Invoice";
export * from "./domain/entities/CashFlowEvent";
export * from "./domain/entities/GrantRule";
export * from "./domain/entities/ProjectGrant";

// Interfaces
export * from "./domain/interfaces/IAIService";
export * from "./domain/interfaces/IQuoteRepository";

// Use Cases
export * from "./domain/use-cases/CreateQuoteFromVoice";

// ============================================================================
// Infrastructure Layer
// ============================================================================

// Services
export * from "./infrastructure/services/AIQuoteService";

// Repositories
export * from "./infrastructure/InMemoryQuoteRepository";

// Dependency Injection Container
export { container } from "./infrastructure/Container";

// ============================================================================
// Utils
// ============================================================================

export * from "./utils/normalizeUnit";
