# Zod Validation Implementation Guide

This guide explains how Zod validation is implemented throughout the MediCloud Backend project.

## Overview

Zod is used for runtime type validation of all API request payloads. This ensures:
- Strong type safety
- Clear validation error messages
- Consistent input validation across all endpoints
- TypeScript type inference from validation schemas

## Structure

Each module has:
- `{module}.validation.ts` - Zod schemas and TypeScript types
- `{module}.service.ts` - Services using `schema.parse()` for validation
- `{module}.controller.ts` - Controllers handling validation errors

## Usage Pattern

### 1. Create Validation Schema

```typescript
// src/app/module/auth/auth.validation.ts
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginPayload = z.infer<typeof LoginSchema>;
```

### 2. Use in Service

```typescript
// src/app/module/auth/auth.service.ts
import { LoginSchema, type LoginPayload } from './auth.validation';

const login = async (payload: LoginPayload) => {
  // Validate input - throws ZodError if invalid
  const validatedData = LoginSchema.parse(payload);
  const { email, password } = validatedData;
  
  // ... rest of logic
};
```

### 3. Handle in Controller

```typescript
// src/app/module/auth/auth.controller.ts
import { validateRequest } from '../../middleware/validateRequest';

const login = validateRequest(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  
  sendResponse(res, {
    success: true,
    message: 'Login successful',
    data: result,
    httpStatusCode: 200
  });
});
```

## Error Handling

### Automatic Error Handling

The `validateRequest` middleware automatically catches `ZodError` and returns a formatted response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email format"
    },
    {
      "path": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "httpStatusCode": 400
}
```

### Manual Error Handling

If you need custom error handling in a controller:

```typescript
import { ZodError } from 'zod';

try {
  const result = await AuthService.registerPatient(req.body);
  // ...
} catch (error) {
  if (error instanceof ZodError) {
    const errors = error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
  // Handle other errors
}
```

## Implemented Modules

### ✅ Auth Module
- `RegisterPatientSchema` - Patient registration validation
- `LoginSchema` - Login credentials validation
- `CreateDoctorUserSchema` - Doctor creation validation

### ✅ Doctor Module
- `CreateDoctorSchema` - Doctor profile creation
- `UpdateDoctorSchema` - Doctor profile updates

### ✅ Speciality Module
- `CreateSpecialitySchema` - Speciality creation
- `UpdateSpecialitySchema` - Speciality updates

### ✅ User Module
- `UpdateUserSchema` - User profile updates

## Common Zod Patterns

### Optional Fields
```typescript
email: z.string().email().optional(),
```

### Nullable Fields
```typescript
profilePicture: z.string().url().optional().nullable(),
```

### Enums
```typescript
gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
```

### Arrays
```typescript
specialities: z.array(z.object({
  specialityId: z.string(),
})),
```

### Custom Messages
```typescript
password: z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter'),
```

### Nested Objects
```typescript
doctor: z.object({
  name: z.string(),
  email: z.string().email(),
  // ... other fields
}),
```

## Adding Zod to New Routes

1. **Create validation schema**:
   ```typescript
   // src/app/module/newModule/newModule.validation.ts
   export const CreateNewModuleSchema = z.object({
     // define your fields
   });
   ```

2. **Update service**:
   ```typescript
   import { CreateNewModuleSchema } from './newModule.validation';
   
   const create = async (payload) => {
     const validatedData = CreateNewModuleSchema.parse(payload);
     // ... rest of logic
   };
   ```

3. **Use validateRequest in controller**:
   ```typescript
   import { validateRequest } from '../../middleware/validateRequest';
   
   const create = validateRequest(async (req, res) => {
     const result = await NewModuleService.create(req.body);
     // ... send response
   });
   ```

## Best Practices

1. **Always validate at the service level** - This ensures validation happens even if the service is called from other places
2. **Use type inference** - `z.infer<typeof Schema>` keeps types in sync with validation
3. **Provide clear error messages** - Help API consumers understand what went wrong
4. **Validate related fields together** - Use `.refine()` for complex validation logic
5. **Handle nullable vs optional** - Be explicit about which fields can be null/undefined
6. **Test validation schemas** - Create test files for complex schemas

## Testing

Example test for validation schema:

```typescript
import { RegisterPatientSchema } from './auth.validation';

describe('RegisterPatientSchema', () => {
  it('should validate correct input', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123',
    };
    expect(() => RegisterPatientSchema.parse(data)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const data = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'SecurePass123',
    };
    expect(() => RegisterPatientSchema.parse(data)).toThrow();
  });
});
```
