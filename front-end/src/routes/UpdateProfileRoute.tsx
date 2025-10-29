import { ProfileLayout } from "../pages/Profile/ProfileLayout";
import { PersonalInfo } from "../pages/Profile/PersonalInfo";
import { ChangePassword } from "../pages/Profile/ChangePassword";

export const UpdateProfileRoute = [
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
];
