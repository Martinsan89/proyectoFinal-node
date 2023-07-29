import supertest from "supertest";
import { expect } from "chai";

describe("Carts tests", () => {
  const requester = supertest("proyecto-final-node-iota.vercel.app");

  describe("Crear y actualizar un carrito", () => {
    let cartID;

    it("el endpoint post /api/carts debe crear un carrito", async () => {
      const { ok, _body } = await requester.post("/api/carts");
      expect(ok).to.be.true;
      expect(_body).to.have.property("_id");
      cartID = _body._id;
    });

    it("el metodo put no debe  actualizar correctamente un carrito si el usuario no esta logueado ", async () => {
      const mockProduct = {
        products: {
          product: "64272166dce4752e18e7ac12",
          quantity: 3,
        },
      };
      const { status } = await requester
        .put(`/api/carts/${cartID}`)
        .send({ cart: mockProduct });
      expect(status).to.be.equal(401);
    });

    it("el endpoint delete /api/carts debe eliminar un carrito", async () => {
      const { ok } = await requester.delete(`/api/carts/${cartID}`);
      expect(ok).to.be.true;
    });
  });
});
