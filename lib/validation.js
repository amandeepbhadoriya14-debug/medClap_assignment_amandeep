import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name is too long."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password is too long.")
    .regex(/[a-z]/, "Include at least one lowercase letter.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(60),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(60).optional().or(z.literal("")),
  location: z.string().trim().max(80).optional().or(z.literal("")),
  bio: z.string().trim().max(400).optional().or(z.literal("")),
});

export function fieldErrors(error) {
  const flattened = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flattened).map(([key, messages]) => [key, messages?.[0]])
  );
}
