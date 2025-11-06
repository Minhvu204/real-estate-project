import SearchPage from "../pages/SearchPage/SearchPage";
import BuyPage from "../pages/SearchPage/BuyPage";
import RentPage from "../pages/SearchPage/RentPage";

export const SearchPropertiesRoute = [
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
    }
];

