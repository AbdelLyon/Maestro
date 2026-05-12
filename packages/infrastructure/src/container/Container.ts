import { container } from 'tsyringe';
import { InMemoryQuoteRepository } from '../persistence/in-memory/InMemoryQuoteRepository';
import { GroqAIQuoteService } from '../ai/groq/GroqAIQuoteService';

container.register('IAIQuoteService', { useClass: GroqAIQuoteService });
container.register('IQuoteRepository', { useClass: InMemoryQuoteRepository });

export { container };
