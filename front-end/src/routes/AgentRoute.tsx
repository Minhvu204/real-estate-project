import DealListPageAgent from "../pages/DealListPageAgent";
import DealContractPageAgent from "../pages/DealContractPageAgent";
import MyPropertiesPage from "../pages/MyPropertiesPage";

export const AgentRoute = [
    {
        path: "/agent",
        children: [
            { path: "my-properties", element: <MyPropertiesPage /> },
            { path: "my-properties/:id", element: <MyPropertiesPage /> },
            { path: "contracts/deals/:dealId", element: <DealContractPageAgent /> },
            { path: "deals/list", element: <DealListPageAgent /> }
        ],
    },
];

