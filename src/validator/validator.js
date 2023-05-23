import * as z from "zod";

export const validator = (schema) => (maybeValid) => {
  const result = schema.safeParse(maybeValid);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};
