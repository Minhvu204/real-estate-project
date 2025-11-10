import SellerProperties from "../components/seller/SellerProperties";
import SellerPage from "../components/seller/SellerPage";
<<<<<<<<< Temporary merge branch 1
import PropertiesDetails from "../components/seller/PropertiesDetails";
import SellerDashboard from "../components/seller/SellerDashboard";
import ListAgent from "../components/seller/ListAgent";
import CreatePropertyPage from "../pages/SellerPage/CreateProperty/CreatePropertyPage";
=========
import PropertyDetails from "../components/seller/PropertiesDetail";
>>>>>>>>> Temporary merge branch 2


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
    }

        path: "/seller",
        children: [
            { path: "properties", element: <SellerProperties /> },
            { path: "dashboard", element: <SellerDashboard /> },
            { path: "properties/:id/agents", element: <ListAgent></ListAgent> },
            { index: true, element: <SellerProperties /> },
            { path: "properties/:id", element: <PropertiesDetail /> },
            { path: "create", element: <CreatePropertyPage /> },
            { path: "my-properties", element: <MyPropertiesPage /> },
            { path: "my-properties/:id", element: <MyPropertiesPage /> }
        ],
    },
];