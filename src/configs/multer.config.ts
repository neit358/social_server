import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueNameImage = uuidv4() + extname(file.originalname);
          cb(null, uniqueNameImage);
        },
      }),
    }),
  ],
  exports: [MulterModule],
})
export class MulterConfigModule {}
