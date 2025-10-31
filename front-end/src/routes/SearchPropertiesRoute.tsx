import SearchPage from "../pages/searchPage/SearchPage";
import BuyPage from "../pages/searchPage/BuyPage";
import RentPage from "../pages/searchPage/RentPage";

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

