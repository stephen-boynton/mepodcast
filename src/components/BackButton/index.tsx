'use client'
import { useRouter } from 'next/navigation'
import styles from './BackButton.style.module.scss'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'

export default function BackButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.back()} className={styles.container}>
      <ChevronLeftIcon name="back button" width={24} height={24} />
    </Button>
  )
}
