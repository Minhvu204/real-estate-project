import { httpClient } from "@/utils/httpClient";
import type { Appointment } from "@/types/Appointment";


const RESOURCES = "/buyer";

export const getAllAppoinments = async (): Promise<Appointment[]> => {
    const response = await httpClient.get(`${RESOURCES}/appointments`);
    return response.data.data.data;
}


