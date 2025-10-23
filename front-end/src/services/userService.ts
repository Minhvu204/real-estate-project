import type { User } from "../types/Users";

import { httpAdmin } from "../utils/httpAdmin";
const RESOURCE = "/users";

export const getAllUsers = async (): Promise<User[]> => {
    const res = await httpAdmin.get(RESOURCE);
    return res.data.data.results;
}