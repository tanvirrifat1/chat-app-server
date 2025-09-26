import { IItems } from './item.interface';
import { Item } from './item.model';

const createItem = async (data: IItems) => {
  const isExist = await Item.findOne({ name: data.name, userId: data.userId });

  if (isExist) {
    // throw new Error('Item already exist!');
  }

  const result = await Item.create(data);
  return result;
};

export const ItemService = {
  createItem,
};
