import Products from "../src/dao/services/products.service.js";
import mongoose from "mongoose";
import { expect } from "chai";

describe("Testing products", function () {
  const ids = [];
  before(async function () {
    this.connection = await mongoose.connect(
      `mongodb+srv://MartinSanchez89:Nodejs89@codercluster.gmw4unw.mongodb.net/test`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    this.productsDao = new Products();
  });
  afterEach(async function () {
    await Promise.all(ids.map((id) => this.productsDao.delete(id)));
  });

  it("El dao debe obtener los productos en array", async function () {
    const { docs } = await this.productsDao.find();
    expect(docs).to.be.deep.equal([]);
  });

  it("EL dao debe agregar correctamente un elemento a la db", async function () {
    const product = {
      title: "Nike Air Zoom Pegasus 39 ",
      description: "Zapatillas de running",
      code: "ffng5",
      price: 178,
      status: "true",
      stock: 0,
      category: "running",
      thumbnail:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1674334826-nike-air-zoom-pegasus-39-1674334705.jpg?crop=0.955xw:0.570xh;0.0208xw,0.423xh&resize=980:*",
    };
    const newProduct = await this.productsDao.create(product);
    expect(newProduct).to.have.property("_id");
    ids.push(newProduct._id);
  });

  it("Al agregar un nuevo producto este debe crearse con un owner", async function () {
    const product = {
      title: "Nike Air Zoom Pegasus 39 ",
      description: "Zapatillas de running",
      code: "ffng5",
      price: 178,
      status: "true",
      stock: 0,
      category: "running",
      thumbnail:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1674334826-nike-air-zoom-pegasus-39-1674334705.jpg?crop=0.955xw:0.570xh;0.0208xw,0.423xh&resize=980:*",
    };
    const newProduct = await this.productsDao.create(product);
    expect(newProduct).to.have.property("owner");
    ids.push(newProduct._id);
  });
});
