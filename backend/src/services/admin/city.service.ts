import Property from "../../models/property.model";
import City from "../../models/city.model";

export const getAllCities = async () => {
  return await City.find().sort({ createdAt: -1 });
};

export const createCity = async (data: any) => {
  return await City.create(data);
};

export const updateCity = async (id: string, data: any) => {
  const city = await City.findByIdAndUpdate(id, data, { new: true });
  if (!city) throw new Error("Không tìm thấy thành phố");
  return city;
};

export const deleteCity = async (id: string) => {
  const propertyInUse = await Property.exists({ city_id: id });
  if (propertyInUse) {
    throw new Error("Không thể xóa vì có property thuộc thành phố này");
  }
  await City.findByIdAndDelete(id);
};
