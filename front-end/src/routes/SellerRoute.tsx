import SellerProperties from "../components/seller/SellerProperties";
import SellerPage from "../components/seller/SellerPage";
import PropertyDetails from "../components/seller/PropertiesDetail";

import ListAgent from "../components/seller/ListAgent";
import CreatePropertyPage from "../pages/SellerPage/CreateProperty/CreatePropertyPage";

export const SellerRoute = [
    {
        path: "/seller",
        element: <SellerPage />,
        children: [
            { path: "properties", element: <SellerProperties /> },
            { path: "properties/:id/agents", element: <ListAgent></ListAgent> },
            { index: true, element: <SellerProperties /> },
            { path: "properties/:id", element: <PropertyDetails /> },
            { path: "create", element: <CreatePropertyPage /> }
        ],
    },
];