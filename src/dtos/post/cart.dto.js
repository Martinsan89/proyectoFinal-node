import { z } from "zod";

export const CartDto = z.object({
  products: z.array({
    productId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
    quantity: z.number().positive(),
  }),
});
