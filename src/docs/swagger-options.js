import * as path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce Proyecto Final",
      version: "1.0.0",
      description: "Ecommerce Proyecto Final API Coderhouse",
    },
  },
  apis: [path.resolve("./src/docs/**/*.yaml")],
};

const spec = swaggerJSDoc(swaggerOptions);
export default spec;
