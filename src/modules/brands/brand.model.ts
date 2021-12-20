import * as mongoose from 'mongoose';

export const BrandSchema = new mongoose.Schema({
  name: { type: String },
  slug: { type: String, unique: true, index: true },
  name_lower: { type: String },
  description: { type: String },
  image: { type: String },
  status: { type: String, default: 'enable', index: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export interface Brand extends mongoose.Document {
  name: string;
  slug: string;
  name_lower: string;
  description: string;
  image: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

BrandSchema.static = {
  get(id: any): any {
    return this.findById(id)
      .exec()
      .then((brand) => {
        if (brand) {
          return brand;
        }
        // throw new HttpException(404, "No such brand exists!")
      });
  },

  list(skip = 0, limit = 10) {
    let query = this.find().sort({ created_at: -1 });
    if (skip > 0) query = query.skip(skip);
    if (limit > 0) query = query.limit(limit);
    return query.lean().exec();
  },

  total() {
    return this.estimatedDocumentCount().exec();
  },
};

BrandSchema.pre('save', async function (next) {
  if (!this.noTriggerMiddleware) {
    if (this.name) {
      if (!this.slug) {
        this.name_lower = this.name.toLowerCase();
        this.slug = this.name_lower
          .replace(/[&\/\\#”“’;,+()$~%.'":*?<>{}]/g, "")
          .replace(/ /g, "-")
          .replace(/---/g, "-")
          .replace(/--/g, "-")
      }
    }
  }
  next();
});

export default mongoose.model('Brand', BrandSchema);
