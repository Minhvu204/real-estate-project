import DealContractPage from "../pages/DealContractPage";
import MyPropertiesPage from "../pages/MyPropertiesPage";

export const AgentRoute = [
    {
        path: "/agent",
        children: [
            { path: "my-properties", element: <MyPropertiesPage /> },
            { path: "my-properties/:id", element: <MyPropertiesPage /> },
            { path: "contracts/deals/:dealId", element: <DealContractPage /> }
        ],
    },
];

