import Property from "../../models/property.model";
import Category from "../../models/category.model";
import { createMultilangText } from "../../utils/translateHelper";

export const getAllCategories = async () => {
  return await Category.find({ deleted: false }).sort({ createdAt: -1 });
};

export const createCategory = async (data: any) => {
  const { category_name } = data;
  if (!category_name) throw new Error("Tên danh mục là bắt buộc.");

  const multiLangName = await createMultilangText(category_name);
  return await Category.create({
    category_name: multiLangName,
    deleted: false,
  });
};

export const updateCategory = async (id: string, data: any) => {
  const { category_name } = data;
  const category = await Category.findById(id);
  if (!category) throw new Error("Không tìm thấy danh mục.");

  const multiLangName = await createMultilangText(category_name);
  return await Category.findByIdAndUpdate(id, { category_name: multiLangName }, { new: true });
};

export const deleteCategory = async (id: string) => {
  const propertyInUse = await Property.exists({ category_id: id });
  if (propertyInUse) {
    throw new Error("Không thể xóa vì có property thuộc danh mục này.");
  }

  const deletedCategory = await Category.findByIdAndUpdate(id, { deleted: true }, { new: true });
  if (!deletedCategory) throw new Error("Không tìm thấy danh mục để xóa.");
  return deletedCategory;
};
