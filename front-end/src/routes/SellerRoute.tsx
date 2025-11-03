import SellerProperties from "../components/seller/SellerProperties";
import SellerPage from "../components/seller/SellerPage";
import PropertiesDetails from "../components/seller/PropertiesDetails";


export const SellerRoute = [
    {
        path: "/seller",
        element: <SellerPage />,
        children: [
            { path: "properties", element: <SellerProperties /> },

            { index: true, element: <SellerProperties /> },
            { path: "properties/:id", element: <PropertiesDetails /> }
        ],

    },
];