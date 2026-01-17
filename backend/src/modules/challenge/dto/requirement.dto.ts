import { IsEnum, IsInt, Min } from 'class-validator';
import { RequirementType } from '../enums/requirement-type.enum';

export class RequirementDto {
  @IsEnum(RequirementType)
  type: RequirementType;

  @IsInt()
  @Min(1)
  value: number;
}
