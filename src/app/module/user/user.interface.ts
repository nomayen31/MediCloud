import { Gender } from "../../../generated/prisma/enums";

export interface ICreateDoctorPayload {
  password: string;

  doctor: {
    name: string;
    email: string;

    profilePicture?: string;

    specialization: string;
    qualifications?: string;
    experience?: number;

    licenseNumber?: string;
    registrationNumber?: string;

    phoneNumber?: string;

    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;

    bio?: string;

    consultationFee?: number;
    availableForOnline?: boolean;

    currentWorkplace?: string;
    designation?: string;

    gender: Gender;
  };

  // Relations
  specialities?: {
    specialityId: string; // This is a STRING, not an array
  }[];
}