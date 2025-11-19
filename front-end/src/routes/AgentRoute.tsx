import AsssignAgent from "@/components/agent/AsssignAgent";
import MyPropertiesPage from "../pages/MyPropertiesPage";

export const AgentRoute = [
    {
        path: "/agent",
        children: [
            { path: "my-properties", element: <MyPropertiesPage /> },
            { path: "my-properties/:id", element: <MyPropertiesPage /> },
            {path: "assignments", element: <AsssignAgent /> }
        ],
    },
];

