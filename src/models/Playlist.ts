type PlaylistEpisode = {
  uuid: string;
  name: string;
  imageUrl: string;
  audioUrl: string;
  cache?: string;
};

export class Playlist {
  id: number = 0;
  name: string = "My-Playlist";
  description?: string;
  episodes: PlaylistEpisode[] = [];
  imageUrl?: string;

  constructor(playlist: Playlist) {
    Object.assign(this, playlist);
  }
}
