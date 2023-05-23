import { z } from "zod";

export const ProductDto = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(3).max(255),
  code: z.string(),
  price: z.number().positive(),
  status: z.string(),
  stock: z.number(),
  category: z.string(),
  thumbnail: z.string(),
});
