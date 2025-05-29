import type { D1Database } from "@cloudflare/workers-types";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
export default defineEventHandler(async (e) => {
  const insertedData: {
    inserted_id: number;
    table: SQLiteTableWithColumns<any>;
  }[] = [];

  try {
    const respondent = await db(e)
      .insert(respondents)
      .values({
        name: "Test Respondent",
        gender: true,
        whatsapp: 8123456789,
        age: 22,
      })
      .returning()
      .get();
    insertedData.push({ inserted_id: respondent.id, table: respondents });

    // const response = await db(e)
    //   .insert(responses)
    //   .values({
    //     name: "Test Respondent",
    //     gender: true,
    //     whatsapp: 8123456789,
    //     age: 22,
    //   })
    //   .returning()
    //   .get();

    // insertedData.push({ inserted_id: response.id, table: responses });
  } catch (error) {
    // rollback logic
    for (const data of insertedData) {
      await db(e)
        .delete(data.table)
        .where(eq(data.table.id, data.inserted_id))
        .run();
    }
  }

  // return await db(e).select().from(questions);
});
