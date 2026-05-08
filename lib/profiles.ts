export interface Profile {
  slug: string;
  name: string;
}

export const profiles: Record<string, Profile> = {
  Kriszy:   { slug: "Kriszy",   name: "Kriszy Garcia"   },
  Brylle:    { slug: "Brylle",    name: "Brylle Eullaran"     },
  Jizanmark:   { slug: "Jizanmark",   name: "Jizanmark Hernaez"    },
  MaryJoy:   { slug: "MaryJoy",   name: "Mary Joy Ramirez"    },
  Hanelle:   { slug: "Hanelle",   name: "Hanelle Corullo"    },
  // add more people here
}