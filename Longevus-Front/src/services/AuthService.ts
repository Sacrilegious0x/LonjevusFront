import axios from "axios";

const URL_BASE = "http://localhost:8080/api/auth";

export interface ILoginCredentials {
    email: string;
    password: string;
}

interface ILoginResponse {
    jwt: string;
    email: string;
    authorities: string[];
}

export const login = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
    try {
        const response = await axios.post<ILoginResponse>(`${URL_BASE}/login`, credentials);
        const token = response.data.jwt;
        const authorities = response.data.authorities;
        if (token && authorities) {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('userAuthorities', JSON.stringify(authorities));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return response.data;   
        
    } catch (error) {
        console.log('ERROR AL INTENTEAR HACER LOGIN' , error);
        throw error;
        
    }
}

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userAuthorities');
    delete axios.defaults.headers.common['Authorization'];
};