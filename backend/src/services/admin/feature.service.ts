import Property from "../../models/property.model";
import Feature from "../../models/feature.model";

export const getAllFeatures = async () => {
  return await Feature.find().sort({ createdAt: -1 });
};

export const createFeature = async (data: any) => {
  return await Feature.create(data);
};

export const updateFeature = async (id: string, data: any) => {
  const feature = await Feature.findByIdAndUpdate(id, data, { new: true });
  if (!feature) throw new Error("Không tìm thấy tính năng");
  return feature;
};

export const deleteFeature = async (id: string) => {
  const propertyInUse = await Property.exists({ features: id });
  if (propertyInUse) {
    throw new Error("Không thể xóa vì có property đang sử dụng tính năng này");
  }
  await Feature.findByIdAndDelete(id);
};
