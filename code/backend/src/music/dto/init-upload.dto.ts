import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class InitUploadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsNumber()
  @IsNotEmpty()
  fileSize: number;

  @IsString()
  @IsOptional()
  licenseType?: string;
}
