import SearchPage from "../pages/SearchPage/SearchPage";
import BuyPage from "../pages/SearchPage/BuyPage";
import RentPage from "../pages/SearchPage/RentPage";
import PropertyDetail from "../pages/PropertyDetail";
import { ProfileLayout } from "../pages/Profile/ProfileLayout";
import { PersonalInfo } from "../pages/Profile/PersonalInfo";
import { ChangePassword } from "../pages/Profile/ChangePassword";
import MyPropertiesPage from "../pages/MyPropertiesPage";
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
        element: <PropertyDetail />
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
    },
    {
        path: "dwello/appoinments",
        element: <ListAppointment />
    }
];
