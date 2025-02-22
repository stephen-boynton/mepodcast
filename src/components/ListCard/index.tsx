import styles from "./ListCard.styles.module.scss"
import { Text } from "@radix-ui/themes"
import Image from "next/image"
import { truncate } from "@/utils"
import Link from "next/link"
import { CircleIcon } from "@radix-ui/react-icons"

export const ListCard = ({
  href,
  name,
  inProgress,
  description,
  imgSrc,
}: {
  href: string
  name: string
  inProgress?: boolean
  description: string
  imgSrc: string
}) => {
  return (
    <li>
      <Link href={href} className={styles.itemContainer}>
        <Text size="1" weight="bold">
          {name}
        </Text>
        {inProgress && <CircleIcon />}
        <div className={styles.itemText}>
          <Image
            src={imgSrc}
            alt={name}
            objectFit="cover"
            width={100}
            height={100}
          />
          <Text size="1">{truncate(description, 50)}</Text>
        </div>
      </Link>
    </li>
  )
}
