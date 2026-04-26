import { z } from 'zod';
import { Gender, Role } from '../../../generated/prisma/client';

export const RegisterPatientSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  profilePicture: z.string().url('Invalid URL format').optional().nullable(),
  dateOfBirth: z.string().datetime().optional().nullable(),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  emergencyPhone: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medicalHistory: z.string().optional().nullable(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const DoctorSpecialitySchema = z.object({
  specialityId: z.string().min(1, 'Speciality ID is required'),
});

export const CreateDoctorUserSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  doctor: z.object({
    name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    profilePicture: z.string().url('Invalid URL format').optional().nullable(),
    specialization: z.string().min(1, 'Specialization is required'),
    qualifications: z.string().min(1, 'Qualifications are required'),
    experience: z.number().int().min(0, 'Experience must be a positive number'),
    licenseNumber: z.string().min(1, 'License number is required'),
    registrationNumber: z.string().min(1, 'Registration number is required'),
    phoneNumber: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    consultationFee: z.number().optional().nullable(),
    availableForOnline: z.boolean().optional(),
    currentWorkplace: z.string().optional().nullable(),
    designation: z.string().optional().nullable(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
  }),
  specialities: z.array(DoctorSpecialitySchema).optional(),
});

export type RegisterPatientPayload = z.infer<typeof RegisterPatientSchema>;
export type LoginPayload = z.infer<typeof LoginSchema>;
export type CreateDoctorUserPayload = z.infer<typeof CreateDoctorUserSchema>;
