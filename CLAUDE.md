# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes essentielles

```bash
# Développement (toutes les apps en parallèle via Turborepo)
pnpm dev

# Build complet (respecte les dépendances inter-packages via Turbo)
pnpm build

# Build d'un package spécifique
pnpm --filter @maestro/domain build
pnpm --filter @maestro/application build
pnpm --filter @maestro/infrastructure build
pnpm --filter @maestro/web build

# Typecheck (nécessite que les packages soient buildés en amont)
pnpm typecheck

# Tests unitaires
pnpm test:unit          # run une fois
pnpm test:watch         # mode watch

# Lint
pnpm lint

# Prisma (depuis packages/database)
DATABASE_URL="..." pnpm exec prisma generate   # après modification du schéma
pnpm --filter @maestro/database migrate        # appliquer migrations (dev)
pnpm --filter @maestro/database studio         # Prisma Studio

# Nettoyage complet
pnpm clean && pnpm install
```

## Architecture — Clean / Hexagonal DDD

```
maestro/
├── apps/web/               → @maestro/web (Next.js 16)
│
├── packages/
│   ├── domain/             → @maestro/domain  — Domaine pur (zod uniquement)
│   ├── application/        → @maestro/application — Use cases + DTOs
│   ├── infrastructure/     → @maestro/infrastructure — Adaptateurs concrets
│   ├── database/           → @maestro/database — Prisma + singleton client
│   └── ui/                 → @maestro/ui — Composants React partagés
│
└── tsconfig/               → Configs TypeScript partagées (library, nextjs, react-library)
```

## Graphe de dépendances (règle stricte)

```
domain       ← zod uniquement (aucune dep infra)
application  ← @maestro/domain
infrastructure ← domain + application + database + [ai-sdk, tsyringe, uuid, zod]
web          ← application + infrastructure + ui + [next, react-query, dnd-kit, zod]
```

**Règle d'or** : ne jamais importer `infrastructure` ou `database` depuis `domain` ou `application`.

## Structure interne de `@maestro/domain`

Bounded contexts organisés en dossiers :

```
src/
├── shared/value-objects/Money.ts   → VO Money réutilisable
├── shared/errors/DomainError.ts    → classe d'erreur de base
├── quote/entities/Quote.ts         → QuoteEntity, QuoteItemVO, QuoteSchema (Zod), types
├── quote/ports/IQuoteRepository.ts → interface repository (port sortant)
├── quote/ports/IAIQuoteService.ts  → interface service IA (port sortant)
├── company/, user/, finance/, regulatory/  → autres bounded contexts
└── index.ts                        → re-export public API
```

## Structure interne de `@maestro/infrastructure`

```
src/
├── persistence/in-memory/InMemoryQuoteRepository.ts
├── persistence/prisma/repositories/PrismaQuoteRepository.ts
├── persistence/prisma/mappers/QuoteMapper.ts
├── ai/groq/GroqAIQuoteService.ts   → implémente IAIQuoteService via Groq llama-3.3-70b
├── ai/schemas/AIQuoteSchema.ts     → schéma Zod tolérant pour output IA
├── ai/utils/normalizeUnit.ts
└── container/Container.ts          → tsyringe DI (SANS décorateurs)
```

## Injection de dépendances — Règle critique

**Ne jamais utiliser les décorateurs tsyringe** (`@singleton`, `@injectable`, `@inject`) dans les packages — ils causent un crash Next.js/Turbopack.

Uniquement :
```ts
container.register('IAIQuoteService', { useClass: GroqAIQuoteService });
container.register('IQuoteRepository', { useClass: InMemoryQuoteRepository });
```

## Flux principal — Génération de devis par voix

```
QuoteClient (client)
  → useGenerateQuote (TanStack Query mutation)
  → processVoiceAction (Server Action — apps/web/app/(main)/quote/actions.ts)
  → container.resolve() [infrastructure]
  → new CreateQuoteFromVoice(aiService, repository) [application]
  → CreateQuoteFromVoice.execute(input)
    → GroqAIQuoteService.processVoiceToQuote(transcript) [Groq API]
    → QuoteSchema.parse() [domain validation]
    → QuoteEntity.fromJSON() [domain entity]
    → repository.save(entity) [persistence]
```

## Variables d'environnement requises

| Variable | Usage |
|----------|-------|
| `GROQ_API_KEY` | Groq llama-3.3-70b — génération de devis par voix |
| `DATABASE_URL` | PostgreSQL via Prisma (PrismaQuoteRepository) |

Copier `.env.example` → `.env.local` dans `apps/web/`.

## Configs TypeScript partagées

| Fichier | Usage |
|---------|-------|
| `tsconfig/base.json` | Base pour tous |
| `tsconfig/library.json` | Packages compilés vers `dist/` |
| `tsconfig/react-library.json` | Package UI (JSX + DOM) |
| `tsconfig/nextjs.json` | App Next.js (noEmit, jsx: preserve) |

## Prisma 7

- Schéma : `packages/database/prisma/schema.prisma` (enums typés)
- Config : `packages/database/prisma.config.ts` (DATABASE_URL depuis env)
- Singleton client : `packages/database/src/client.ts` (guard global anti-hot-reload)
- **Breaking change Prisma 7** : le schéma ne doit PAS contenir `url = env(...)` dans `datasource`
- Toujours relancer `prisma generate` depuis `packages/database` après modification du schéma

## Tests (Vitest)

Config racine : `vitest.config.ts` (projets : domain + application)

- Unit tests domain : `packages/domain/src/**/tests/*.test.ts`
- Unit tests application : `packages/application/src/**/__tests__/*.test.ts`
- Les tests infrastructure nécessitent une BDD — hors scope des unit tests

## Next.js 16

Cette version peut avoir des breaking changes vs versions antérieures. Consulter `node_modules/next/dist/docs/` avant d'écrire du code Next.js.
