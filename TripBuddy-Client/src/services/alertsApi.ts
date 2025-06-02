import { Alert } from "@customTypes/Alert";
import { axiosInstance } from "./axiosConfig";
import { ServerRoutes } from "@enums/serverRoutes";

const getAlerts = async (country:string) => {
    return (await axiosInstance.get<Alert[]>(`/${ServerRoutes.ALERTS}`, { params:{country} })).data;
};

export {getAlerts}