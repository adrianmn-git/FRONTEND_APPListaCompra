import { z } from "zod";

// Password validation rules (reusable)
const passwordRules = z
  .string()
  .min(9, { error: "password_length" })
  .regex(/\p{Lu}/u, { error: "password_uppercase" })
  .regex(/\d/, { error: "password_number" })
  .regex(/[^\p{L}\p{N}\s]/u, { error: "password_symbol" });

export const loginSchema = z.object({
  email: z.string().min(1, { error: "required_field" }).email({ error: "invalid_email" }),
  password: z.string().min(1, { error: "required_field" }),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(1, { error: "required_field" }),
    last_name: z.string().min(1, { error: "required_field" }),
    email: z.string().min(1, { error: "required_field" }).email({ error: "invalid_email" }),
    password: passwordRules,
    confirmPassword: z.string().min(1, { error: "required_field" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "passwords_mismatch",
    path: ["confirmPassword"],
  });

export const profileSchema = z
  .object({
    first_name: z.string().min(1, { error: "required_field" }),
    last_name: z.string().min(1, { error: "required_field" }),
    email: z.string().min(1, { error: "required_field" }).email({ error: "invalid_email" }),
    password: z.string().optional().default(""),
    confirmPassword: z.string().optional().default(""),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password.length >= 9;
      }
      return true;
    },
    { error: "password_length", path: ["password"] }
  )
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return /\p{Lu}/u.test(data.password);
      }
      return true;
    },
    { error: "password_uppercase", path: ["password"] }
  )
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return /\d/.test(data.password);
      }
      return true;
    },
    { error: "password_number", path: ["password"] }
  )
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return /[^\p{L}\p{N}\s]/u.test(data.password);
      }
      return true;
    },
    { error: "password_symbol", path: ["password"] }
  )
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    { error: "passwords_mismatch", path: ["confirmPassword"] }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
