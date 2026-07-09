'use client'

import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  UpdateFarmProfileSchema,
  type UpdateFarmProfileInput,
  type UpdateFarmProfileFormInput,
} from '@/lib/validation/farm'
import type { OwnerFarm } from '@/lib/supabase/getOwnerFarm'
import { updateFarmProfile } from './actions'

interface ProfileFormProps {
  farm: OwnerFarm
}

export function ProfileForm({ farm }: ProfileFormProps): ReactNode {
  const [serverError, setServerError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFarmProfileFormInput, unknown, UpdateFarmProfileInput>({
    resolver: zodResolver(UpdateFarmProfileSchema),
    defaultValues: {
      name: farm.name,
      description: farm.description ?? '',
      address: farm.address,
      city: farm.city,
      state: farm.state,
      zip: farm.zip,
      phone: farm.phone ?? '',
      email: farm.email ?? '',
      website_url: farm.website_url ?? '',
      cover_image_url: farm.cover_image_url ?? '',
      avatar_url: farm.avatar_url ?? '',
    },
  })

  async function onSubmit(data: UpdateFarmProfileInput): Promise<void> {
    setServerError(null)
    setWarning(null)
    setSuccess(false)

    const result = await updateFarmProfile(farm.id, data)

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof UpdateFarmProfileInput, { message })
        }
      }
      setServerError(result.error ?? 'Something went wrong')
      return
    }

    setSuccess(true)
    if (result.warning) setWarning(result.warning)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Farm name
        </label>
        <input
          id="name"
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <input
          id="address"
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          {...register('address')}
        />
        {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <input
            id="city"
            className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            {...register('city')}
          />
          {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="state" className="text-sm font-medium">
            State
          </label>
          <input
            id="state"
            className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            {...register('state')}
          />
          {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="zip" className="text-sm font-medium">
            ZIP
          </label>
          <input
            id="zip"
            className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            {...register('zip')}
          />
          {errors.zip && <p className="text-sm text-red-600">{errors.zip.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <input
          id="phone"
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          {...register('phone')}
        />
        {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="website_url" className="text-sm font-medium">
          Website
        </label>
        <input
          id="website_url"
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          {...register('website_url')}
        />
        {errors.website_url && (
          <p className="text-sm text-red-600">{errors.website_url.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cover_image_url" className="text-sm font-medium">
          Cover image URL
        </label>
        <input
          id="cover_image_url"
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          {...register('cover_image_url')}
        />
        {errors.cover_image_url && (
          <p className="text-sm text-red-600">{errors.cover_image_url.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="avatar_url" className="text-sm font-medium">
          Avatar URL
        </label>
        <input
          id="avatar_url"
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          {...register('avatar_url')}
        />
        {errors.avatar_url && (
          <p className="text-sm text-red-600">{errors.avatar_url.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Saving…' : 'Save changes'}
      </button>

      {success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Saved.</p>
      )}
      {warning && (
        <p className="rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-700">{warning}</p>
      )}
      {serverError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
      )}
    </form>
  )
}
