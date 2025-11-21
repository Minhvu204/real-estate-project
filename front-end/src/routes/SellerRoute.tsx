import SellerProperties from "../components/seller/SellerProperties";
import PropertyDetails from "../components/seller/PropertiesDetail";

import ListAgent from "../components/seller/ListAgent";
import CreatePropertyPage from "../pages/SellerPage/CreateProperty/CreatePropertyPage";
import MyPropertiesPage from "../pages/MyPropertiesPage";
import DealListPageSeller from "../pages/DealContract/DealListPageSeller";
import DealContractPageSeller from "../pages/DealContract/DealContractPageSeller";
export const SellerRoute = [

    {
        path: "/seller/properties", element: <SellerProperties />
    },
    {
        path: "/seller/properties/:id/agents", element: <ListAgent />
    },
    {
        path: "/seller/properties/:id", element: <PropertyDetails />
    },
    {
        path: "/seller/create", element: <CreatePropertyPage />
    },
    {
        path: "/seller/my-properties", element: <MyPropertiesPage />
    },
    {
        path: "/seller/my-properties/:id", element: <MyPropertiesPage />
    },
    {
        path: "/seller/deals/list", element: <DealListPageSeller />
    },
    {
        path: "/seller/contracts/deals/:dealId", element: <DealContractPageSeller />
    }
];
