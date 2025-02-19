import type { Episode } from "@/models/Episode";
import type { Series } from "@/models/Series";

export type Maybe<T> = T | null;

export type DisplayType = "series" | "episode";
export type Content = Series | Episode;
