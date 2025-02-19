import { getAllSeries } from "@/db/operations";
import { useLiveQuery } from "dexie-react-hooks";

export const useSubscribedSeries = () => {
  const subscribed = useLiveQuery(() => getAllSeries());
  return { subscribed };
};
