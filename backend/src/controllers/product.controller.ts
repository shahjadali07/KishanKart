import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import Product, { IProduct, ProductStatus } from '../models/Product';
import StockLog from '../models/StockLog';
import User from '../models/User';
import { parsePagination, parseSort } from '../middleware/validate.middleware';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors';

function toProductResponse(product: IProduct) {
  return {
    id: product._id,
    _id: product._id,
    name: product.name,
    hindiName: product.hindiName,
    description: product.description,
    category: product.category,
    price: product.price,
    unit: product.unit,
    availableQuantity: product.availableQuantity,
    minimumOrderQuantity: product.minimumOrderQuantity,
    lowStockThreshold: product.lowStockThreshold,
    isOrganic: product.isOrganic,
    grade: product.grade,
    images: product.images,
    farmerId: product.farmerId,
    farmerName: product.farmerName,
    farmerLocation: product.farmerLocation,
    mandi: product.mandi,
    location: product.location,
    harvestDate: product.harvestDate,
    status: product.status,
    rejectionReason: product.rejectionReason,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

const CATEGORY_ALLOWED = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Organic', 'Organic Products', 'Seasonal Crops', 'Seeds'];
const UNIT_ALLOWED = ['kg', 'quintal', 'box', 'litre', 'piece', 'bag', 'bunch'];
const GRADE_ALLOWED = ['Grade A', 'Grade B', 'Export Quality', 'Certified Organic'];
const STATUS_ALLOWED: ProductStatus[] = ['Active', 'Inactive', 'Out of Stock', 'Pending Approval'];

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, category, price, unit, availableQuantity, minimumOrderQuantity, lowStockThreshold, isOrganic, grade, images, mandi, location, harvestDate, hindiName } = req.body;

    if (category && !CATEGORY_ALLOWED.includes(category)) {
      throw new ValidationError('Validation failed', { category: [`category must be one of: ${CATEGORY_ALLOWED.join(', ')}`] });
    }
    if (unit && !UNIT_ALLOWED.includes(unit)) {
      throw new ValidationError('Validation failed', { unit: [`unit must be one of: ${UNIT_ALLOWED.join(', ')}`] });
    }
    if (grade && !GRADE_ALLOWED.includes(grade)) {
      throw new ValidationError('Validation failed', { grade: [`grade must be one of: ${GRADE_ALLOWED.join(', ')}`] });
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      throw new ValidationError('Validation failed', { price: ['price must be a positive number'] });
    }
    const qtyNum = Number(availableQuantity);
    if (!Number.isFinite(qtyNum) || qtyNum < 0) {
      throw new ValidationError('Validation failed', { availableQuantity: ['availableQuantity must be a non-negative number'] });
    }
    const minQty = minimumOrderQuantity === undefined ? 1 : Number(minimumOrderQuantity);
    if (!Number.isFinite(minQty) || minQty < 1) {
      throw new ValidationError('Validation failed', { minimumOrderQuantity: ['minimumOrderQuantity must be at least 1'] });
    }
    if (minQty > qtyNum && qtyNum > 0) {
      throw new ValidationError('Validation failed', { minimumOrderQuantity: ['minimumOrderQuantity cannot exceed availableQuantity'] });
    }
    const lowThreshold = lowStockThreshold === undefined ? 0 : Number(lowStockThreshold);
    if (!Number.isFinite(lowThreshold) || lowThreshold < 0) {
      throw new ValidationError('Validation failed', { lowStockThreshold: ['lowStockThreshold must be a non-negative number'] });
    }

    const farmer = await User.findById(req.user!.id);
    if (!farmer) {
      throw new NotFoundError('Farmer account not found');
    }

    const product = await Product.create({
      name,
      hindiName,
      description,
      category,
      price: priceNum,
      unit,
      availableQuantity: qtyNum,
      minimumOrderQuantity: minQty,
      lowStockThreshold: lowThreshold,
      isOrganic: Boolean(isOrganic),
      grade: grade ?? 'Grade A',
      images: Array.isArray(images) ? images.slice(0, 6) : [],
      farmerId: farmer._id,
      farmerName: farmer.name,
      farmerLocation: farmer.location,
      mandi,
      location: location ?? farmer.location,
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
      status: qtyNum === 0 ? 'Out of Stock' : 'Active',
    } as Partial<IProduct>);

    if (qtyNum > 0) {
      await StockLog.create({
        productId: product._id,
        productName: product.name,
        farmerId: farmer._id,
        changeType: 'SET',
        changeAmount: qtyNum,
        previousStock: 0,
        newStock: qtyNum,
        reason: 'Initial lot listing',
      });
    }

    res.status(201).json({ success: true, data: toProductResponse(product) });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { sortBy, order } = parseSort(req, ['createdAt', 'price', 'availableQuantity', 'name'], 'createdAt');

    const filter: any = { status: 'Active' };

    const { search, category, minPrice, maxPrice, location, unit, isOrganic, farmerId } = req.query;

    if (search) {
      const q = String(search).trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { farmerName: { $regex: q, $options: 'i' } },
      ];
    }
    if (category) {
      const cats = String(category).split(',').map(c => c.trim()).filter(Boolean);
      if (cats.length) filter.category = { $in: cats };
    }
    if (unit) {
      filter.unit = String(unit);
    }
    if (isOrganic !== undefined && isOrganic !== '' && isOrganic !== 'false') {
      filter.isOrganic = isOrganic === 'true' || isOrganic === '1';
    }
    if (farmerId && isValidObjectId(String(farmerId))) {
      filter.farmerId = String(farmerId);
    }
    if (location) {
      filter.location = { $regex: String(location).trim(), $options: 'i' };
    }
    if (minPrice !== undefined && minPrice !== '') {
      const min = Number(minPrice);
      if (Number.isFinite(min)) {
        filter.price = { ...(filter.price ?? {}), $gte: min };
      }
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const max = Number(maxPrice);
      if (Number.isFinite(max)) {
        filter.price = { ...(filter.price ?? {}), $lte: max };
      }
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items.map(toProductResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + items.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { sortBy, order } = parseSort(req, ['createdAt', 'price', 'availableQuantity', 'name'], 'createdAt');

    const filter: any = {};
    const status = String(req.query.status ?? '').trim();
    if (status && STATUS_ALLOWED.includes(status as ProductStatus)) {
      filter.status = status;
    }
    const category = String(req.query.category ?? '').trim();
    if (category && CATEGORY_ALLOWED.includes(category)) {
      filter.category = category;
    }
    const search = String(req.query.search ?? '').trim();
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { farmerName: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ [sortBy]: order }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items.map(toProductResponse),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + items.length < total },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid product id', { id: ['id must be a valid product id'] });
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json({ success: true, data: toProductResponse(product) });
  } catch (error) {
    next(error);
  }
};

