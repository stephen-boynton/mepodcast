'use client'
import { useRouter } from 'next/navigation'
import styles from './BackButton.style.module.scss'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

export default function BackButton() {
  const router = useRouter()

  return (
    <button onClick={() => router.back()} className={styles.container}>
      <ArrowLeftIcon width={18} height={18} />
      Back
    </button>
  )
}
