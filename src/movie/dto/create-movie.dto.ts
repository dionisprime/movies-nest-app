import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  genre?: string[];
  @ApiProperty()
  director?: string;
}
