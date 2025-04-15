// series operations test

import {
  upsertSeries,
  getSeries,
  deleteSeries,
  getAllSeries,
  deleteAllSeries
} from '@/db/operations/series'
import { createSeries, Series } from '@/models/Series'

const seriesMock = createSeries({
  uuid: '1',
  name: 'Test Series',
  description: 'Test Description',
  authorName: 'Test Author',
  datePublished: 1681612800,
  imageUrl: 'Test Image',
  listens: 100,
  episodes: [],
  seriesUuid: '1',
  totalEpisodesCount: 10,
  websiteUrl: 'Test Website'
})

const seriesMock2 = createSeries({
  uuid: '2',
  name: 'Test Series 2',
  description: 'Test Description 2',
  authorName: 'Test Author 2',
  datePublished: 1681612800,
  imageUrl: 'Test Image 2',
  listens: 200,
  episodes: [],
  seriesUuid: '2',
  totalEpisodesCount: 20,
  websiteUrl: 'Test Website 2'
})

describe('Series Operations', () => {
  beforeEach(async () => {
    await deleteAllSeries()
  })

  it('upsertSeries', async () => {
    const successful = await upsertSeries(seriesMock)
    expect(successful).toEqual(true)

    const seriesSaved = await getSeries(seriesMock.uuid).catch(console.error)
    expect(seriesSaved).toBeDefined()
    expect(seriesSaved?.uuid).toBe(seriesMock.uuid)
  })

  it('deleteSeries', async () => {
    const successful = await upsertSeries(seriesMock)
    expect(successful).toEqual(true)

    const deleted = await deleteSeries(seriesMock.uuid)
    expect(deleted).toEqual(true)

    const seriesSaved = await getSeries(seriesMock.uuid).catch(console.error)
    expect(seriesSaved).toBeUndefined()
  })

  it('getAllSeries', async () => {
    await upsertSeries(seriesMock)
    await upsertSeries(seriesMock2)

    const series = await getAllSeries()
    expect(series.length).toEqual(2)
    expect(series[0].uuid).toEqual(seriesMock.uuid)
    expect(series[1].uuid).toEqual(seriesMock2.uuid)
  })

  it('getSeries', async () => {
    await upsertSeries(seriesMock)
    const series = await getSeries(seriesMock.uuid)
    expect(series?.uuid).toEqual(seriesMock.uuid)
  })

  it('deleteAllSeries', async () => {
    await upsertSeries(seriesMock)
    await upsertSeries(seriesMock2)
    const deleted = await deleteAllSeries()
    expect(deleted).toEqual(true)
  })
})
