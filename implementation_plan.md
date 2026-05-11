# Implementation Plan

[Overview]
Supprimer tous les décorateurs `tsyringe` (`@singleton`, `@injectable`, `@inject`) dans `packages/core` afin d’éviter un crash Next/Turbopack sur le token `@`, tout en conservant la résolution des dépendances via `container.register(...)` avec des constructeurs “plain”.

Le crash observé pointe vers du code Next/Turbopack généré “server entry” et, dans ce repo, les seuls décorateurs `@singleton/@injectable/@inject` encore présents se trouvent dans `packages/core` :

- `packages/core/src/infrastructure/InMemoryQuoteRepository.ts` : `@singleton()`
- `packages/core/src/domain/use-cases/CreateQuoteFromVoice.ts` : `@injectable()` + `@inject(...)` sur le constructeur

Même si `packages/core/src/infrastructure/Container.ts` importe `reflect-metadata`, le problème central reste l’existence de décorateurs `@...` dans le code transpilé. La solution minimale et robuste consiste à éliminer ces décorateurs côté `packages/core`, et à instancier les classes via `tsyringe` uniquement par configuration de conteneur (`useClass`), sans injection par décorateurs.

[Types]  
Suppression des types décorateurs (aucune nouvelle structure publique), en conservant les types de domaine existants (`Quote`, `IAIQuoteService`, `IQuoteRepository`, `QuoteEntity`), et en rendant les constructeurs compatibles avec une instanciation “plain”.

Ajustements type-check côté `CreateQuoteFromVoice` :

- `CreateQuoteFromVoice` ne dépend plus de `@inject` sur le constructeur.
- Le constructeur recevra explicitement `IAIQuoteService` et `IQuoteRepository` (types inchangés).
- Le calcul `totalHT/totalTTC` restera identique, mais on évitera les casts inutiles si possible.

[Files]
Modifications ciblées dans `packages/core` pour retirer les décorateurs et adapter les constructeurs, puis ajustement du wiring dans `packages/core/src/infrastructure/Container.ts`.

- New files:
  - (aucun)
- Existing files to modify:
  - `packages/core/src/infrastructure/InMemoryQuoteRepository.ts`
    - Supprimer `import { singleton } from "tsyringe";`
    - Supprimer `@singleton()` devant la classe.
  - `packages/core/src/domain/use-cases/CreateQuoteFromVoice.ts`
    - Supprimer `@injectable()` et `@inject(...)`.
    - Supprimer les imports `inject`/`injectable` si présents.
    - Adapter le constructeur pour recevoir explicitement :
      - `aiService: IAIQuoteService`
      - `quoteRepository: IQuoteRepository`
  - `packages/core/src/infrastructure/Container.ts`
    - Garder `container.register("IAIQuoteService", { useClass: AIQuoteService })`
    - Garder `container.register("IQuoteRepository", { useClass: InMemoryQuoteRepository })`
    - Ajouter si nécessaire l’enregistrement de `CreateQuoteFromVoice` de manière “sans décorateurs” (ex :
      - `container.register("CreateQuoteFromVoice", { useFactory: () => new CreateQuoteFromVoice(container.resolve("IAIQuoteService"), container.resolve("IQuoteRepository")) })`
      - ou directement `container.resolve` dans le consommateur selon l’architecture existante).
    - Optionnel/robuste : enlever `import "reflect-metadata";` si aucun décorateur tsyringe ne subsiste dans `packages/core` (à valider après suppression).
  - `packages/core/src/index.ts`
    - Aucun changement fonctionnel attendu (s’assurer que l’export `container` reste correct).
- Configuration file updates:
  - Aucune configuration supplémentaire prévue (si TSC/Next requiert `experimentalDecorators`, cela devrait devenir inutile pour `packages/core` après suppression des décorateurs, mais on ne touchera pas config avant verification).

[Functions]
Nouvelles fonctions (ou signatures) uniquement dans le wiring container via `useFactory` si nécessaire ; sinon, modification de la classe `CreateQuoteFromVoice` et suppression d’annotations.

1. `CreateQuoteFromVoice` (classe)

- Signature (nouvelle intention) :
  - `constructor(aiService: IAIQuoteService, quoteRepository: IQuoteRepository)`
- Purpose:
  - Exécuter `execute(input)` en utilisant `aiService` (optionnel si `transcript` fourni) et `quoteRepository` (toujours).
