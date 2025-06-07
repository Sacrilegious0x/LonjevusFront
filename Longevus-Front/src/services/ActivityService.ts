import axios from "axios";
import type { CaregiverApiResponse } from "./CaregiverService";

const API_BASE_URL = "http://localhost:8080"

export interface Activity{
    id: number,
    name: string,
    description: string,
    type: string,
    date: string,
    startTime: string,
    endTime: string,
    location: string,
    status: string,
    caregiver: CaregiverApiResponse
}

export const getActivitiesByDate = async(date: string): Promise<Activity[]> => {
    try{
        const response = await axios.get(`${API_BASE_URL}/getActivitiesByDate?date=${date}`);
        console.log(response.data)
        return response.data;
    }catch(err){
        console.error("No se obtuvieron actividades", err);
        throw(err);
    }
}