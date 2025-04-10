import { IsDefined, IsOptional, IsString } from 'class-validator';

export class SubmitTestDto {
  @IsDefined({ message: 'Thiếu testId' })
  testId: number;

  @IsDefined({ message: 'Thiếu answers' })
  answers: Record<string, string>;

  @IsOptional()
  highlights?: { id: number; text: string; note?: string }[];

  @IsOptional()
  @IsString()
  speaking_audio_url?: string;
}
