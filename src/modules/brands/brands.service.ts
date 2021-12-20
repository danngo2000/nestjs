import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.model';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel('Brand') private readonly brandModel: Model<Brand>,
  ) {}
  async listBrand(options = {}) {
    const { page, limit }: any = options;
    // const brands = await this.brandModel.list((page - 1) * limit, limit);
    // return brands;
  }

  async count(query) {
    const count = await this.brandModel.countDocuments(query);
    return count;
  }

  async addBrand(value) {
    const brand = new this.brandModel(value);
    await brand.save();
    return brand;
  }

  async findQueryBrand(options = {}) {
    const { query, limit = 20, page = 1 }: any = options;
    const result = await this.brandModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    return result;
  }

  async findBrand(value) {
    const brands = await this.brandModel.find({ _id: { $in: value } });
    return brands;
  }
}
