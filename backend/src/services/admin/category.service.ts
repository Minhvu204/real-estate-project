import Property from "../../models/property.model";
import Category from "../../models/category.model";

export const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const createCategory = async (data: any) => {
  return await Category.create(data);
};

export const updateCategory = async (id: string, data: any) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!category) throw new Error("Không tìm thấy danh mục");
  return category;
};

export const deleteCategory = async (id: string) => {
  const propertyInUse = await Property.exists({ category_id: id });
  if (propertyInUse) {
    throw new Error("Không thể xóa vì có property đang thuộc danh mục này");
  }
  await Category.findByIdAndDelete(id);
};
