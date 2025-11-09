import SellerProperties from "../components/seller/SellerProperties";
import SellerPage from "../components/seller/SellerPage";
import PropertiesDetails from "../components/seller/PropertiesDetails";
import SellerDashboard from "../components/seller/SellerDashboard";
import CreatePropertyPage from "../pages/SellerPage/CreateProperty/CreatePropertyPage";
import MyPropertiesPage from "../pages/MyPropertiesPage";


export const SellerRoute = [
    {
        path: "/seller",
        children: [
            { path: "properties", element: <SellerProperties /> },
            { path: "dashboard", element: <SellerDashboard /> },
            { index: true, element: <SellerProperties /> },
            { path: "properties/:id", element: <PropertiesDetails /> },
            { path: "create", element: <CreatePropertyPage /> },
            { path: "my-properties", element: <MyPropertiesPage /> },
            { path: "my-properties/:id", element: <MyPropertiesPage /> }
        ],

    },
];