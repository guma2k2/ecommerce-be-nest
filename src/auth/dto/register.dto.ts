import { createZodDto } from "nestjs-zod";
import z from "zod";

const RegisterSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
