import PropertyDetail from "../pages/PropertyDetail";
import { createBrowserRouter } from "react-router-dom";

export const PropertyDetailRoute = [{
    path: "/property/detail/:id",
    element: <PropertyDetail />
},
];

