import { z } from "zod";
import { Gender } from "../../../generated/prisma/client.js";

const doctorBaseZodSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long").max(100),
    email: z.string().email("Invalid email format"),
    profilePicture: z.string().url("Invalid URL format").optional().nullable(),
    specialization: z.string().min(2, "Specialization must be at least 2 characters long").max(100),
    qualifications: z.string().min(2, "Qualifications must be at least 2 characters long").max(255).optional().nullable(),
    experience: z.number().int("Experience must be a whole number").min(0, "Experience cannot be negative").max(50, "Experience must be less than 50 years").optional().nullable(),
    licenseNumber: z.string().min(5, "License number must be at least 5 characters long").max(50).optional().nullable(),
    registrationNumber: z.string().min(5, "Registration number must be at least 5 characters long").max(50).optional().nullable(),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long").max(15).optional().nullable(),
    address: z.string().min(5, "Address must be at least 5 characters long").max(255).optional().nullable(),
    city: z.string().min(2, "City must be at least 2 characters long").max(100).optional().nullable(),
    state: z.string().min(2, "State must be at least 2 characters long").max(100).optional().nullable(),
    zipCode: z.string().min(4, "Zip code must be at least 4 characters long").max(10).optional().nullable(),
    country: z.string().min(2, "Country must be at least 2 characters long").max(100).optional().nullable(),
    bio: z.string().max(1000, "Bio must be less than 1000 characters long").optional().nullable(),
    consultationFee: z.number().min(0, "Consultation fee cannot be negative").optional().nullable(),
    availableForOnline: z.boolean().optional(),
    currentWorkplace: z.string().min(2, "Current workplace must be at least 2 characters long").max(255).optional().nullable(),
    designation: z.string().min(2, "Designation must be at least 2 characters long").max(100).optional().nullable(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
  })
  .strict();

export const createDoctorZodSchema = doctorBaseZodSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters long").max(100),
  email: z.string().email("Invalid email format"),
  specialization: z.string().min(2, "Specialization must be at least 2 characters long").max(100),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
});

// Update schema - email is excluded (omitted)
export const updateDoctorZodSchema = doctorBaseZodSchema
  .omit({ email: true }) // 👈 Remove email from update schema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  })
  .refine((value) => !("email" in value), {
    message: "Email cannot be updated",
  }); // 👈 Extra safeguard

export const updateDoctorRequestZodSchema = z.object({
  body: updateDoctorZodSchema,
});

export const createDoctorRequestZodSchema = z.object({
  body: createDoctorZodSchema,
});

// Backward-compatible exports for existing imports in the codebase.
export const UpdateDoctorZodSchema = updateDoctorZodSchema;
export const UpdateDoctorSchema = updateDoctorZodSchema;
export const CreateDoctorSchema = createDoctorZodSchema;

export type UpdateDoctorPayload = z.infer<typeof updateDoctorZodSchema>;
export type CreateDoctorPayload = z.infer<typeof createDoctorZodSchema>;
