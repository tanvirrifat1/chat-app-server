import { IItems } from './item.interface';
import { Item } from './item.model';

const createItem = async (data: IItems) => {
  const isExist = await Item.findOne({ name: data.name, userId: data.userId });

  if (isExist) {
    throw new Error('Item already exist!');
  }

  const result = await Item.create(data);
  return result;
};

const getAllItems = async (query: Record<string, unknown>, user: string) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { userId: user };

  if (query.category) {
    filter.category = query.category;
  }

  const [result, total] = await Promise.all([
    Item.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Item.countDocuments(filter),
  ]);

  return {
    result,
    page,
    limit,
    total,
  };
};

export const ItemService = {
  createItem,
  getAllItems,
};
