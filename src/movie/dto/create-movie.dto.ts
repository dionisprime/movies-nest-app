export class CreateMovieDto {
  title: string;
  description?: string;
  year: number;
  duration: number;
  // genre?: string[];
  director?: string;
}
