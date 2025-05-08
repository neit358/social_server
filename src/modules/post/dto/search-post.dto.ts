import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchPostDto {
  @IsString()
  @ApiProperty({
    description: 'Query string to search',
    example: 'hello world',
    required: false,
  })
  title: string;
}
