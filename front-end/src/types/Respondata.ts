import type { Meta } from "./Pagination";
import type { Property } from "./Property";

export type PropertyListData = {
    pagination: Meta;
    data: Property[];
};