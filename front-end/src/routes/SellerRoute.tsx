import SellerProperties from "../components/seller/SellerProperties";
import SellerPage from "../components/seller/SellerPage";
import PropertiesDetails from "../components/seller/PropertiesDetails";
import SellerDashboard from "../components/seller/SellerDashboard";
import ListAgent from "../components/seller/ListAgent";

export const SellerRoute = [
    {
        path: "/seller",
        element: <SellerPage />,
        children: [
            { path: "properties", element: <SellerProperties /> },
            { path: "dashboard", element: <SellerDashboard /> },
            { path: "properties/:id/agents", element: <ListAgent></ListAgent> },
            { index: true, element: <SellerProperties /> },
            { path: "properties/:id", element: <PropertiesDetails /> }
        ],
    },
];