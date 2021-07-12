import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StatementDTO {
  @IsNotEmpty()
  @ApiProperty({ type: 'file', description: 'PDF File' })
  pdfFile: any;
}
