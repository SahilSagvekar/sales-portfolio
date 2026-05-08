export interface Profile {
  slug: string;
  name: string;
}

export const profiles: Record<string, Profile> = {
  kriszy:   { slug: "kriszy",   name: "Kriszy Garcia"   },
  brylle:    { slug: "brylle",    name: "Brylle Eullaran"     },
  jizanmark:   { slug: "jizanmark",   name: "Jizanmark Hernaez"    },
  maryjoy:   { slug: "maryjoy",   name: "Mary Joy Ramirez"    },
  hanelle:   { slug: "hanelle",   name: "Hanelle Corullo"    },
}