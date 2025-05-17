export default defineEventHandler(async (e) => {
  try {
    await db.insert(merchant_categories).values({
      title: "restaurant",
      description: "the palce whare people can eat and drink",
    });
    await db.insert(merchant_categories).values({
      title: "minimarket",
      description: "the palce whare people can buy their daily need",
    });
    await db.insert(question_types).values({
      title: "text",
      description: "collect customers opinion",
    });
    await db.insert(question_types).values({
      title: "rating",
      description: "collect the score given by customers",
    });
  } catch (error) {
    console.error(error);
  }
});
