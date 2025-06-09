import axios from "axios";
import type { CaregiverApiResponse } from "./CaregiverService";
import type { ResidentData } from "./ResidentService";

const API_BASE_URL = "http://localhost:8080"

export interface Activity {
    id: number,
    name: string,
    description: string,
    type: string,
    date: string,
    startTime: string,
    endTime: string,
    location: string,
    status: string,
    caregiverId: number,
    caregiver?: CaregiverApiResponse
}

export const getActivitiesByDate = async (date: string): Promise<Activity[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getActivitiesByDate?date=${date}`);
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("No se obtuvieron actividades", err);
        throw (err);
    }
}

export const getActivityById = async (id: number): Promise<Activity> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/findActivity?id=${id}`);
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("No se obtuvo la actividad", err);
        throw (err);
    }
}

export const getResidentsByActivityId = async (id: number): Promise<ResidentData[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getResidentsFromActivity?id=${id}`);
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("No se obtuvieron residentes", err)
        throw (err);
    }
}

export const createActivity = async (data: Activity): Promise<void> => {
    const formData = {
        ...data,
        caregiver: {
            id: data.caregiverId
        }
    };

    try {
        await axios.post(`${API_BASE_URL}/addActivity`, formData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error al crear la actividad", error);
        throw error;
    }
};

export const deleteActivity = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/deleteActivity?id=${id}`);
    } catch (error) {
        console.error('Error al eliminar actividad', error);
        throw error;
    }
};


export const updateActivity = async (data: Activity): Promise<Activity> => {
  const formData = {
    ...data,
    caregiver: {
      id: data.caregiverId
    }
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/updateActivity`, formData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la actividad", error);
    throw error;
  }
};

export const deleteResidentFromActivity = async (idActivity: number, idResident: number): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/deleteResidentFromActivity?activityId=${idActivity}&residentId=${idResident}`);
    } catch (error) {
        console.error('Error al eliminar el residente', error);
        throw error;
    }
};


