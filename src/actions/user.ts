
import { defineAction,  } from "astro:actions";
import { z } from "astro:schema";


export const user = {
  signInWithEmail: defineAction({
    accept: "form",
    input: z.object({
      email: z.string(),
      password: z.string().min(6).max(255),
    }),
    handler: async (input, context) => {
      
    },
  }),
};
