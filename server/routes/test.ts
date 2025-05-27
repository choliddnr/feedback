export default defineEventHandler(async (e) => {
  //
  // const tablesResult = await db(e).run(
  //   sql`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
  // );
  // const tableNames = tablesResult.results.map(
  //   (row: { [key: string]: string }) => row.name
  // ) as string[];
  //   return tableNames;
  // Step 2: Get columns for each table
  // const schema = {} as any;
  // console.log("TABLES", tableNames);

  //   for (const tableName of tableNames) {
  //     console.log("TABLE", tableName);
  //     if (tableName !== "merchants") continue;

  //     const columnsResult = await db(e).run(
  //       sql.raw(`PRAGMA table_info(${tableName});`)
  //     );
  //     return columnsResult;

  //     schema[tableName] = columnsResult.results.map((col: any) => ({
  //       name: col.name,
  //       type: col.type,
  //       notNull: col.notnull,
  //       defaultValue: col.dflt_value,
  //       primaryKey: col.pk,
  //     }));
  //   }

  //   return schema;

  return await db(e).select().from(merchant_categories);
});
