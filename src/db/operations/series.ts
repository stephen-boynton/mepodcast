import { Logger } from "@/lib/Logger";
import { db } from "..";
import { Series } from "@/models/Series";
import { SeriesData } from "../Database";

export async function getAllSeries() {
  return await db.series.toArray();
}

export async function getSeries(uuid: string) {
  return await db.series.get({ uuid });
}

export async function deleteSeries(uuid: string) {
  return await db.series.where("seriesUuid").equals(uuid).delete();
}

export async function upsertSeries(series: Series) {
  if (!series.seriesUuid) {
    Logger.warn(`Missing series uuid: ${series.name}`);
    return null;
  }

  const seriesData = series as SeriesData;

  const exists = await db.series
    .where("uuid")
    .equals(series.seriesUuid)
    .first();

  if (exists) {
    await db.series.update(exists.id, seriesData);
    return true;
  }

  await db.series.put(seriesData);
  return true;
}