export const getMyProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { sortBy, order } = parseSort(req, ['createdAt', 'price', 'availableQuantity', 'name'], 'createdAt');

    const filter: any = { farmerId: req.user!.id };
    const status = String(req.query.status ?? '');
    if (status && STATUS_ALLOWED.includes(status as ProductStatus)) {
      filter.status = status;
    }
    const search = String(req.query.search ?? '').trim();
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const category = String(req.query.category ?? '').trim();
    if (category && CATEGORY_ALLOWED.includes(category)) {
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ [sortBy]: order }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items.map(toProductResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + items.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

const UPDATABLE_FIELDS = ['name', 'hindiName', 'description', 'category', 'price', 'unit', 'availableQuantity', 'minimumOrderQuantity', 'lowStockThreshold', 'isOrganic', 'grade', 'images', 'mandi', 'location', 'harvestDate'] as const;

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid product id', { id: ['id must be a valid product id'] });
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const isOwner = product.farmerId.toString() === req.user!.id;
    const isAdmin = req.user!.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You can only update your own listings');
    }

    const updates: any = {};
    for (const field of UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.price !== undefined) {
      const p = Number(updates.price);
      if (!Number.isFinite(p) || p <= 0) {
        throw new ValidationError('Validation failed', { price: ['price must be a positive number'] });
      }
    }
    if (updates.availableQuantity !== undefined) {
      const q = Number(updates.availableQuantity);
      if (!Number.isFinite(q) || q < 0) {
        throw new ValidationError('Validation failed', { availableQuantity: ['availableQuantity must be a non-negative number'] });
      }
      if (product.minimumOrderQuantity > q && q > 0) {
        throw new ValidationError('Validation failed', { minimumOrderQuantity: ['minimumOrderQuantity cannot exceed availableQuantity'] });
      }
    }
    if (updates.category !== undefined && !CATEGORY_ALLOWED.includes(updates.category)) {
      throw new ValidationError('Validation failed', { category: ['Invalid category'] });
    }
    if (updates.unit !== undefined && !UNIT_ALLOWED.includes(updates.unit)) {
      throw new ValidationError('Validation failed', { unit: ['Invalid unit'] });
    }
    if (updates.grade !== undefined && !GRADE_ALLOWED.includes(updates.grade)) {
      throw new ValidationError('Validation failed', { grade: ['Invalid grade'] });
    }

    // Track stock change for audit log (owner or admin adjusting quantity)
    if (updates.availableQuantity !== undefined && Number(updates.availableQuantity) !== product.availableQuantity) {
      const previousStock = product.availableQuantity;
      const newStock = Number(updates.availableQuantity);
      const changeType = newStock > previousStock ? 'ADD' : 'SUBTRACT';
      await StockLog.create({
        productId: product._id,
        productName: product.name,
        farmerId: product.farmerId,
        changeType,
        changeAmount: Math.abs(newStock - previousStock),
        previousStock,
        newStock,
        reason: req.body.stockReason || 'Manual stock update',
      });
    }

    Object.assign(product, updates);
    await product.save();

    res.json({ success: true, data: toProductResponse(product) });
  } catch (error) {
    next(error);
  }
};

