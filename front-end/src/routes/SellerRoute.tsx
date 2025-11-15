import SellerProperties from "../components/seller/SellerProperties";
import PropertyDetails from "../components/seller/PropertiesDetail";

import ListAgent from "../components/seller/ListAgent";
import CreatePropertyPage from "../pages/SellerPage/CreateProperty/CreatePropertyPage";

export const SellerRoute = [
  {
    path: "/seller/properties",
    element: <SellerProperties />,
  },
  {
    path: "/seller/properties/:id/agents",
    element: <ListAgent />,
  },
  {
    path: "/seller/properties/:id",
    element: <PropertyDetails />,
  },
  {
    path: "notifications/seller/properties/:id",
    element: <PropertyDetails />,
  },
  {
    path: "/seller/create",
    element: <CreatePropertyPage />,
  },
];
