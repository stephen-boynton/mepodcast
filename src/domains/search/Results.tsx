import { mockSeries } from "../series/mocks";
import styles from "./Results.style.module.scss";
import { SearchFilters } from "./Filters";
import { Text } from "@radix-ui/themes";
import { ListCard } from "@/components/ListCard";

export const SearchResults = () => {
  const data = [mockSeries, mockSeries, mockSeries];
  return (
    <div className={styles.container}>
      <SearchFilters />
      <div className={styles.results}>
        <div>
          <Text size="2" weight="bold">
            Results:
          </Text>
          <Text size="2">{data.length}</Text>
        </div>
      </div>
      <ul className={styles.list}>
        {data.map((series) => {
          return (
            <li key={series.uuid}>
              <ListCard
                href={`/series/${series.uuid}/`}
                name={series.name}
                description={series.description}
                imgSrc={series.imageUrl}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
