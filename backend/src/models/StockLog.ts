import mongoose from 'mongoose';

export type StockChangeType = 'ADD' | 'SUBTRACT' | 'SET';

export interface IStockLog extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  farmerId: mongoose.Types.ObjectId;
  changeType: StockChangeType;
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: string;
  refModel?: string;
  refId?: string;
}

const stockLogSchema = new mongoose.Schema<IStockLog>({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  productName: { type: String, required: true, trim: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  changeType: { type: String, enum: ['ADD', 'SUBTRACT', 'SET'], required: true },
  changeAmount: { type: Number, required: true },
  previousStock: { type: Number, required: true, min: 0 },
  newStock: { type: Number, required: true, min: 0 },
  reason: { type: String, trim: true, maxlength: 500 },
  refModel: { type: String, maxlength: 60 },
  refId: { type: String, maxlength: 120 },
}, {
  timestamps: true,
});

stockLogSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.model<IStockLog>('StockLog', stockLogSchema);
