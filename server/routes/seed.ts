export default defineEventHandler(async (e) => {
  const data_merchant_category = [
    {
      title: "Local Restaurant",
      description: "A family-owned eatery serving traditional meals.",
    },
    {
      title: "Coffee Shop",
      description: "A small café offering coffee, pastries, and light snacks.",
    },
    {
      title: "Food Truck",
      description:
        "A mobile kitchen selling street food like tacos, burgers, or satay.",
    },
    {
      title: "Bakery",
      description: "Selling fresh bread, cakes, and pastries daily.",
    },
    {
      title: "Juice Bar",
      description:
        "Specializing in fresh juices, smoothies, and healthy snacks.",
    },
    {
      title: "Minimarket",
      description:
        "A small convenience store selling groceries, snacks, drinks, toiletries, etc.",
    },
    {
      title: "Butcher Shop",
      description: "Selling fresh meat and sometimes processed meat products.",
    },
    {
      title: "Stationery Store",
      description: "Offering school supplies, books, and office essentials.",
    },
    {
      title: "Clothing Boutique",
      description:
        "Selling casual or trendy fashion for specific demographics.",
    },
    {
      title: "Pet Shop",
      description: "Selling pet food, accessories, and small animals.",
    },
    {
      title: "Barbershop / Hair Salon",
      description: "Providing haircut and grooming services.",
    },
    {
      title: "Laundry Service",
      description: "Offering washing, drying, and ironing for clothes.",
    },
    {
      title: "Phone Repair Shop",
      description: "Fixing mobile phones and selling accessories.",
    },
    {
      title: "Tailor Shop",
      description: "Offering clothing alterations and custom tailoring.",
    },
    {
      title: "Motorcycle Workshop",
      description: "Doing repairs and maintenance for motorbikes.",
    },
  ];
  try {
    await db.insert(merchant_categories).values(data_merchant_category);

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
