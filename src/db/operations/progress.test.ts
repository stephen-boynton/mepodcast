// tests for progress operations

import {
  Progress,
  createProgress as createProgressModel
} from '@/models/Progress'
import {
  createProgress,
  deleteProgress,
  getProgress,
  getAllProgress,
  deleteAllProgress,
  updateProgress,
  getSeriesProgress,
  saveProgress
} from './progress'

describe('Progress Operations', () => {
  beforeEach(async () => {
    await deleteAllProgress()
  })

  it('createProgress', async () => {
    const progress = createProgressModel({
      id: 1,
      episodeProgress: 0,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    await createProgress(progress)

    const progressSaved = await getProgress('1')
    expect(progressSaved).toBeDefined()
  })

  it('deleteProgress', async () => {
    const progress = createProgressModel({
      id: 1,
      episodeProgress: 0,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    await createProgress(progress)

    await deleteProgress(1)

    const progressSaved = await getProgress('1')
    expect(progressSaved).toBeNull()
  })

  it('deleteAllProgress', async () => {
    const progress = createProgressModel({
      id: 1,
      episodeProgress: 0,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    const progress2 = createProgressModel({
      id: 2,
      episodeProgress: 0,
      episodeUuid: '2',
      seriesUuid: '2',
      completed: false
    })

    await createProgress(progress)
    await createProgress(progress2)
    await deleteAllProgress()

    const progresses = await getAllProgress()
    expect(progresses.length).toBe(0)
  })

  it('updateProgress', async () => {
    const progress = createProgressModel({
      id: 1,
      episodeProgress: 0,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    await createProgress(progress)

    const progressUpdated = createProgressModel({
      id: 1,
      episodeProgress: 100,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    await updateProgress(progressUpdated)

    const progressSaved = await getProgress('1')
    expect(progressSaved).toBeDefined()
    expect(progressSaved?.episodeProgress).toBe(100)
  })

  it('getSeriesProgress', async () => {
    const progress = createProgressModel({
      id: 1,
      episodeProgress: 0,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    const progress2 = createProgressModel({
      id: 2,
      episodeProgress: 0,
      episodeUuid: '2',
      seriesUuid: '1',
      completed: false
    })

    const progress3 = createProgressModel({
      id: 3,
      episodeProgress: 0,
      episodeUuid: '3',
      seriesUuid: '2',
      completed: false
    })

    await createProgress(progress)
    await createProgress(progress2)
    await createProgress(progress3)

    const progresses = await getSeriesProgress('1')
    expect(progresses.length).toBe(2)
  })

  it('getProgress', async () => {
    const progress = createProgressModel({
      id: 1,
      episodeProgress: 0,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    await createProgress(progress)

    const progressSaved = await getProgress('1')
    expect(progressSaved).toBeDefined()
  })

  it('getProgress should return null if no progress', async () => {
    const progressSaved = await getProgress('1')
    expect(progressSaved).toBeNull()
  })

  it('getProgress should return null if no progressId', async () => {
    const progressSaved = await getProgress('')
    expect(progressSaved).toBeNull()
  })

  it('getAllProgress', async () => {
    const progress = createProgressModel({
      id: 1,
      episodeProgress: 0,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    const progress2 = createProgressModel({
      id: 2,
      episodeProgress: 0,
      episodeUuid: '2',
      seriesUuid: '2',
      completed: false
    })

    const progress3 = createProgressModel({
      id: 3,
      episodeProgress: 0,
      episodeUuid: '3',
      seriesUuid: '3',
      completed: false
    })

    await createProgress(progress)
    await createProgress(progress2)
    await createProgress(progress3)

    const progresses = await getAllProgress()
    expect(progresses.length).toBe(3)
  })

  it('saveProgress', async () => {
    const progress = createProgressModel({
      id: 1,
      episodeProgress: 0,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    await saveProgress(progress)

    const progressSaved = await getProgress('1')
    expect(progressSaved).toBeDefined()
  })

  it('saveProgress should return null if no episodeUuid', async () => {
    const progressSaved = await saveProgress({})
    expect(progressSaved).toBeNull()
  })

  it('saveProgress should update progress if it exists', async () => {
    const progress = createProgressModel({
      id: 1,
      episodeProgress: 0,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    await saveProgress(progress)

    const progressUpdated = createProgressModel({
      id: 1,
      episodeProgress: 100,
      episodeUuid: '1',
      seriesUuid: '1',
      completed: false
    })

    await saveProgress(progressUpdated)

    const progressSaved = await getProgress('1')
    expect(progressSaved).toBeDefined()
    expect(progressSaved?.episodeProgress).toBe(100)
  })
})
