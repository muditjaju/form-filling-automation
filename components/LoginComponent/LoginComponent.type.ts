import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  pin: z.string().length(6, "PIN must be 6 digits"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
