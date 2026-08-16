import { z } from "zod";
export const SignUpSchema = z.object({
    firstName: z.string().trim().min(1, "first name is required"),
    lastName: z.string().trim().min(1, "last name is required"),
    email:z.email("email is required").trim().min(1, "email is required"),
 
    password: z.string().min(15,"Password must be at least 15 characters long").max(20,"Password must be at most 20 characters long"),
});


export type SignupSchemaType = z.infer<typeof SignUpSchema>;


export const SignInSchema = z.object({
    email:z.email("email is required").trim().min(1, "email is required"),
    password: z.string().min(15,"Password must be at least 15 characters long").max(20,"Password must be at most 20 characters long"),
});

export type SigninSchemaType = z.infer<typeof SignInSchema>;

export const codeSchema  =z.object({
    code: z.string().trim().min(1, "Enter the code sent to your email").max(6, "Code must be 6 characters long"),
});

export type CodeSchemaType = z.infer<typeof codeSchema>;