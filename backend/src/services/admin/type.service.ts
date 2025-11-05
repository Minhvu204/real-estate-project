import Property from "../../models/property.model";
import PropertyType from "../../models/propertyType.model";
import { createMultilangText } from "../../utils/translateHelper";

export const getAllTypes = async () => {
  return await PropertyType.find({ deleted: false }).sort({ createdAt: -1 });
};

export const createType = async (data: any) => {
  const { type_name } = data;
  if (!type_name) throw new Error("Tên loại bất động sản là bắt buộc.");

  const multiLangName = await createMultilangText(type_name);
  return await PropertyType.create({
    type_name: multiLangName,
    deleted: false,
  });
};

export const updateType = async (id: string, data: any) => {
  const { type_name } = data;
  const type = await PropertyType.findById(id);
  if (!type) throw new Error("Không tìm thấy loại bất động sản.");

  const multiLangName = await createMultilangText(type_name);
  return await PropertyType.findByIdAndUpdate(id, { type_name: multiLangName }, { new: true });
};

export const deleteType = async (id: string) => {
  const propertyInUse = await Property.exists({ type_id: id });
  if (propertyInUse) {
    throw new Error("Không thể xóa vì có property thuộc loại này.");
  }

  const deletedType = await PropertyType.findByIdAndUpdate(id, { deleted: true }, { new: true });
  if (!deletedType) throw new Error("Không tìm thấy loại bất động sản để xóa.");
  return deletedType;
};
