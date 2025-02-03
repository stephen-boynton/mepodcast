import Dexie from "dexie";
import { useEffect, useState } from "react";

export const useDb = () => {
  const [db, setDb] = useState<Dexie | null>(null);

  useEffect(() => {
    const dbInstance = new Dexie("PodcastDB");
    dbInstance.version(1).stores({
      podcasts: "id,title,url", // Define your schema
    });
    setDb(dbInstance);
  }, []);

  return db;
};
