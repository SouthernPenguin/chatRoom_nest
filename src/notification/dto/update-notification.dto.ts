import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create-notification.dto';

export class UpdateDto extends PartialType(CreateDto) {}
