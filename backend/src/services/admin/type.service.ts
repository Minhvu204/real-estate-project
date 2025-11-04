import Property from "../../models/property.model";
import PropertyType from "../../models/propertyType.model";

export const getAllTypes = async () => {
  return await PropertyType.find().sort({ createdAt: -1 });
};

export const createType = async (data: any) => {
  return await PropertyType.create(data);
};

export const updateType = async (id: string, data: any) => {
  const type = await PropertyType.findByIdAndUpdate(id, data, { new: true });
  if (!type) throw new Error("Không tìm thấy loại bất động sản");
  return type;
};

export const deleteType = async (id: string) => {
  const propertyInUse = await Property.exists({ type_id: id });
  if (propertyInUse) {
    throw new Error("Không thể xóa vì có property đang sử dụng loại này");
  }
  await PropertyType.findByIdAndDelete(id);
};
