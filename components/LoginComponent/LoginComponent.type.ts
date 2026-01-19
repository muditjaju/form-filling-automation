import { z } from "zod";

export const USER_ROLES = ["admin", "customer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  pin: z.string().length(6, "PIN must be 6 digits"),
  role: z.enum(USER_ROLES, {
    message: "Please select a role",
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
