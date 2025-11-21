import SearchPage from "../pages/SearchPage/SearchPage";
import BuyPage from "../pages/SearchPage/BuyPage";
import RentPage from "../pages/SearchPage/RentPage";
import { ProfileLayout } from "../pages/Profile/ProfileLayout";
import { PersonalInfo } from "../pages/Profile/PersonalInfo";
import { ChangePassword } from "../pages/Profile/ChangePassword";
import ChatPage from "@/pages/Chat/ChatPage";
import PropertyDetailUser from "../pages/PropertyDetail";
import MyPropertiesPage from "../pages/MyPropertiesPage";
import CreateOfferPage from "../pages/Offer/CreateOfferPage";
import OfferHistoryPage from "../pages/Offer/OfferHistoryPage";
import CancelOfferPage from "../pages/Offer/CancelOfferPage";
import BuyerAppointment from "@/components/buyer/Appointment/BuyerAppointment";
import ListAppointment from "@/components/buyer/Appointment/ListAppointment";


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
        element: <PropertyDetailUser />
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
        path: "dwello/my-properties",
        element: <MyPropertiesPage />,
    }, {
        path: "/chat",
        element: <ChatPage />,
        children: [

        ]
    },

    {
        path: "/my-properties",
        element: <MyPropertiesPage />,
    },
    {
        path: "/buyer/offer",
        element: <OfferHistoryPage />,
    },
    {
        path: "/buyer/offer/create/:id",
        element: <CreateOfferPage />,
    },
    {
        path: "/buyer/offer/:id/cancel",
        element: <CancelOfferPage />,
    },
    {
        path: "dwello/appoinments",
        element: <ListAppointment />
    },
];
