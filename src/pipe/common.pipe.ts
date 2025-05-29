import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CommonPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const res = Number(value);
    return res ? res : value;
  }
}
