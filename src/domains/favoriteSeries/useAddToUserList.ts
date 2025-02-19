import { upsertSeries } from "@/db/operations/series";
import { Series } from "@/models/Series";

export const useAddToFavoriteSeries = ({ series }: { series: Series }) => {
  const addSeries = async () => {
    return await upsertSeries(series);
  };

  return {
    addSeries,
  };
};
