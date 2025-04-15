// Progress Service for managing progress of episodes

import { Progress } from '@/models/Progress'
import {
  getProgress,
  createProgress,
  updateProgress,
  deleteProgress,
  deleteAllProgress
} from '@/db/operations/progress'
export class ProgressService {
  static async getProgress(episodeUuid: string) {
    return await getProgress(episodeUuid)
  }

  static async createProgress(progress: Progress) {
    return await createProgress(progress)
  }

  static async updateProgress(progress: Progress) {
    return await updateProgress(progress)
  }

  static async deleteProgress(id: number) {
    return await deleteProgress(id)
  }

  static async deleteAllProgress() {
    return await deleteAllProgress()
  }
}
