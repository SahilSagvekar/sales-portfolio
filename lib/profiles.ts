export interface Profile {
  slug: string;
  name: string;
  photo?: string;
}

export const profiles: Record<string, Profile> = {
  kriszy:    { slug: "kriszy",    name: "Kriszy Garcia"     },
  // kriszy: { slug: "kriszy", name: "Kriszy Garcia", photo: "https://pub-aba1844bd21f4ec0b72735c6f51f94c9.r2.dev/MissBehaveTV/outputs/April-2026/MissBehaveTV_03-01-2026_SQF1/thumbnails/1775062352163-1S1A0468.00_01_19_28.Still002.png" },
  brylle:    { slug: "brylle",    name: "Brylle Eullaran"   },
  jizanmark: { slug: "jizanmark", name: "Jizanmark Hernaez" },
  maryjoy:   { slug: "maryjoy",   name: "Mary Joy Ramirez"  },
  hanelle:   { slug: "hanelle",   name: "Hanelle Corullo"   },
  nathaniel: { slug: "nathaniel", name: "Nathaniel Orzales" },
  lencon:    { slug: "lencon",    name: "Lencon Empasis"    },
  rommel:    { slug: "rommel",    name: "Rommel Feniza"     },
  james:     { slug: "james",     name: "James Silvoza"     },
  johnson:   { slug: "johnson",   name: "Johnson Prado"     },
  kate:      { slug: "kate",      name: "Kate Collin Parcon" },
  edgar:     { slug: "edgar",     name: "Edgar Siman" },
};