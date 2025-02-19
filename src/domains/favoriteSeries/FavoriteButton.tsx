import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import styles from "./FavoriteButton.style.module.scss";
import { useAddToFavoriteSeries } from "./useAddToUserList";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { Series } from "@/models/Series";
import { Logger } from "@/lib/Logger";

export const FavoriteButton = ({ series }: { series: Series }) => {
  const alreadyAdded = useLiveQuery(
    () => db.series.get({ uuid: series.uuid }),
    [series.uuid]
  );

  const { addSeries } = useAddToFavoriteSeries({ series });

  const handleAddPodcast = (event: React.MouseEvent) => {
    event.preventDefault();
    addSeries().catch(Logger.error);
  };

  const handleRemovePodcast = (event: React.MouseEvent) => {
    event.preventDefault();
    db.series.where("uuid").equals(series.uuid).delete().catch(Logger.error);
  };

  const handler = alreadyAdded ? handleRemovePodcast : handleAddPodcast;
  const Icon = alreadyAdded ? MinusCircledIcon : PlusCircledIcon;

  return (
    <IconButton className={styles.button} onClick={handler}>
      <Icon width={25} height={25} />
    </IconButton>
  );
};
