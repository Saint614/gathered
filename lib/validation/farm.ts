import { z } from 'zod'

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null)

export const UpdateFarmProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: optionalText(2000),
  address: z.string().min(1, 'Address is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(50),
  zip: z.string().min(5, 'ZIP is required').max(10),
  phone: optionalText(20),
  email: z
    .string()
    .email('Enter a valid email')
    .max(200)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  website_url: z
    .string()
    .url('Enter a valid URL (include https://)')
    .max(500)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  cover_image_url: z
    .string()
    .url('Enter a valid URL')
    .max(500)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  avatar_url: z
    .string()
    .url('Enter a valid URL')
    .max(500)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
})

export type UpdateFarmProfileInput = z.infer<typeof UpdateFarmProfileSchema>
export type UpdateFarmProfileFormInput = z.input<typeof UpdateFarmProfileSchema>

// The client's zodResolver already runs UpdateFarmProfileSchema's transform
// (empty string -> null) before the Server Action receives the data, so
// re-validating with UpdateFarmProfileSchema itself would reject those nulls.
// This schema validates the already-transformed shape instead.
const nullableText = (max: number) => z.string().max(max).nullable()

export const UpdateFarmProfileServerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: nullableText(2000),
  address: z.string().min(1, 'Address is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(50),
  zip: z.string().min(5, 'ZIP is required').max(10),
  phone: nullableText(20),
  email: z.string().email('Enter a valid email').max(200).nullable(),
  website_url: z.string().url('Enter a valid URL (include https://)').max(500).nullable(),
  cover_image_url: z.string().url('Enter a valid URL').max(500).nullable(),
  avatar_url: z.string().url('Enter a valid URL').max(500).nullable(),
})

const timeString = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Use HH:MM')
  .nullable()

export const FarmHourRowSchema = z
  .object({
    day_of_week: z.number().int().min(0).max(6),
    is_open: z.boolean(),
    open_time: timeString,
    close_time: timeString,
    note: optionalText(200),
  })
  .refine((row) => !row.is_open || (row.open_time && row.close_time), {
    message: 'Open and close time are required when the day is open',
    path: ['open_time'],
  })

export const UpdateFarmHoursSchema = z.object({
  hours: z.array(FarmHourRowSchema).length(7, 'Must provide all 7 days'),
})

export type UpdateFarmHoursInput = z.infer<typeof UpdateFarmHoursSchema>
export type UpdateFarmHoursFormInput = z.input<typeof UpdateFarmHoursSchema>
export type FarmHourRowInput = z.infer<typeof FarmHourRowSchema>

// Same double-transform problem as the profile schema: the client already
// ran FarmHourRowSchema's transform, so re-validate the transformed shape.
const FarmHourRowServerSchema = z
  .object({
    day_of_week: z.number().int().min(0).max(6),
    is_open: z.boolean(),
    open_time: timeString,
    close_time: timeString,
    note: z.string().max(200).nullable(),
  })
  .refine((row) => !row.is_open || (row.open_time && row.close_time), {
    message: 'Open and close time are required when the day is open',
    path: ['open_time'],
  })

export const UpdateFarmHoursServerSchema = z.object({
  hours: z.array(FarmHourRowServerSchema).length(7, 'Must provide all 7 days'),
})
