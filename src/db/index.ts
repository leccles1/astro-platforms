import { drizzle } from "drizzle-orm/connect";


export const db = await drizzle("turso", {
  connection: {
    url: import.meta.env.DB_REMOTE_URL,
    authToken: import.meta.env.DB_APP_TOKEN,
  },
  casing: "snake_case",
});

// export const clientDb = async (userId: string) => {
//   const dbName = getDatabaseName(userId)

//   return await drizzle("turso", {
//     connection: {
//       url: `libsql://${dbName}-${import.meta.env.DB_ORG}.turso.io`,
//       authToken: import.meta.env.DB_GROUP_TOKEN,

//     }
//   })
// }
