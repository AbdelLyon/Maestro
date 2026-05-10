import "reflect-metadata"; // IMPORTANT : Toujours en premier
import { container } from "tsyringe";
import { InMemoryQuoteRepository } from "./InMemoryQuoteRepository";
import { AIQuoteService } from "./services/AIQuoteService";

// On lie les noms (tokens) aux classes réelles
container.register("IAIQuoteService", { useClass: AIQuoteService });
container.register("IQuoteRepository", { useClass: InMemoryQuoteRepository });

export { container };