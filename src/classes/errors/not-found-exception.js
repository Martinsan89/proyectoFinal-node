import { ValidationError } from "./validation-error.js";

export class NotFoundException extends ValidationError {
  constructor() {
    super({
      code: 404,
      mensaje: "Producto no encontrado",
    });
  }
}
