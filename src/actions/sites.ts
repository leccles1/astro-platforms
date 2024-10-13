import { db } from "@/db";
import { Site } from "@/db/schema";
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";

export const site = {
  createSite: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      subdomain: z.string(),
      description: z.string(),
    }),
    handler: async (input) => {
      const { name, subdomain, description } = input;
      try {
        const [site] = await db
          .insert(Site)
          .values({
            name,
            subdomain,
            description,
          })
          .returning();
        return site;
      } catch (e) {
        console.error("Catch block", e);
        throw new ActionError({
          message: "Failed to create Site",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  }),
};

// Pass through hit:  http://app.localhost:4321/sites?_astroAction=site.createSite
