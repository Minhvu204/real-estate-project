import Property from "../../models/property.model";
import City from "../../models/city.model";
import { createMultilangText } from "../../utils/translateHelper";

//  Lấy danh sách thành phố
export const getAllCities = async () => {
  return await City.find({ deleted: false }).sort({ createdAt: -1 });
};

//  Tạo mới thành phố (đa ngôn ngữ)
export const createCity = async (data: any) => {
  const { city_name } = data;
  if (!city_name) throw new Error("Tên thành phố là bắt buộc.");

  const multiLangName = await createMultilangText(city_name);
  return await City.create({
    city_name: multiLangName,
    deleted: false,
  });
};

//  Cập nhật thành phố
export const updateCity = async (id: string, data: any) => {
  const { city_name } = data;
  const city = await City.findById(id);
  if (!city) throw new Error("Không tìm thấy thành phố.");

  const multiLangName = await createMultilangText(city_name);
  return await City.findByIdAndUpdate(id, { city_name: multiLangName }, { new: true });
};

// Xóa (soft delete) với ràng buộc
export const deleteCity = async (id: string) => {
  const propertyInUse = await Property.exists({ city_id: id });
  if (propertyInUse) {
    throw new Error("Không thể xóa vì có property thuộc thành phố này.");
  }

  const deletedCity = await City.findByIdAndUpdate(id, { deleted: true }, { new: true });
  if (!deletedCity) throw new Error("Không tìm thấy thành phố để xóa.");
  return deletedCity;
};
