import { createZodDto } from "nestjs-zod";
import z from "zod";

const SignInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export class SignInDto extends createZodDto(SignInSchema) {}
