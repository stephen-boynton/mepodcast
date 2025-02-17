export type Maybe<T> = T | null;

export type DisplayType = "podcast" | "episode";

export type Display = {
  authorName: string;
  description: string;
  imageUrl: string;
  name: string;
  totalEpisodesCount?: number;
  type: DisplayType;
  uuid: string;
  websiteUrl?: Maybe<string>;
};
