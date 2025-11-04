// src/services/taxonomy.service.ts
import City from "../models/city.model";
import PropertyType from "../models/propertyType.model";
import Feature from "../models/feature.model";
import Category from "../models/category.model";

export const taxonomyService = {
  async getAll() {
    const [cities, propertyTypes, categories, features] = await Promise.all([
      City.find({}, "city_name").sort({ city_name: 1 }),
      PropertyType.find({}, "type_name").sort({ type_name: 1 }),
      Category.find({}, "category_name").sort({ category_name: 1 }),
      Feature.find({}, "feature_name").sort({ feature_name: 1 }),
    ]);

    return {
      cities,
      propertyTypes,
      categories,
      features,
    };
  },
};
