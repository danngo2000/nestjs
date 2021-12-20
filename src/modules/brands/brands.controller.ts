import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandsService) {}

  @Get()
  async getAllBrands(req, res) {
    const { limit = 20, page = 1 } = req.query;
    const total = await this.brandService.count({});
    const brands = await this.brandService.listBrand();
    return res.json({ brands, total, limit });
  }

  @Post()
  async addBrand(req, res, next) {
    const brand = this.brandService.addBrand(req.body);
    return res.json({ brand });
  }

  @Get(':id')
  async getBrandId(req, res) {
    return res.json({ brand: req.brand });
  }

  @Put(':id')
  async updateBrand(req, res, next) {
    try {
      const { brand, body } = req;
      brand.set({
        ...body,
        updated_at: Date.now(),
      });
      await brand.save();
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':id')
  async removeBrand(req, res, next) {
    try {
      await req.brand.remove();
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('search')
  async search(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.json([]);
      const words = name.split(' ');
      const query = { status: 'enable', $or: [] };
      words.forEach((word) => {
        query['$or'].push({ name: { $regex: name, $options: 'i' } });
        query['$or'].push({ slug: { $regex: name, $options: 'i' } });
      });
      let result = [];
      result = await this.brandService.findQueryBrand({ query });
      return res.json(result);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('searchForBrandPage')
  async searchForBrandPage(req, res) {
    try {
      const { query, page = 1, limit = 20 }: any = req.body;
      const count = await this.brandService.count(query);
      const brands = await this.brandService.findQueryBrand({
        query,
        page,
        limit,
      });
      return res.json({ count, brands });
    } catch (error) {
      console.log(error);
    }
  }

  @Post('deleteBulk')
  async deleteBulk(req, res) {
    try {
      const brands = await this.brandService.findBrand(req.body);
      if (brands.length) {
        for (const brand of brands) {
          await brand.remove();
          // remove brand in product
          // const products = await Product.find({ brand: brand.name });
          // if (products && products.length) {
          //   for (let product of products) {
          //     product.set({ ...product, brand: "" })
          //     await product.save()
          //   }
          // }
        }
      }
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
    }
  }
}
