import z from "zod";

// Zod Schema
export const createDoctorZodSchema = z.object({
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be less than 128 characters long"),

  doctor: z.object({
    name: z
      .string({ message: "Name is required" })
      .min(3, "Name must be at least 3 characters long")
      .max(100, "Name must be less than 100 characters long"),

    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),

    profilePicture: z
      .string()
      .url("Profile picture must be a valid URL")
      .optional(),

    specialization: z
      .string({ message: "Specialization is required" })
      .min(2, "Specialization must be at least 2 characters long")
      .max(100, "Specialization must be less than 100 characters long"),

    qualifications: z
      .string()
      .min(2, "Qualifications must be at least 2 characters long")
      .max(255, "Qualifications must be less than 255 characters long")
      .optional(),

    experience: z
      .number({ message: "Experience must be a number" })
      .int("Experience must be a whole number")
      .min(0, "Experience cannot be negative")
      .max(50, "Experience must be less than 50 years")
      .optional(),

    licenseNumber: z
      .string()
      .min(5, "License number must be at least 5 characters long")
      .max(50, "License number must be less than 50 characters long")
      .optional(),

    registrationNumber: z
      .string()
      .min(5, "Registration number must be at least 5 characters long")
      .max(50, "Registration number must be less than 50 characters long")
      .optional(),

    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters long")
      .max(15, "Phone number must be less than 15 characters long")
      .optional(),

    address: z
      .string()
      .min(10, "Address must be at least 10 characters long")
      .max(255, "Address must be less than 255 characters long")
      .optional(),

    city: z
      .string()
      .min(2, "City must be at least 2 characters long")
      .max(100, "City must be less than 100 characters long")
      .optional(),

    state: z
      .string()
      .min(2, "State must be at least 2 characters long")
      .max(100, "State must be less than 100 characters long")
      .optional(),

    zipCode: z
      .string()
      .min(4, "Zip code must be at least 4 characters long")
      .max(10, "Zip code must be less than 10 characters long")
      .optional(),

    country: z
      .string()
      .min(2, "Country must be at least 2 characters long")
      .max(100, "Country must be less than 100 characters long")
      .optional(),

    bio: z
      .string()
      .max(1000, "Bio must be less than 1000 characters long")
      .optional(),

    consultationFee: z
      .number()
      .min(0, "Consultation fee cannot be negative")
      .optional(),

    availableForOnline: z.boolean().optional(),

    currentWorkplace: z
      .string()
      .min(2, "Current workplace must be at least 2 characters long")
      .max(255, "Current workplace must be less than 255 characters long")
      .optional(),

    designation: z
      .string()
      .min(2, "Designation must be at least 2 characters long")
      .max(100, "Designation must be less than 100 characters long")
      .optional(),

    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      message: "Gender must be MALE, FEMALE, or OTHER",
    }),
    
  }),

  specialities: z
    .array(
      z.object({
        specialityId: z.string().min(1, "Speciality ID is required"),
      })
    )
    .optional(),
});
