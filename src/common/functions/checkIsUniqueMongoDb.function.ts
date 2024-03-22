import { model, Schema } from 'mongoose';

export async function checkIsUniqueMongoDb(
  modelName: string,
  schema: Schema,
  field: string,
  data: string[],
  entryId?: string,
  moreWhereOption?: object,
): Promise<boolean> {
  let whereOption: object = { [field]: { $in: data } };
  if (entryId) {
    whereOption['_id'] = entryId;
  }
  if (moreWhereOption) {
    whereOption = { ...whereOption, ...moreWhereOption };
  }
  const count = await model(modelName, schema).countDocuments(whereOption);
  return !count;
}
