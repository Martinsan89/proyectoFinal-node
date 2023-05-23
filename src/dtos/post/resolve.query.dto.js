import { z } from "zod";

export const ResolveQuery = z.object({
  resolve: z.string().min(3).max(255),
});
