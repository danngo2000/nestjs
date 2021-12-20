import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BrandSchema } from './brand.model';
import { BrandController } from './brands.controller';
import { BrandsService } from './brands.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Brand', schema: BrandSchema }]),
  ],
  controllers: [BrandController],
  providers: [BrandsService],
})
export class BrandsModule {}
