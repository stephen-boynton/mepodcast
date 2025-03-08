import { Search } from '@/domains/search/Search'
import styles from './page.module.scss'
import { SearchResults } from '@/domains/search/Results'
import { Box, Container } from '@radix-ui/themes'

export default function Home() {
  return (
    <Box className={styles.page}>
      <Container className={styles.main}>
        <Search />
        <SearchResults />
      </Container>
    </Box>
  )
}
