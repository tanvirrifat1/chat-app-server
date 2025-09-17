import { z } from 'zod';

export const withdrawSchema = z.object({
  status: z.string().min(1, { message: 'Status is required' }),
  image: z.string().optional(),
});