export const updateProductStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid product id', { id: ['id must be a valid product id'] });
    }
    if (!status || !STATUS_ALLOWED.includes(status as ProductStatus)) {
      throw new ValidationError('Validation failed', { status: [`status must be one of: ${STATUS_ALLOWED.join(', ')}`] });
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const isOwner = product.farmerId.toString() === req.user!.id;
    const isAdmin = req.user!.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You can only update your own listings');
    }

    product.status = status as ProductStatus;
    if (status === 'Out of Stock') {
      product.availableQuantity = 0;
    } else if (status === 'Active' && product.availableQuantity === 0) {
      throw new ValidationError('Validation failed', { status: ['Cannot activate a listing with zero stock. Add quantity first.'] });
    }
    if (rejectionReason !== undefined && (isAdmin || status === 'Pending Approval')) {
      product.rejectionReason = rejectionReason;
    }

    await product.save();
    res.json({ success: true, data: toProductResponse(product) });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid product id', { id: ['id must be a valid product id'] });
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const isOwner = product.farmerId.toString() === req.user!.id;
    const isAdmin = req.user!.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You can only delete your own listings');
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Listing deleted successfully', data: { id: product._id } });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { changeType, changeAmount, reason, newStock } = req.body;

    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid product id', { id: ['id must be a valid product id'] });
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const isOwner = product.farmerId.toString() === req.user!.id;
    const isAdmin = req.user!.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You can only adjust stock on your own listings');
    }

    const previousStock = product.availableQuantity;
    let nextStock: number;

    if (changeType === 'SET') {
      const target = Number(newStock ?? changeAmount);
      if (!Number.isFinite(target) || target < 0) {
        throw new ValidationError('Validation failed', { newStock: ['newStock must be a non-negative number'] });
      }
      nextStock = target;
    } else {
      const delta = Number(changeAmount);
      if (!Number.isFinite(delta) || delta <= 0) {
        throw new ValidationError('Validation failed', { changeAmount: ['changeAmount must be a positive number'] });
      }
      if (changeType === 'SUBTRACT') {
        nextStock = Math.max(0, previousStock - delta);
      } else {
        nextStock = previousStock + delta;
      }
    }

    const updated = await Product.findByIdAndUpdate(id, {
      availableQuantity: nextStock,
      ...(nextStock === 0
        ? { status: 'Out of Stock' }
        : nextStock > 0 && product.status === 'Out of Stock'
          ? { status: 'Active' }
          : {}),
    }, { returnDocument: 'after' });

    await StockLog.create({
      productId: product._id,
      productName: product.name,
      farmerId: product.farmerId,
      changeType: changeType === 'SET' ? 'SET' : changeType === 'SUBTRACT' ? 'SUBTRACT' : 'ADD',
      changeAmount: Math.abs(nextStock - previousStock),
      previousStock,
      newStock: nextStock,
      reason: reason || 'Manual adjustment',
    });

    res.json({ success: true, data: toProductResponse(updated!) });
  } catch (error) {
    next(error);
  }
};

export const getProductStockHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid product id', { id: ['id must be a valid product id'] });
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const { page, limit, skip } = parsePagination(req);
    const [items, total] = await Promise.all([
      StockLog.find({ productId: product._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      StockLog.countDocuments({ productId: product._id }),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + items.length < total },
    });
  } catch (error) {
    next(error);
  }
};
