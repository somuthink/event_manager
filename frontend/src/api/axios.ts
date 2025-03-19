import axios from "axios";

const baseURL = "/api";

const getAuthorizationHeader = () =>
    `Bearer ${localStorage.getItem("jwtToken")}`;

export const axiosInst = axios.create({
    baseURL,
    headers: { Authorization: getAuthorizationHeader() },
});
