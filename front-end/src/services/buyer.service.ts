import { httpClient } from "@/utils/httpClient";
import type { Appointment } from "@/types/Appointment";
import type { AppoinmentDate, } from "@/components/Buyer/Appointment/BuyerAppointment";

const RESOURCES = "/buyer";

export const getAllAppoinments = async (): Promise<Appointment[]> => {
    const response = await httpClient.get(`${RESOURCES}/appointments`);
    return response.data.data.data;
}
export const postAppointments = async (timeAp: AppoinmentDate): Promise<String> => {
    console.log("Posting appointment with data:", timeAp);
    const response = await httpClient.post(`${RESOURCES}/appointments`, {
        propertyId: timeAp.propertyId,
        location: timeAp.location,
        times: timeAp.times,
    });
    return response.data;
}


