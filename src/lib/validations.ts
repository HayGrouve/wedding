import { z } from "zod";

// Bulgarian phone number regex (supports common formats)
// Supports: 087XXXXXXX, 088XXXXXXX, 089XXXXXXX (mobile), 02XXXXXXX, 032XXXXXX (landline), etc.
// With/without spaces and dashes, with/without +359 international prefix
const BULGARIAN_PHONE_REGEX =
  /^(\+359[\s-]?|0)[2-9]\d{1}[\s-]?\d{3}[\s-]?\d{3,4}$/;

// Email validation with more comprehensive regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Base guest validation schema
export const GuestSchema = z.object({
  id: z.string().min(1, "ID е задължително"),
  guestName: z
    .string()
    .min(2, "Името трябва да съдържа поне 2 символа")
    .max(100, "Името не може да съдържа повече от 100 символа")
    .regex(
      /^[а-яА-Яa-zA-Z\s'-]+$/,
      "Името може да съдържа само букви, спейсове, апостроф и тире"
    ),
  email: z
    .string()
    .email("Невалиден email адрес")
    .regex(EMAIL_REGEX, "Невалиден email формат")
    .max(255, "Email адресът не може да съдържа повече от 255 символа"),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => !phone || BULGARIAN_PHONE_REGEX.test(phone),
      "Невалиден български телефонен номер (използвайте формат: 0877311601, 087 731 1601, +359 87 731 1601 или подобни)"
    ),
  attending: z.boolean({
    required_error: "Моля, посочете дали ще присъствате",
  }),
  plusOneAttending: z.boolean().default(false),
  plusOneName: z
    .string()
    .optional()
    .refine(
      (name) => !name || (name.length >= 2 && name.length <= 100),
      "Името на спътника трябва да съдържа между 2 и 100 символа"
    )
    .refine(
      (name) => !name || /^[а-яА-Яa-zA-Z\s'-]+$/.test(name),
      "Името на спътника може да съдържа само букви, спейсове, апостроф и тире"
    ),
  childrenCount: z
    .number()
    .int("Броят деца трябва да бъде цяло число")
    .min(0, "Броят деца не може да бъде отрицателен")
    .max(10, "Броят деца не може да бъде повече от 10")
    .default(0),
  dietaryPreference: z.enum(["standard", "vegetarian"]).optional(),
  menuChoice: z
    .enum(["meat", "vegetarian"], {
      errorMap: () => ({
        message: "Моля, изберете валидно меню",
      }),
    })
    .optional(),
  plusOneMenuChoice: z
    .enum(["meat", "vegetarian"], {
      errorMap: () => ({
        message: "Моля, изберете валидно меню за спътника",
      }),
    })
    .optional(),
  allergies: z
    .string()
    .max(
      500,
      "Информацията за алергии не може да съдържа повече от 500 символа"
    )
    .optional(),
  submissionDate: z.string().datetime("Невалидна дата на подаване"),
  ipAddress: z.string().optional(),
});

// RSVP form submission schema (without id and submissionDate)
export const RSVPFormSchema = z
  .object({
    guestName: GuestSchema.shape.guestName,
    email: GuestSchema.shape.email,
    phone: GuestSchema.shape.phone,
    attending: GuestSchema.shape.attending,
    plusOneAttending: GuestSchema.shape.plusOneAttending,
    plusOneName: GuestSchema.shape.plusOneName,
    childrenCount: GuestSchema.shape.childrenCount,
    dietaryPreference: GuestSchema.shape.dietaryPreference,
    menuChoice: GuestSchema.shape.menuChoice,
    plusOneMenuChoice: GuestSchema.shape.plusOneMenuChoice,
    allergies: GuestSchema.shape.allergies,
  })
  .refine(
    (data) => {
      // If plusOneAttending is true, plusOneName should be provided
      if (
        data.plusOneAttending &&
        (!data.plusOneName || data.plusOneName.trim().length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Моля, въведете името на спътника ви",
      path: ["plusOneName"],
    }
  )
  .refine(
    (data) => {
      // If not attending, plusOneAttending should be false
      if (!data.attending && data.plusOneAttending) {
        return false;
      }
      return true;
    },
    {
      message: "Не можете да доведете спътник, ако не присъствате",
      path: ["plusOneAttending"],
    }
  )
  .refine(
    (data) => {
      // If attending, menuChoice should be provided
      if (data.attending && !data.menuChoice) {
        return false;
      }
      return true;
    },
    {
      message: "Моля, изберете меню за себе си",
      path: ["menuChoice"],
    }
  )
  .refine(
    (data) => {
      // If plusOneAttending, plusOneMenuChoice should be provided
      if (data.plusOneAttending && !data.plusOneMenuChoice) {
        return false;
      }
      return true;
    },
    {
      message: "Моля, изберете меню за спътника си",
      path: ["plusOneMenuChoice"],
    }
  );

// API Response schemas
export const APIResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
  errors: z.record(z.string()).optional(), // For validation errors
});

export const GuestListResponseSchema = APIResponseSchema.extend({
  data: z
    .object({
      guests: z.array(GuestSchema),
      count: z.number(),
      stats: z
        .object({
          totalGuests: z.number(),
          attendingCount: z.number(),
          notAttendingCount: z.number(),
          plusOnesCount: z.number(),
          totalChildrenCount: z.number(),
          dietaryPreferences: z.record(z.number()),
          allergies: z.record(z.number()),
        })
        .optional(),
    })
    .optional(),
});

// Admin authentication schema
export const AdminLoginSchema = z.object({
  password: z
    .string()
    .min(1, "Паролата е задължителна")
    .max(100, "Паролата не може да съдържа повече от 100 символа"),
});

// Rate limiting schema
export const RateLimitSchema = z.object({
  ipAddress: z.string().ip("Невалиден IP адрес"),
  maxAttempts: z.number().int().min(1).max(100).default(3),
  windowHours: z.number().min(0.1).max(24).default(1),
});

// Query parameters for admin dashboard
export const AdminQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sortBy: z
    .enum(["submissionDate", "guestName", "email", "attending"])
    .default("submissionDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filterAttending: z
    .enum(["true", "false", "all"])
    .transform((val) => (val === "all" ? undefined : val === "true"))
    .optional(),
});

