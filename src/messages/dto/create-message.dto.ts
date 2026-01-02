import { IsNumber, IsString, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMessageDTO {
    @IsNumber()
    user_id: number;

    @IsNumber()
    recipient_id: number;

    @IsString()
    content: string
}