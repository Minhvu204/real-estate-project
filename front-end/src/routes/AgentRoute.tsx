import MyPropertiesPage from "../pages/MyPropertiesPage";
import OfferDetailPage from "../pages/Offer/OfferDetailPage";
import AgentOfferManagementPage from "../pages/Offer/AgentOfferManagementPage";

export const AgentRoute = [
    {
        path: "/agent",
        children: [
            { path: "my-properties", element: <MyPropertiesPage /> },
            { path: "my-properties/:id", element: <MyPropertiesPage /> },
            { path: "offers", element: <AgentOfferManagementPage /> },
            { path: "offers/:id", element: <OfferDetailPage /> }
        ],
    },
];

