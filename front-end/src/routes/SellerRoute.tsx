import SellerProperties from "../components/seller/SellerProperties";
import SellerPage from "../components/seller/SellerPage";
import PropertiesDetail from "../components/seller/PropertiesDetail";
import SellerDashboard from "../components/seller/SellerDashboard";
import ListAgent from "../components/seller/ListAgent";
import CreatePropertyPage from "../pages/SellerPage/CreateProperty/CreatePropertyPage";
import MyPropertiesPage from "../pages/MyPropertiesPage";


export const SellerRoute = [
    {
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