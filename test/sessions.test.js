import supertest from "supertest";
import { expect } from "chai";

describe("test de sesiones", () => {
  const requester = supertest("proyecto-final-node-iota.vercel.app");

  let cookie;

  it("debe registrar correctamente al usuario", async () => {
    const mockUser = {
      first_name: "test3",
      last_name: "test3",
      email: "test3@test3.com",
      phone: 5434567,
      age: 43,
      password: "test3",
      cart: [],
      role: "user",
    };
    const { ok, _body } = await requester
      .post("/api/auth/register")
      .send(mockUser);
    expect(ok).to.be.true;
    expect(_body).to.have.property("message");
    expect(_body.message).to.be.equals("Usuario creado");
  });

  it("debe loguear correctamente al usuario", async () => {
    const mockUser = {
      email: "qwe@rty.com",
      password: "asdfg",
    };
    const { ok, headers } = await requester
      .post("/api/auth/login")
      .send(mockUser);
    expect(ok).to.be.true;

    const cookieresult = headers["set-cookie"][0];
    cookie = {
      name: cookieresult.split("=")[0],
      value: cookieresult.split("=")[1].split(";")[0],
    };
    expect(cookie.name).to.be.equals("jwt");
    expect(cookie.value).to.be.ok;
  });

  it("debe enviar la cookie que contiene el usuario y destructurar este correctamente", async () => {
    const { ok, _body } = await requester
      .get("/api/session/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    expect(ok).to.be.true;
    expect(_body).to.have.property("email");
    expect(_body.email).to.be.equals("qwe@rty.com");
    expect(_body).to.not.have.property("password");
  });
});
