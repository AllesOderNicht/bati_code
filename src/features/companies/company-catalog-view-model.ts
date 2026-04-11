import type { PersonaProfile } from "../../domain/persona/types";

export type PersonaGalleryItem = {
  personaId: string;
  displayName: string;
  relatedCompanies: string[];
  memeOrigin: string;
  rarity: PersonaProfile["rarity"];
  keywords: string[];
  personaDescription: string;
};

export function createPersonaGalleryItems(
  profiles: PersonaProfile[],
): PersonaGalleryItem[] {
  return profiles.map((profile) => ({
    personaId: profile.id,
    displayName: profile.displayName,
    relatedCompanies: profile.relatedCompanies,
    memeOrigin: profile.memeOrigin,
    rarity: profile.rarity,
    keywords: profile.keywords,
    personaDescription: profile.personaDescription,
  }));
}
