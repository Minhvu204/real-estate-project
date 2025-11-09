import SearchPage from "../pages/SearchPage/SearchPage";
import BuyPage from "../pages/SearchPage/BuyPage";
import RentPage from "../pages/SearchPage/RentPage";
import { ProfileLayout } from "../pages/Profile/ProfileLayout";
import { PersonalInfo } from "../pages/Profile/PersonalInfo";
import { ChangePassword } from "../pages/Profile/ChangePassword";
import PropertyDetails from "../components/seller/PropertiesDetail";
import ChatPage from "@/pages/Chat/ChatPage";

export const BuyerRoute = [
    {
        path: "/buy",
        element: <BuyPage />
    },
    {
        path: "/rent",
        element: <RentPage />
    },
    {
        path: "/search",
        element: <SearchPage />
    },
    {
        path: "/property/detail/:id",
        element: <PropertyDetails />
    },
    {
        path: "/profile",
        element: <ProfileLayout />,
        children: [
            {
                index: true,
                element: <PersonalInfo />,
            },
            {
                path: "info",
                element: <PersonalInfo />,
            },
            {
                path: "change-password",
                element: <ChangePassword />,
            },
        ],
    },
    {
        path: "/chat",
        element: <ChatPage />,
        children: [
            
        ]
    },

];

