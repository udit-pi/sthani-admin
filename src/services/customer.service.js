import axiosInstance from "../utils/axiosInstance";


// const API_URL = "http://localhost:3500/admin/";

// const API_URL = "http://165.22.222.184/api/admin/";
const API_URL = "http://64.227.162.145/api/admin/";

const getCustomers = async () => {
    const res = await axiosInstance.get(API_URL + "customers")

    return res.data;

}

const CustomerService = {
    getCustomers,
   
   
}

export default CustomerService;