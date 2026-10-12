import mongoose from 'mongoose';

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Dairy'
  | 'Organic'
  | 'Organic Products'
  | 'Seasonal Crops'
  | 'Seeds';

export type ProductUnit = 'kg' | 'quintal' | 'box' | 'litre' | 'piece' | 'bag' | 'bunch';

export type ProductGrade = 'Grade A' | 'Grade B' | 'Export Quality' | 'Certified Organic';

export type ProductStatus = 'Active' | 'Inactive' | 'Out of Stock' | 'Pending Approval';

export interface IProduct extends mongoose.Document {
  name: string;
  hindiName?: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  availableQuantity: number;
  minimumOrderQuantity: number;
  lowStockThreshold: number;
  isOrganic: boolean;
  grade: ProductGrade;
  images: string[];
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  farmerLocation?: string;
  mandi?: string;
  location?: string;
  harvestDate?: Date;
  status: ProductStatus;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true, trim: true, maxlength: 120, index: true },
  hindiName: { type: String, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 2000 },
  category: {
    type: String,
    enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Organic', 'Organic Products', 'Seasonal Crops', 'Seeds'],
    required: true,
    index: true,
  },
  price: { type: Number, required: true, min: 0.01, max: 10000000 },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'box', 'litre', 'piece', 'bag', 'bunch'],
    required: true,
  },
  availableQuantity: { type: Number, required: true, min: 0, max: 100000000, index: true },
  minimumOrderQuantity: { type: Number, default: 1, min: 1, max: 100000 },
  lowStockThreshold: { type: Number, default: 0, min: 0, max: 100000000 },
  isOrganic: { type: Boolean, default: false },
  grade: {
    type: String,
    enum: ['Grade A', 'Grade B', 'Export Quality', 'Certified Organic'],
    default: 'Grade A',
  },
  images: [{ type: String, maxlength: 500 }],
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farmerName: { type: String, trim: true },
  farmerLocation: { type: String, trim: true },
  mandi: { type: String, trim: true, maxlength: 120 },
  location: { type: String, trim: true, maxlength: 200, index: true },
  harvestDate: Date,
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Out of Stock', 'Pending Approval'],
    default: 'Active',
    index: true,
  },
  rejectionReason: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

productSchema.index({ name: 'text', description: 'text', farmerName: 'text' });

productSchema.pre<IProduct>('save', function () {
  if (this.availableQuantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.status === 'Out of Stock') {
    this.status = 'Active';
  }
});

export default mongoose.model<IProduct>('Product', productSchema);
