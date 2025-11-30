import React from "react";
import MyPropertiesPage from "../pages/MyPropertiesPage";
import AssignAgentPage from "@/components/agent/AsssignAgent";
import AgentListAppointment from "@/components/agent/AgentAppointment";
import ListPropertyNoAgent from "@/components/agent/ListPropertyNoAgent";
import PropertyDetailUser from "@/components/agent/PropertyDetail";


export const AgentRoute = [
    {
        path: "/agent",
        children: [
            { path: "properties", element: <ListPropertyNoAgent /> },
            { path: "my-properties", element: <MyPropertiesPage /> },
            { path: "my-properties/:id", element: <MyPropertiesPage /> },
            { path: "assignments", element: <AssignAgentPage /> },
            { path: "appointments", element: <AgentListAppointment /> },
            { path: "properties/:id", element: <PropertyDetailUser /> }
        ],
    },
];

