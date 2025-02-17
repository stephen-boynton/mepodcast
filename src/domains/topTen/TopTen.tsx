"use client";
import { PodcastCard } from "@/components/PodcastCard";
import { Heading, Separator } from "@radix-ui/themes";
import { Display } from "@/types/shared";
import { useTopTen } from "./useTopTen";
import styles from "./TopTen.style.module.scss";
import Link from "next/link";

const TopGrid = ({ items }: { items: Display[] }) => {
  return (
    <ul className={styles.itemGrid}>
      {items.map((item) => {
        return (
          <li key={item.uuid} className={styles.itemContainer}>
            <Link href={`/series/${item.uuid}`}>
              <PodcastCard
                imgSrc={item.imageUrl || item.imageUrl}
                name={item.name || ""}
                author={item.authorName || ""}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export const TopTen = () => {
  const {
    data: { series, episodes },
    loading,
  } = useTopTen();

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Heading as="h3" mb="4" weight="bold">
        Top 10 Series
      </Heading>
      <TopGrid items={series} />

      {episodes.length && (
        <>
          <Separator my="8" size="4" />
          <Heading as="h3" mb="4" weight="bold">
            Top 10 Episodes
          </Heading>
          <TopGrid items={episodes} />
        </>
      )}
    </>
  );
};
