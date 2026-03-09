import Axios from "./axios";

export const registerUser = (data) => Axios.post("/v1/auth/register", data);

export const loginUser = (data) => Axios.post("/v1/auth/login", data);

export const logoutUser = () => Axios.post("/v1/auth/logout");