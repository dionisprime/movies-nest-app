export class CreatePlaylistDto {
  playlistName: string;
  movies: string[];
  createdBy: string;
  isPrivate?: boolean;
}
