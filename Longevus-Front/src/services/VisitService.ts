import axios from "axios";
import { useState, useEffect } from "react";

const URL_BASE = 'http://localhost:8080/visit';

interface Resident {
    id: number,
    name: string,
    numberRoom: number,
}
export interface VisitPayload {
    name: string;
    visitDate: string;        
    visitHour: string;           
    phoneNumber: string;
    email: string;      
    relationship: string;       
    resident: {               
        id: number;
    };
}
export const getResidents = async (): Promise<Resident[]> => {
    try{
        const response = await axios.get<Resident[]>('http://localhost:8080/residents')
        return response.data
    }catch(error){
        console.error(`Error al obtener residentes`, error);
        throw error;
    }
}

export const addVisit = async (visitData: VisitPayload): Promise<string> => {
    try {
        const response = await axios.post<string>(`${URL_BASE}/addVisit`, visitData);
        return response.data; 
    } catch (error) {
        console.error(`Error al agendar la visita: `, error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data || "Error desconocido del servidor al agendar visita");
        }
        throw new Error("No se pudo conectar con el servidor para agendar la visita.");
    }
}


