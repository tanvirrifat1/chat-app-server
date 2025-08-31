import { IProduct } from './product.interface';
import { Product } from './product.model';

const createManyProducts = async (products: IProduct[]) => {
  return await Product.insertMany(products);
};

const getAllData = async (query: Record<string, unknown>) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filtersData } =
    query as {
      searchTerm?: string;
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      [key: string]: unknown;
    };

  const andConditions = [];

  // Search functionality
  if (searchTerm) {
    // Add fields you want to be searchable
    const searchableFields = ['name', 'description', 'category'];
    andConditions.push({
      $or: searchableFields.map(field => ({
        [field]: {
          $regex: searchTerm as string,
          $options: 'i',
        },
      })),
    });
  }

  // Filtering functionality for exact matches
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  let resultQuery = Product.find(whereConditions);

  // Sorting
  if (sortBy) {
    const order = sortOrder === 'desc' ? -1 : 1;
    resultQuery = resultQuery.sort({ [sortBy]: order });
  }

  // Pagination
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10; // Default to 10 if not provided
  const skip = (pageNum - 1) * limitNum;

  const total = await Product.countDocuments(whereConditions);
  const result = await resultQuery.skip(skip).limit(limitNum).exec();
  return {
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
    },
    data: result,
  };
};

export const ProductService = {
  createManyProducts,
  getAllData,
};
