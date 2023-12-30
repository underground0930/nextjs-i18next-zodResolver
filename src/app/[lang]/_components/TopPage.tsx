'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

// ページ共通
import { Languages, useTranslation } from '@/hooks/i18n'
import { setMetadata } from '@/utils'

// ページ固有
import { topTranslation as translation } from '../_translations/top'
import type { Inputs } from '../_types'
import { Input, Label, ErrorText } from '../_components/form'
import { maxLength } from '../_constants'

export const generateMetadata = setMetadata(translation)

type Props = {
  lang: Languages
}

// zodでバリデート
const inputSchema = (errors: string[]) =>
  z.object({
    name: z
      .string()
      .min(maxLength['name']['min'], errors[0])
      .max(maxLength['name']['max'], errors[1]),
    age: z.string().refine((data) => {
      const parsedNumber = parseInt(data)
      return (
        !isNaN(parsedNumber) &&
        parsedNumber >= maxLength['age']['min'] &&
        parsedNumber <= maxLength['age']['max']
      )
    }, errors[1]),
  })

export function TopPage({ lang }: Props) {
  const { t } = useTranslation({ lang, translation })
  const [count, setCount] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(
      inputSchema([
        t('validates.name', { min: maxLength['name']['min'], max: maxLength['name']['max'] }),
        t('validates.age', {
          min: maxLength['age']['min'],
          max: maxLength['age']['max'],
        }),
      ]),
    ),
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { name, age } = data
    console.log(name, age)
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>
        <h1 className='mb-5'>{t('lead')}</h1>
        <h2 className='mb-5'>{t('count', { count })}</h2>
        <div className='border-2'>
          <button
            className='block w-full'
            onClick={() => {
              setCount((prev) => prev + 1)
            }}
          >
            {t('button')}
          </button>
        </div>
        <h2 className='mt-5 mb-5 text-center'>Form Sample</h2>
        <div className='flex-1'>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
          >
            <div className='mb-5'>
              <Label>{t('name')}</Label>
              <Input {...register('name')} />
              {errors.name?.message && <ErrorText error={errors.name.message} />}
            </div>
            <div className='mb-5'>
              <Label>{t('age')}</Label>
              <Input {...register('age')} />
              {errors.age?.message && <ErrorText error={errors.age.message} />}
            </div>
            <div className='flex justify-center'>
              <div className='w-[100px]'>
                <button className='w-full h-10 text-white bg-[#bbb]' type='submit'>
                  {t('submit')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
