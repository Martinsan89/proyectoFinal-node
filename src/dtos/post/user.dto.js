import mongoose from "mongoose";
import { z } from "zod";

export const UserDto = z.object({
  first_name: z.string().min(3).max(100),
  last_name: z.string().min(3).max(100),
  email: z.string().email(),
  age: z.number().int().positive(),
  cart: z.array(z.string().refine((id) => mongoose.Types.ObjectId.isValid(id))),
  role: z.enum(["admin", "user"]),
});
