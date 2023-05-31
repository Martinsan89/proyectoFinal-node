import { Faker, es, en, base } from "@faker-js/faker";

const faker = new Faker({
  locale: [es, en, base],
});

export function generateUser() {
  const product = faker.commerce.product();
  return {
    title: faker.commerce.productName(product),
    description: faker.commerce.productDescription(product),
    code: faker.string.uuid(),
    price: faker.commerce.price({ min: 1 }),
    status: faker.datatype.boolean(),
    stock: faker.number.int({ max: 100 }),
    category: product,
    thumbnail: faker.image.urlLoremFlickr({ category: "food" }),
  };
}
