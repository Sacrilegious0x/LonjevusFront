import axios from "axios";

export interface Billing {
  id?: number;
  consecutive?: string;
  date: string;
  amount: number;
  period: string;
  paymentMethod: string;
  isActive?: boolean;
  administrator: { id: number };
  resident: { id: number };
}

const BASE_URL = "http://localhost:8080/api/billing";

export const getAllBillings = async (): Promise<Billing[]> => {
  const res = await axios.get(`${BASE_URL}/active`);
  return res.data;
};

export const getBillingById = async (id: number): Promise<Billing> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createBilling = async (billing: Billing): Promise<void> => {
  await axios.post(BASE_URL, billing);
};

export const updateBilling = async (id: number, billing: Billing): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, billing);
};

export const deleteBilling = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const getBillingsByDate = async (date: string): Promise<Billing[]> => {
  const res = await axios.get(`${BASE_URL}/date/${date}`);
  return res.data;
};

export const getBillingsByPeriod = async (period: string): Promise<Billing[]> => {
  const res = await axios.get(`${BASE_URL}/period/${period}`);
  return res.data;
};
