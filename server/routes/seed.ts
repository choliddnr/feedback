// import { db } from './db';
// import { respondents, responses, response_answers, questions } from './schema';
// import { eq } from 'drizzle-orm';
export default defineEventHandler(async (e) => {
  const data_merchant_category = [
    {
      title: 'Local Restaurant',
      description: 'A family-owned eatery serving traditional meals.',
    },
    {
      title: 'Coffee Shop',
      description: 'A small café offering coffee, pastries, and light snacks.',
    },
    {
      title: 'Food Truck',
      description:
        'A mobile kitchen selling street food like tacos, burgers, or satay.',
    },
    {
      title: 'Bakery',
      description: 'Selling fresh bread, cakes, and pastries daily.',
    },
    {
      title: 'Juice Bar',
      description:
        'Specializing in fresh juices, smoothies, and healthy snacks.',
    },
    {
      title: 'Minimarket',
      description:
        'A small convenience store selling groceries, snacks, drinks, toiletries, etc.',
    },
    {
      title: 'Butcher Shop',
      description: 'Selling fresh meat and sometimes processed meat products.',
    },
    {
      title: 'Stationery Store',
      description: 'Offering school supplies, books, and office essentials.',
    },
    {
      title: 'Clothing Boutique',
      description:
        'Selling casual or trendy fashion for specific demographics.',
    },
    {
      title: 'Pet Shop',
      description: 'Selling pet food, accessories, and small animals.',
    },
    {
      title: 'Barbershop / Hair Salon',
      description: 'Providing haircut and grooming services.',
    },
    {
      title: 'Laundry Service',
      description: 'Offering washing, drying, and ironing for clothes.',
    },
    {
      title: 'Phone Repair Shop',
      description: 'Fixing mobile phones and selling accessories.',
    },
    {
      title: 'Tailor Shop',
      description: 'Offering clothing alterations and custom tailoring.',
    },
    {
      title: 'Motorcycle Workshop',
      description: 'Doing repairs and maintenance for motorbikes.',
    },
  ];

  const names = [
    'Alice',
    'Bob',
    'Cathy',
    'David',
    'Eva',
    'Frank',
    'Grace',
    'Henry',
    'Ivy',
    'Jack',
  ];
  const locations: [number, number][] = [
    [106.8, -6.2],
    [107.6, -6.9],
    [106.7, -6.1],
    [107.5, -6.8],
    [106.9, -6.3],
    [107.0, -6.5],
    [106.85, -6.25],
    [107.1, -6.6],
    [106.95, -6.15],
    [107.2, -6.7],
  ];

  const answersMap: Record<number, string[]> = {
    18: ['Too small', 'Just right', 'Too big'],
    19: ['Not spicy enough', 'Perfect', 'Too spicy'],
    20: ['Too soft', 'Just right', 'Too hard'],
    21: ['Yes', 'No'],
    22: ['Poor', 'Fair', 'Good', 'Excellent'],
    23: ['Yes', 'No', 'Maybe'],
    24: ['Great broth', 'Nice texture', 'Rich flavor'],
    25: ['Add egg', 'Less salt', 'More meat'],
    26: ['Loved it', 'No suggestions', 'Keep spicy level'],
    27: ['1', '2', '3', '4', '5'],
    28: ['Too small', 'Just right', 'Too big'],
    29: ['Not spicy enough', 'Perfect', 'Too spicy'],
    30: ['Too soft', 'Just right', 'Too hard'],
    31: ['Yes', 'No'],
    32: ['Poor', 'Fair', 'Good', 'Excellent'],
    33: ['Yes', 'No', 'Maybe'],
    34: ['Great broth', 'Nice texture', 'Rich flavor'],
    35: ['Add egg', 'Less salt', 'More meat'],
    36: ['Loved it', 'No suggestions', 'Keep spicy level'],
    37: ['1', '2', '3', '4', '5'],
  };

  const getRandom = <T>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];
  try {
    const merchantId = 27;
    const productQuestionMap: Record<number, number[]> = {
      12: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      13: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
    };

    for (let i = 0; i < 10; i++) {
      const respondent = await db(e)
        .insert(respondents)
        .values({
          name: names[i],
          gender: i % 2 === 0 ? 0 : 1,
          age: 20 + Math.floor(Math.random() * 15),
          whatsapp: 628100000000 + i,
          location: locations[i],
        })
        .returning({ id: respondents.id });

      const respondentId = respondent[0].id;

      const response = await db(e)
        .insert(responses)
        .values({
          merchant: merchantId,
          respondent: respondentId,
        })
        .returning({ id: responses.id });

      console.log(`Seeding respondent ${i + 1}: ${response}`);
      for (const productId of [12, 13]) {
        const responseId = response[0].id;
        const questionIds = productQuestionMap[productId];

        for (const qid of questionIds) {
          const answer = getRandom(answersMap[qid] || ['No answer']);
          await db(e).insert(response_answers).values({
            response: responseId,
            question: qid,
            answer,
          });
        }
      }
    }

    return '✅ Seeded 10 respondents with responses to 2 products each.';
  } catch (error) {
    console.error('Error seeding data:', error);
  }

  // try {
  //   await db(e)
  //     .insert(merchant_categories)
  //     .values(data_merchant_category)
  //     .returning();

  //   return await db(e)
  //     .insert(question_types)
  //     .values([
  //       {
  //         title: "text",
  //         description: "collect customers opinion",
  //       },
  //       {
  //         title: "rating",
  //         description: "collect the score given by customers",
  //       },
  //     ])
  //     .returning();
  // } catch (error) {
  //   console.error(error);
  // }
  // const merchant = [
  //   {
  //     title: "Tsurayya Food",
  //     slug: "tsurayya-food",
  //     description: "the most delicious indonesian food producer",
  //     category: 1,
  //     owner: 1,
  //     greeting: "kjdsghksdjg ",
  //     primery_color: "fuel-yellow",
  //     image_background: "tsurayya-food.webp",
  //     logo: "tsurayya-food.webp",
  //     id: 1,
  //   },
  //   {
  //     title: "Tsurayya Computer",
  //     slug: "tsurayya-computer",
  //     description: "Professional IT support",
  //     category: 15,
  //     owner: 1,
  //     greeting: "kjdsghksdjg ",
  //     primery_color: "fuel-yellow",
  //     image_background: "tsurayya-computer.jpeg",
  //     logo: "tsurayya-computer.webp",
  //     id: 2,
  //   },
  // ];

  // const product = [
  //   {
  //     title: "Mie Njerit Gurih",
  //     description: "Special hot noodle, 100% halal",
  //     image: "1747561419323.webp",
  //     merchant: 1,
  //     id: 1,
  //   },
  //   {
  //     title: "Mie Jebew",
  //     description: "cili oil noodle",
  //     image: "1747561512990.webp",
  //     merchant: 1,
  //     id: 2,
  //   },
  //   {
  //     title: "Laptop Rerair",
  //     description: "Laptop repair",
  //     image: "1747631303430.jpeg",
  //     merchant: 2,
  //     id: 3,
  //   },
  // ];

  // const question = [
  //   {
  //     question: "What did you think about the portion size?",
  //     type: 1,
  //     product: 1,
  //     answer_options: ["Too small", " Just right"],
  //     id: 1,
  //   },
  //   {
  //     question: "How do you find the spiciness level?",
  //     type: 1,
  //     product: 1,
  //     answer_options: [" Not spicy enough", "Perfect", "Too spicy"],
  //     id: 2,
  //   },
  //   {
  //     question: "How would you rate the noodle texture?",
  //     type: 1,
  //     product: 1,
  //     answer_options: ["Too soft", "Just right", "Too hard"],
  //     id: 3,
  //   },
  //   {
  //     question: "Did you enjoy the toppings and ingredients included?",
  //     type: 1,
  //     product: 1,
  //     answer_options: ["Yes", "No"],
  //     id: 4,
  //   },
  //   {
  //     question: "Was the dish served hot and fresh?",
  //     type: 1,
  //     product: 1,
  //     answer_options: ["Yes", " No"],
  //     id: 5,
  //   },
  //   {
  //     question: "How would you rate the value for money?",
  //     type: 1,
  //     product: 1,
  //     answer_options: ["Poor", "Fair", "Good", "Excellent"],
  //     id: 6,
  //   },
  //   {
  //     question: "Would you order the hot noodle again?",
  //     type: 1,
  //     product: 1,
  //     answer_options: ["Yes", "No", "Maybe"],
  //     id: 7,
  //   },
  //   {
  //     question: "What did you like most about the hot noodle?",
  //     type: 1,
  //     product: 1,
  //     answer_options: [],
  //     id: 8,
  //   },
  //   {
  //     question: "What would you improve or change?",
  //     type: 1,
  //     product: 1,
  //     answer_options: [],
  //     id: 9,
  //   },
  //   {
  //     question: "Any other comments or suggestions?",
  //     type: 1,
  //     product: 1,
  //     answer_options: [],
  //     id: 10,
  //   },
  //   {
  //     question:
  //       "How would you rate the overall taste of the hot noodle?\n⭐ 1 (Very Bad) to ⭐ 5 (Excellent)",
  //     type: 2,
  //     product: 1,
  //     answer_options: [],
  //     id: 11,
  //   },
  //   {
  //     question: "What did you think about the portion size?",
  //     type: 1,
  //     product: 2,
  //     answer_options: ["Too small", "Just right", "Too big"],
  //     id: 12,
  //   },
  //   {
  //     question: "How do you find the spiciness level?",
  //     type: 1,
  //     product: 2,
  //     answer_options: ["Not spicy enough", "Perfect", "Too spicy"],
  //     id: 13,
  //   },
  //   {
  //     question: "How would you rate the noodle texture?",
  //     type: 1,
  //     product: 2,
  //     answer_options: ["Too soft", "Just right", "Too hard"],
  //     id: 14,
  //   },
  //   {
  //     question: "Did you enjoy the toppings and ingredients included?",
  //     type: 1,
  //     product: 2,
  //     answer_options: ["Yes", "No"],
  //     id: 15,
  //   },
  //   {
  //     question: "Was the dish served hot and fresh?",
  //     type: 1,
  //     product: 2,
  //     answer_options: ["Yes", "No"],
  //     id: 16,
  //   },
  //   {
  //     question: "How would you rate the value for money?",
  //     type: 1,
  //     product: 2,
  //     answer_options: ["Poor", "Fair", "Good", "Excellent"],
  //     id: 17,
  //   },
  //   {
  //     question: "Would you order the hot noodle again?",
  //     type: 1,
  //     product: 2,
  //     answer_options: ["Yes", "No", "Maybe"],
  //     id: 18,
  //   },
  //   {
  //     question: "What did you like most about the hot noodle?",
  //     type: 1,
  //     product: 2,
  //     answer_options: [],
  //     id: 19,
  //   },
  //   {
  //     question: "What would you improve or change?",
  //     type: 1,
  //     product: 2,
  //     answer_options: [],
  //     id: 20,
  //   },
  //   {
  //     question: "Any other comments or suggestions?",
  //     type: 1,
  //     product: 2,
  //     answer_options: [],
  //     id: 21,
  //   },
  //   {
  //     question:
  //       "How would you rate the overall taste of the hot noodle?\n⭐ 1 (Very Bad) to ⭐ 5 (Excellent)",
  //     type: 2,
  //     product: 2,
  //     answer_options: [],
  //     id: 22,
  //   },
  //   {
  //     question: "what do you think about live ?",
  //     type: 1,
  //     product: 3,
  //     answer_options: ["tidur", "hjsdfhj"],
  //     id: 23,
  //   },
  //   {
  //     question: "what do you think about live 1 ?",
  //     type: 1,
  //     product: 3,
  //     answer_options: ["makan", "tidur"],
  //     id: 24,
  //   },
  //   {
  //     question: "what do you think about live 3 ?",
  //     type: 2,
  //     product: 3,
  //     answer_options: ["makan", "tidur"],
  //     id: 25,
  //   },
  // ];

  // const respondent = [
  //   {
  //     name: "Mr.Man",
  //     gender: true,
  //     age: 25,
  //     whatsapp: 85753521234,
  //     location: null,
  //     id: 1,
  //   },
  //   {
  //     name: "Mrs. Woo Man ",
  //     gender: false,
  //     age: 25,
  //     whatsapp: 85753521234,
  //     location: null,
  //     id: 2,
  //   },
  //   {
  //     name: "Mr. Jacki",
  //     gender: true,
  //     age: 22,
  //     whatsapp: 85753521234,
  //     location: null,
  //     id: 3,
  //   },
  //   {
  //     name: "Mr. Jacki 2",
  //     gender: true,
  //     age: 28,
  //     whatsapp: 85753521234,
  //     location: null,
  //     id: 4,
  //   },
  //   {
  //     name: "Mr. Jacki 3",
  //     gender: true,
  //     age: 46,
  //     whatsapp: 85753521234,
  //     location: null,
  //     id: 5,
  //   },
  // ];
  // const response = [
  //   {
  //     respondent: 1,
  //     merchant: 1,
  //     id: 1,
  //   },
  //   {
  //     respondent: 2,
  //     merchant: 1,
  //     id: 2,
  //   },
  //   {
  //     respondent: 3,
  //     merchant: 1,
  //     id: 3,
  //   },
  //   {
  //     respondent: 4,
  //     merchant: 2,
  //     id: 4,
  //   },
  //   {
  //     respondent: 5,
  //     merchant: 2,
  //     id: 5,
  //   },
  // ];
  // const response_answer = [
  //   {
  //     response: 1,
  //     question: 1,
  //     answer: "Too small",
  //     id: 1,
  //   },
  //   {
  //     response: 1,
  //     question: 2,
  //     answer: "Perfect",
  //     id: 2,
  //   },
  //   {
  //     response: 1,
  //     question: 3,
  //     answer: "Too soft",
  //     id: 3,
  //   },
  //   {
  //     response: 1,
  //     question: 4,
  //     answer: "Yes",
  //     id: 4,
  //   },
  //   {
  //     response: 1,
  //     question: 5,
  //     answer: " No",
  //     id: 5,
  //   },
  //   {
  //     response: 1,
  //     question: 6,
  //     answer: "Good",
  //     id: 6,
  //   },
  //   {
  //     response: 1,
  //     question: 7,
  //     answer: "Maybe",
  //     id: 7,
  //   },
  //   {
  //     response: 1,
  //     question: 8,
  //     answer: "the price",
  //     id: 8,
  //   },
  //   {
  //     response: 1,
  //     question: 9,
  //     answer: "nothing",
  //     id: 9,
  //   },
  //   {
  //     response: 1,
  //     question: 10,
  //     answer: "no",
  //     id: 10,
  //   },
  //   {
  //     response: 1,
  //     question: 11,
  //     answer: "4",
  //     id: 11,
  //   },
  //   {
  //     response: 1,
  //     question: 22,
  //     answer: "5",
  //     id: 12,
  //   },
  //   {
  //     response: 1,
  //     question: 12,
  //     answer: "Too big",
  //     id: 13,
  //   },
  //   {
  //     response: 1,
  //     question: 13,
  //     answer: "Too spicy",
  //     id: 14,
  //   },
  //   {
  //     response: 1,
  //     question: 14,
  //     answer: "Too hard",
  //     id: 15,
  //   },
  //   {
  //     response: 1,
  //     question: 15,
  //     answer: "Yes",
  //     id: 16,
  //   },
  //   {
  //     response: 1,
  //     question: 16,
  //     answer: "No",
  //     id: 17,
  //   },
  //   {
  //     response: 1,
  //     question: 17,
  //     answer: "Fair",
  //     id: 18,
  //   },
  //   {
  //     response: 1,
  //     question: 18,
  //     answer: "Maybe",
  //     id: 19,
  //   },
  //   {
  //     response: 1,
  //     question: 19,
  //     answer: "The meatball",
  //     id: 20,
  //   },
  //   {
  //     response: 1,
  //     question: 20,
  //     answer: "no",
  //     id: 21,
  //   },
  //   {
  //     response: 1,
  //     question: 21,
  //     answer: "no",
  //     id: 22,
  //   },
  //   {
  //     response: 2,
  //     question: 1,
  //     answer: "Too small",
  //     id: 23,
  //   },
  //   {
  //     response: 2,
  //     question: 2,
  //     answer: "Perfect",
  //     id: 24,
  //   },
  //   {
  //     response: 2,
  //     question: 3,
  //     answer: "Too soft",
  //     id: 25,
  //   },
  //   {
  //     response: 2,
  //     question: 4,
  //     answer: "Yes",
  //     id: 26,
  //   },
  //   {
  //     response: 2,
  //     question: 5,
  //     answer: "No",
  //     id: 27,
  //   },
  //   {
  //     response: 2,
  //     question: 6,
  //     answer: "Good",
  //     id: 28,
  //   },
  //   {
  //     response: 2,
  //     question: 7,
  //     answer: "Maybe",
  //     id: 29,
  //   },
  //   {
  //     response: 2,
  //     question: 8,
  //     answer: "the price",
  //     id: 30,
  //   },
  //   {
  //     response: 2,
  //     question: 9,
  //     answer: "nothing",
  //     id: 31,
  //   },
  //   {
  //     response: 2,
  //     question: 10,
  //     answer: "no",
  //     id: 32,
  //   },
  //   {
  //     response: 2,
  //     question: 11,
  //     answer: "2",
  //     id: 33,
  //   },
  //   {
  //     response: 2,
  //     question: 22,
  //     answer: "4",
  //     id: 34,
  //   },
  //   {
  //     response: 2,
  //     question: 12,
  //     answer: "Too big",
  //     id: 35,
  //   },
  //   {
  //     response: 2,
  //     question: 13,
  //     answer: "Too spicy",
  //     id: 36,
  //   },
  //   {
  //     response: 2,
  //     question: 14,
  //     answer: "Too hard",
  //     id: 37,
  //   },
  //   {
  //     response: 2,
  //     question: 15,
  //     answer: "Yes",
  //     id: 38,
  //   },
  //   {
  //     response: 2,
  //     question: 16,
  //     answer: "Yes",
  //     id: 39,
  //   },
  //   {
  //     response: 2,
  //     question: 17,
  //     answer: "Fair",
  //     id: 40,
  //   },
  //   {
  //     response: 2,
  //     question: 18,
  //     answer: "Maybe",
  //     id: 41,
  //   },
  //   {
  //     response: 2,
  //     question: 19,
  //     answer: "The meatball",
  //     id: 42,
  //   },
  //   {
  //     response: 2,
  //     question: 20,
  //     answer: "no",
  //     id: 43,
  //   },
  //   {
  //     response: 2,
  //     question: 21,
  //     answer: "no",
  //     id: 44,
  //   },
  //   {
  //     response: 3,
  //     question: 1,
  //     answer: "Too small",
  //     id: 45,
  //   },
  //   {
  //     response: 3,
  //     question: 2,
  //     answer: " Not spicy enough",
  //     id: 46,
  //   },
  //   {
  //     response: 3,
  //     question: 3,
  //     answer: "Just right",
  //     id: 47,
  //   },
  //   {
  //     response: 3,
  //     question: 4,
  //     answer: "No",
  //     id: 48,
  //   },
  //   {
  //     response: 3,
  //     question: 5,
  //     answer: "Yes",
  //     id: 49,
  //   },
  //   {
  //     response: 3,
  //     question: 6,
  //     answer: "Poor",
  //     id: 50,
  //   },
  //   {
  //     response: 3,
  //     question: 7,
  //     answer: "No",
  //     id: 51,
  //   },
  //   {
  //     response: 3,
  //     question: 8,
  //     answer: "the price",
  //     id: 52,
  //   },
  //   {
  //     response: 3,
  //     question: 9,
  //     answer: "nothing",
  //     id: 53,
  //   },
  //   {
  //     response: 3,
  //     question: 10,
  //     answer: "no",
  //     id: 54,
  //   },
  //   {
  //     response: 3,
  //     question: 11,
  //     answer: "3",
  //     id: 55,
  //   },
  //   {
  //     response: 3,
  //     question: 22,
  //     answer: "4",
  //     id: 56,
  //   },
  //   {
  //     response: 3,
  //     question: 12,
  //     answer: "Too small",
  //     id: 57,
  //   },
  //   {
  //     response: 3,
  //     question: 13,
  //     answer: "Perfect",
  //     id: 58,
  //   },
  //   {
  //     response: 3,
  //     question: 14,
  //     answer: "Just right",
  //     id: 59,
  //   },
  //   {
  //     response: 3,
  //     question: 15,
  //     answer: "No",
  //     id: 60,
  //   },
  //   {
  //     response: 3,
  //     question: 16,
  //     answer: "No",
  //     id: 61,
  //   },
  //   {
  //     response: 3,
  //     question: 17,
  //     answer: "Fair",
  //     id: 62,
  //   },
  //   {
  //     response: 3,
  //     question: 18,
  //     answer: "Maybe",
  //     id: 63,
  //   },
  //   {
  //     response: 3,
  //     question: 19,
  //     answer: "The meatball",
  //     id: 64,
  //   },
  //   {
  //     response: 3,
  //     question: 20,
  //     answer: "no",
  //     id: 65,
  //   },
  //   {
  //     response: 3,
  //     question: 21,
  //     answer: "no",
  //     id: 66,
  //   },
  //   {
  //     response: 4,
  //     question: 23,
  //     answer: "hjsdfhj",
  //     id: 67,
  //   },
  //   {
  //     response: 4,
  //     question: 24,
  //     answer: "tidur",
  //     id: 68,
  //   },
  //   {
  //     response: 4,
  //     question: 25,
  //     answer: "4",
  //     id: 69,
  //   },
  //   {
  //     response: 5,
  //     question: 23,
  //     answer: "hjsdfhj",
  //     id: 70,
  //   },
  //   {
  //     response: 5,
  //     question: 24,
  //     answer: "tidur",
  //     id: 71,
  //   },
  //   {
  //     response: 5,
  //     question: 25,
  //     answer: "5",
  //     id: 72,
  //   },
  // ];

  // try {
  // const _merchant = await db(e).insert(merchants).values(merchant).returning();
  // const _product = await db(e).insert(products).values(product).returning();
  // const _question = await db(e).insert(questions).values(question).returning();
  // const _respondent = await db
  //   .insert(respondents)
  //   .values(respondent)
  //   .returning();
  // const _response = await db(e).insert(responses).values(response).returning();
  // const _response_answer = await db
  //   .insert(response_answers)
  //   .values(response_answer)
  //   .returning();
  // return {
  // merchant: _merchant,
  // product: _product,
  // question: _question,
  // respondent: _respondent,
  //     response: _response,
  //     response_answer: _response_answer,
  //   };
  // } catch (error) {
  //   console.error(error);
  // }

  //  return {
  //    questions: await db(e).select().from(questions),
  //    products: await db(e).select().from(products),
  //    merchants: await db(e).select().from(merchants),
  //    merchant_categories: await db(e).select().from(merchant_categories),
  //    question_types: await db(e).select().from(question_types),
  //    respondents: await db(e).select().from(respondents),
  //    responses: await db(e).select().from(responses),
  //    response_answers: await db(e).select().from(response_answers),
  //  };
});
