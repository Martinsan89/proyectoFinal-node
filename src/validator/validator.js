import CustomError from "../errors/custom.errors.js";
import ErrorEnum from "../errors/errors.enum.js";
// import { ValidatorError } from "./validator.error.js";

export const validator = (schema) => (maybeValid) => {
  const result = schema.safeParse(maybeValid);
  if (!result.success) {
    CustomError.createError({
      name: "ValidationError",
      cause: result.error.errors,
      message: JSON.stringify(
        result.error.errors.map((e) => ({
          property: e.path.join("."),
          issue: e.message,
        }))
      ),
      code: ErrorEnum.INVALID_TYPES_ERROR,
    });
  }
  return result.data;
};
