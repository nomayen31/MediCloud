import { Role } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface RegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

const registerPatient = async (payload: RegisterPatientPayload) => {
    const { name, email, password } = payload;

    // Register user with BetterAuth
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        }
    });

    if (!data.user) {
        throw new Error("Failed to register patient");
    }

    const userId = data.user.id;

    try {
        // Use transaction to update user role and create patient profile
        await prisma.$transaction(async (tx) => {
            // Update user role to PATIENT
            await tx.user.update({
                where: { id: userId },
                data: {
                    role: Role.PATIENT,
                }
            });

            // Create patient profile
            await tx.patient.create({
                data: {
                    userId: userId,
                }
            });
        });

        // Auto-login after registration to get token
        const loginData = await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        });

        return loginData; // This includes user and session with token
    } catch (error) {
        console.error("Error in registerPatient:", error);
        
        // If patient creation fails, clean up the BetterAuth user
        try {
            await prisma.user.delete({
                where: { id: userId }
            });
            console.log(`Cleaned up user ${userId} after failed registration`);
        } catch (cleanupError) {
            console.error("Failed to cleanup user after error:", cleanupError);
        }
        
        throw new Error(
            error instanceof Error
                ? error.message
                : "An error occurred while registering the patient",
            { cause: error }
        );
    }
};

const login = async (payload: LoginPayload) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    });

    if (!data) {
        throw new Error("Invalid credentials");
    }

    return data;
};

export const AuthService = {
    registerPatient,
    login,
};