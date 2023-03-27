import { ValidationError } from "./validation-error.js";

export class BadRequestException extends ValidationError {
  constructor() {
    super({
      code: 400,
      mensaje: "Datos Invalidos",
    });
  }
}
