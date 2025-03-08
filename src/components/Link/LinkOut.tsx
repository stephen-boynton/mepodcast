import { ExternalLinkIcon } from '@radix-ui/react-icons'
import styles from './LinkOut.styles.module.scss'
import { Flex, Link } from '@radix-ui/themes'

export const LinkOut = ({
  href,
  children
}: {
  href: string
  children: string
}) => {
  return (
    <Link
      className={styles.container}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Flex align="center">
        {children}
        <ExternalLinkIcon />
      </Flex>
    </Link>
  )
}
