import React from "react";
import MyPropertiesPage from "../pages/MyPropertiesPage";
import AssignAgentPage from "@/components/agent/AsssignAgent";
import AgentListAppointment from "@/components/agent/AgentAppointment";

export const AgentRoute = [
    {
        path: "/agent",
        children: [
            { path: "my-properties", element: <MyPropertiesPage /> },
            { path: "my-properties/:id", element: <MyPropertiesPage /> },
            { path: "assignments", element: <AssignAgentPage /> },
            { path: "appointments", element: <AgentListAppointment /> }
        ],
    },
];

