import SellerProperties from "../components/seller/SellerProperties";
import SellerPage from "../components/seller/SellerPage";
import PropertiesDetails from "../components/seller/PropertiesDetails";
import CreatePropertyPage from "../pages/SellerPage/CreateProperty/CreatePropertyPage";


export const SellerRoute = [
    {
        path: "/seller",
        element: <SellerPage />,
        children: [
            { path: "properties", element: <SellerProperties /> },
            { index: true, element: <SellerProperties /> },
            { path: "properties/:id", element: <PropertiesDetails /> },
            { path: "create", element: <CreatePropertyPage /> }
        ],

    },
];