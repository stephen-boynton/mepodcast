import { ExternalLinkIcon } from '@radix-ui/react-icons'
import styles from './LinkOut.styles.module.scss'
import { Flex, Link } from '@radix-ui/themes'

export const LinkOut = ({
  href,
  children,
  testId
}: {
  href: string
  children: string
  testId?: string
}) => {
  return (
    <Link
      className={styles.container}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
    >
      <Flex align="center">
        {children}
        <ExternalLinkIcon />
      </Flex>
    </Link>
  )
}