- Parameters / return:
  - `execute(input: CreateQuoteInput): Promise<QuoteEntity>`
- Key details:
  - `aiQuote` devient `Quote | undefined` comme aujourd’hui.
  - Fusion input manuel vs IA inchangée.
  - Calculs `totalHT/totalTTC` inchangés.
  - `QuoteSchema.parse(finalQuote)` doit continuer à valider.
- Error handling:
  - Garder l’exception si `items.length === 0`.
  - Les erreurs IA/env/data proviennent de `processVoiceToQuote` et de `QuoteSchema.parse`.

2. `Container` (via `useFactory`, si requis)

- Pas de nouvelle fonction exportée, mais ajout éventuel :
  - `container.register("CreateQuoteFromVoice", { useFactory: () => new CreateQuoteFromVoice(container.resolve("IAIQuoteService"), container.resolve("IQuoteRepository")) })`
- Purpose:
  - Fournir une instanciation correcte sans `@inject`.
- Error handling:
  - Si tokens non enregistrés, `container.resolve` lèvera une erreur ; cela doit apparaître clairement au build/runtime.

[Changes]
Étape par étape : retirer les décorateurs tsyringe dans `packages/core`, adapter les constructeurs pour une instanciation “plain”, puis mettre à jour le conteneur (si nécessaire) pour que le consommateur continue de fonctionner sans décorateurs.

Plan détaillé :

1. Retirer `@singleton()` de `packages/core/src/infrastructure/InMemoryQuoteRepository.ts`
   - Supprimer l’import `singleton` et l’annotation.
   - Vérifier que `InMemoryQuoteRepository` reste compatible avec `IQuoteRepository`.
   - Vérification : `grep` sur `packages/core` ne doit plus trouver `@singleton`.
2. Retirer `@injectable()` et `@inject(...)` de `packages/core/src/domain/use-cases/CreateQuoteFromVoice.ts`
   - Supprimer les décorateurs et imports associés.
   - Mettre à jour le constructeur :
     - `constructor(aiService: IAIQuoteService, quoteRepository: IQuoteRepository)`
   - Vérification : `grep` sur `packages/core` ne doit plus trouver `@injectable` ni `@inject`.
3. Adapter le wiring dans `packages/core/src/infrastructure/Container.ts`
   - S’assurer que `CreateQuoteFromVoice` est instanciable sans décorateurs.
   - Si aujourd’hui le consommateur fait `container.resolve(CreateQuoteFromVoice)` ou utilise un token : vérifier l’usage (si nécessaire) et ajuster en conséquence.
   - Approche recommandée :
     - enregistrer `CreateQuoteFromVoice` via `useFactory` qui appelle `new CreateQuoteFromVoice(container.resolve(...), container.resolve(...))`.
4. Optionnel mais recommandé : retirer `reflect-metadata` de `Container.ts` si plus aucun décorateur tsyringe n’existe dans `packages/core`
   - Après suppression complète des décorateurs, `reflect-metadata` ne devrait plus être requis.
   - Vérification : build Next/Turbopack + typecheck.
5. Vérifications qualité (après modifications)
   - `pnpm -C packages/core build` (ou `tsc --noEmit`) pour valider TS.
   - `pnpm -C apps/web build` puis (si nécessaire) `pnpm -C apps/web dev` pour confirmer disparition du crash.
   - Re-faire un `grep` global sur `packages/core` pour garantir l’absence de `@(singleton|injectable|inject)`.

[Tests]
Stratégie de test : typecheck + build Next + validations unitaires ciblées si possible.

- Unit tests à écrire:
  - (si repo ne possède pas de framework de test) pas obligatoire pour ce fix minimal.
  - Sinon : test simple de `CreateQuoteFromVoice.execute` mockant `IAIQuoteService` et `IQuoteRepository`.
- Integration tests nécessaires:
  - build Next/Turbopack (critique) et au minimum un test d’exécution du flux “generate quote” depuis l’app web.
- Test data requirements:
  - Entrée `transcript` valide simulée.
  - Entrée `items` manuelle pour couvrir le fallback sans appel IA.
- Edge cases:
  - `transcript` absent + `items` vide => exception.
  - `items` fournis sans `unit` => default `u`.
  - `QuoteSchema.parse` rejetant une structure invalide (vérifier message).
- Performance considerations:
  - Aucun changement algorithmique significatif, seulement instanciation.
