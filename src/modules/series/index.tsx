import { MeSeries } from '@/domains/series/MeSeries'
import { SeriesDetails } from '@/domains/series/Series'
import { Separator, Text } from '@radix-ui/themes'

export const Series = ({ uuid }: { uuid: string }) => {
  return (
    <main>
      <SeriesDetails uuid={uuid} />
    </main>
  )
}

export const MeSeriesModule = () => {
  return (
    <main>
      <Text size="7" weight="bold">
        Me Series
      </Text>
      <Separator my="4" size="4" />
      <MeSeries />
    </main>
  )
}
