'use client'

import { useState, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  UpdateFarmHoursSchema,
  type UpdateFarmHoursInput,
  type UpdateFarmHoursFormInput,
} from '@/lib/validation/farm'
import { DAY_NAMES } from '@/lib/utils/farmTypes'
import { updateFarmHours } from './actions'

export interface HoursFormRow {
  day_of_week: number
  is_open: boolean
  open_time: string | null
  close_time: string | null
  note: string
}

interface HoursFormProps {
  farmId: string
  initialHours: HoursFormRow[]
}

export function HoursForm({ farmId, initialHours }: HoursFormProps): ReactNode {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFarmHoursFormInput, unknown, UpdateFarmHoursInput>({
    resolver: zodResolver(UpdateFarmHoursSchema),
    defaultValues: { hours: initialHours },
  })

  const hoursValues = useWatch({ control, name: 'hours' })

  async function onSubmit(data: UpdateFarmHoursInput): Promise<void> {
    setServerError(null)
    setSuccess(false)

    const result = await updateFarmHours(farmId, data)

    if (!result.success) {
      setServerError(result.error ?? 'Something went wrong')
      return
    }

    setSuccess(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl">
      {DAY_NAMES.map((label, i) => {
        const isOpen = hoursValues?.[i]?.is_open
        return (
          <div
            key={i}
            className="flex flex-col gap-2 border-b pb-3 md:flex-row md:items-center md:gap-4"
          >
            <label className="flex items-center gap-2 text-sm font-medium md:w-24">
              <input type="checkbox" {...register(`hours.${i}.is_open`)} />
              {label}
            </label>
            <input type="hidden" value={i} {...register(`hours.${i}.day_of_week`)} />
            {isOpen && (
              <>
                <input
                  type="time"
                  className="rounded-md border px-3 py-2 text-sm"
                  {...register(`hours.${i}.open_time`)}
                />
                <input
                  type="time"
                  className="rounded-md border px-3 py-2 text-sm"
                  {...register(`hours.${i}.close_time`)}
                />
              </>
            )}
            <input
              type="text"
              placeholder="Note (optional)"
              className="flex-1 rounded-md border px-3 py-2 text-sm"
              {...register(`hours.${i}.note`)}
            />
            {errors.hours?.[i]?.open_time && (
              <p className="text-sm text-red-600">{errors.hours[i]?.open_time?.message}</p>
            )}
          </div>
        )
      })}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Saving…' : 'Save hours'}
      </button>

      {success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Saved.</p>
      )}
      {serverError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
      )}
    </form>
  )
}
