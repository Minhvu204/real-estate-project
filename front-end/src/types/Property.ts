export type Property = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  city_id?: {
    _id: string;
    city_name: string;
  };
  type_id?: {
    _id: string;
    type_name: string;
  };
  category_id?: {
    _id: string;
    category_name: string;
  };
  owner_id?: {
    _id: string;
    fullName: string;
    email: string;
  };
  agent_id?: {
    _id: string;
    fullName: string;
    email: string;
  };
  features?: {
    _id: string;
    feature_name: string;
  }[];
  images: string[];
  status: string;
  deleted: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};


export type DetailProperty = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: string;
  images: string[];
  city: {
    _id: string;
    city_name: string;
  };
  category: {
    _id: string;
    category_name: string;
  };
  type: {
    _id: string;
    type_name: string;
  };
  features: {
    _id: string;
    feature_name: string;
  }[];
  owner: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar: string;
  };
  agent: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
};

