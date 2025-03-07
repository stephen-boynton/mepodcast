'use client'
import { useRouter } from 'next/navigation'
import styles from './BackButton.style.module.scss'
import { ChevronLeftIcon } from '@radix-ui/react-icons'

export default function BackButton() {
  const router = useRouter()

  return (
    <button onClick={() => router.back()} className={styles.container}>
      <ChevronLeftIcon name="back button" width={24} height={24} />
    </button>
  )
}
