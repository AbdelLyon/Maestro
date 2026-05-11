import * as Lucide from "lucide-react";

/**
 * On veut que le code app puisse utiliser `Icons.ActivityIcon`, `Icons.SearchIcon`, etc.
 * alors que `lucide-react` expose plutôt `Activity`, `Search`, etc.
 *
 * Plutôt que d'exporter manuellement tous les alias `*Icon`, on crée un Proxy :
 * - si la propriété finit par "Icon", on renvoie la propriété sans suffixe.
 *
 * Côté typescript, on évite les erreurs "Property X does not exist" en déclarant
 * Icons comme un objet extensible.
 */
type IconsType = typeof Lucide & Record<string, unknown>;

export const Icons = new Proxy(Lucide as unknown as IconsType, {
  get(target, prop, receiver) {
    if (typeof prop === "string" && prop.endsWith("Icon")) {
      const base = prop.slice(0, -3);
      const value = (target as any)[base];
      if (value) return value;
    }
    return Reflect.get(target as any, prop, receiver);
  },
}) as IconsType;

// Compat : garder le namespace complet brut si nécessaire ailleurs
export const LucideIcons = Lucide;

// Et exposer aussi les exports nommés directs pour ne pas casser des imports existants
export * from "lucide-react";
