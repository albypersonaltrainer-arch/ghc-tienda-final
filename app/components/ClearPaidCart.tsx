'use client'

import { useEffect } from 'react'

export default function ClearPaidCart({ paid }: { paid: boolean }) {
  useEffect(() => {
    if (!paid) return
    window.localStorage.removeItem('ghc_cart')
  }, [paid])

  return null
}
