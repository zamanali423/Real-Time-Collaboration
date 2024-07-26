const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password atleast 6 characters long"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password atleast 6 characters long"),
  }),
});

module.exports = { registerSchema, loginSchema };
