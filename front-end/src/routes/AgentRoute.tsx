// Agent routes - có thể mở rộng thêm các route cho agent sau
// Ví dụ: assignments, properties, profile, etc.

import AsssignAgent from "../components/agent/AsssignAgent";

export const AgentRoute = [
    {
        path: "/agent/assignments", element: <AsssignAgent />
    },

];

