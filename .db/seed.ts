import { reset, seed } from "drizzle-seed";
import * as schema from "../shared/db.schema";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { count } from "drizzle-orm";
const generateStringArray = ({
  length = 3, // Number of strings to generate
  stringLength = 5, // Length of each string
  charset = "abcdefghijklmnopqrstuvwxyz", // Characters to use in strings
  suffix = "", // Optional suffix to add to each string
} = {}) => {
  const randomString = () =>
    Array.from({ length: stringLength }, () =>
      charset.charAt(Math.floor(Math.random() * charset.length))
    ).join("");

  return Array.from({ length }, () => randomString() + suffix);
};

// Usage
const charset = "abcdefghijklmnopqrstuvwxyz";
const randomImages = generateStringArray({
  length: 3,
  stringLength: 8, // Each string has 8 characters
  charset: charset + "123_", // Custom character set
  suffix: ".jpg", // Add '_id' as a suffix
});
const randomOptions = generateStringArray({
  length: 3,
  stringLength: 8, // Each string has 8 characters
  charset: charset + "123_", // Custom character set
});

console.log("seed", randomImages);

async function main() {
  const db = drizzle(".db/bun.sqlite");

  await reset(db, schema);
  await seed(db, schema).refine((f) => ({
    users: {
      count: 3,
      columns: {
        name: f.fullName(),
        email: f.email(),
        username: f.uuid(),
      },
      with: {
        merchants: [
          { weight: 0.2, count: [7, 8, 9] },
          { weight: 0.3, count: [4, 5, 6] },
          { weight: 0.5, count: [1, 2, 3] },
        ],
      },
    },
    merchants: {
      columns: {
        greeting: f.loremIpsum({ sentencesCount: 2 }),
        description: f.loremIpsum({ sentencesCount: 1 }),
      },
      with: {
        products: [
          { weight: 0.2, count: 7 },
          { weight: 0.3, count: 5 },
          { weight: 0.5, count: 3 },
        ],
      },
    },
    merchant_categories: {
      count: 3,
      columns: {
        title: f.valuesFromArray({
          values: ["restoran", "toko sembako", "toko service"],
          // Property that controls whether the generated values will be unique or not
          isUnique: true,
        }),
        description: f.loremIpsum({ sentencesCount: 1 }),
      },
    },
    products: {
      columns: {
        description: f.loremIpsum({ sentencesCount: 1 }),
        images: f.weightedRandom([
          {
            weight: 0.3,
            value: f.default({
              defaultValue: generateStringArray({
                length: 3,
                stringLength: 8, // Each string has 8 characters
                charset: charset + "123_", // Custom character set
                suffix: ".jpg", // Add '_id' as a suffix
              }),
            }),
          },
          {
            weight: 0.3,
            value: f.default({
              defaultValue: generateStringArray({
                length: 2,
                stringLength: 8, // Each string has 8 characters
                charset: charset + "123_", // Custom character set
                suffix: ".jpg", // Add '_id' as a suffix
              }),
            }),
          },
          {
            weight: 0.3,
            value: f.default({
              defaultValue: generateStringArray({
                length: 1,
                stringLength: 8, // Each string has 8 characters
                charset: charset + "123_", // Custom character set
                suffix: ".jpg", // Add '_id' as a suffix
              }),
            }),
          },
          {
            weight: 0.1,
            value: f.default({
              defaultValue: generateStringArray({
                length: 0,
                stringLength: 8, // Each string has 8 characters
                charset: charset + "123_", // Custom character set
                suffix: ".jpg", // Add '_id' as a suffix
              }),
            }),
          },
        ]),
      },
      with: {
        questions: [
          { weight: 0.2, count: 7 },
          { weight: 0.3, count: 5 },
          { weight: 0.5, count: 3 },
        ],
      },
    },
    question_types: {
      count: 5,
      columns: {
        title: f.valuesFromArray({
          values: [
            "text",
            "select_one",
            "select_multiple",
            "true_false",
            "score",
          ],
          // Property that controls whether the generated values will be unique or not
          isUnique: true,
        }),
        description: f.loremIpsum({ sentencesCount: 1 }),
      },
    },
    questions: {
      columns: {
        question: f.loremIpsum({ sentencesCount: 1 }),
        answer_options: f.weightedRandom([
          {
            weight: 0.3,
            value: f.default({
              defaultValue: generateStringArray({
                length: 3,
                stringLength: 8, // Each string has 8 characters
                charset: charset + "123_", // Custom character set
              }),
            }),
          },
          {
            weight: 0.3,
            value: f.default({
              defaultValue: generateStringArray({
                length: 2,
                stringLength: 8, // Each string has 8 characters
                charset: charset + "123_", // Custom character set
              }),
            }),
          },
          {
            weight: 0.3,
            value: f.default({
              defaultValue: generateStringArray({
                length: 1,
                stringLength: 8, // Each string has 8 characters
                charset: charset + "123_", // Custom character set
              }),
            }),
          },
          {
            weight: 0.1,
            value: f.default({
              defaultValue: generateStringArray({
                length: 0,
                stringLength: 8, // Each string has 8 characters
                charset: charset + "123_", // Custom character set
              }),
            }),
          },
        ]),
      },
    },
    respondents: {
      count: 10,
      columns: {
        name: f.fullName(),
        gender: f.int({
          minValue: 0,
          maxValue: 1,
        }),
        age: f.int({
          minValue: 20,
          maxValue: 40,
        }),
        whatsapp: f.phoneNumber({
          template: "+628##########",
        }),
        location: f.default({
          defaultValue: [120380412, -23294812],
        }),
      },
      with: {
        responses: [
          { weight: 0.4, count: [1, 2, 3] },
          { weight: 0.3, count: [4, 5, 6] },
          { weight: 0.3, count: [7, 8, 9] },
        ],
      },
    },
    responses: {
      columns: {},
      with: {
        response_answers: [
          { weight: 0.4, count: [1, 2, 3] },
          { weight: 0.3, count: [4, 5, 6] },
          { weight: 0.3, count: [7, 8, 9] },
        ],
      },
    },
    response_answers: {
      columns: {
        answer: f.loremIpsum({ sentencesCount: 1 }),
      },
    },
  }));
}
main();