// Type exports
export type Guest = z.infer<typeof GuestSchema>;
export type RSVPFormData = z.infer<typeof RSVPFormSchema>;
export type APIResponse = z.infer<typeof APIResponseSchema>;
export type GuestListResponse = z.infer<typeof GuestListResponseSchema>;
export type AdminLogin = z.infer<typeof AdminLoginSchema>;
export type RateLimit = z.infer<typeof RateLimitSchema>;
export type AdminQuery = z.infer<typeof AdminQuerySchema>;

// Validation utility functions
export function validateRSVPForm(
  data: unknown
):
  | { success: true; data: RSVPFormData }
  | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = RSVPFormSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { general: "Възникна грешка при валидация на данните" },
    };
  }
}

export function validateAdminQuery(
  data: unknown
):
  | { success: true; data: AdminQuery }
  | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = AdminQuerySchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { general: "Невалидни параметри на заявката" },
    };
  }
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateBulgarianPhone(phone: string): boolean {
  return BULGARIAN_PHONE_REGEX.test(phone);
}

// Sanitization utilities
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

export function sanitizeGuestData(data: RSVPFormData): RSVPFormData {
  return {
    ...data,
    guestName: sanitizeString(data.guestName),
    email: sanitizeString(data.email.toLowerCase()),
    phone: data.phone
      ? sanitizeString(data.phone.replace(/\s|-/g, ""))
      : undefined,
    plusOneName: data.plusOneName
      ? sanitizeString(data.plusOneName)
      : undefined,
    allergies: data.allergies ? sanitizeString(data.allergies) : undefined,
    // Menu choices don't need sanitization as they're enum values
    menuChoice: data.menuChoice,
    plusOneMenuChoice: data.plusOneMenuChoice,
  };
}
