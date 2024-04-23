import axiosInstance from "../utils/axiosInstance";


const API_URL = "http://localhost:3500/admin/";


const getCustomers = async () => {
    const res = await axiosInstance.get(API_URL + "customers")

    return res.data;

}

const CustomerService = {
    getCustomers,
   
   
}

export default CustomerService;