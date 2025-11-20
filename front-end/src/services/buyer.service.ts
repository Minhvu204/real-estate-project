import { httpClient } from "@/utils/httpClient";
import type { Appointment } from "@/types/Appointment";
import type { AppoinmentDate, } from "@/components/buyer/Appointment/BuyerAppointment";

const RESOURCES = "/buyer";

export const getAllAppoinments = async (): Promise<Appointment[]> => {
    const response = await httpClient.get(`${RESOURCES}/appointments`);
    return response.data.data.data;
}
export const postAppointments = async (time: AppoinmentDate): Promise<String> => {
    const response = await httpClient.post(`${RESOURCES}/appointments`, {
        time
    });
    return response.data;
}


