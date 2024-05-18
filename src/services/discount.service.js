import axiosInstance from "../utils/axiosInstance";




const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/`;

const getDiscount = async () => {
    const res = await axiosInstance.get(API_URL + "discount")

    return res.data;

}




const getDiscountById = async (id) => {
    const res = await axiosInstance.get(API_URL + "discount/" +id)

    return res.data;

}

const saveDiscount = async(data) => {
    try {
        // console.log(data)
        const res = await axiosInstance.post(API_URL+ "discount",data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}

const deleteDiscountById = async(id) => {
    try {
        // console.log(data)
        const res = await axiosInstance.delete(API_URL+ "discount/" + id );
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}

const updateDiscountById = async(id,updatedData) => {
    try {
        //  console.log({updatedData,updatedImages})
        const res = await axiosInstance.patch(API_URL+ "discount/" + id ,updatedData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}
const CustomerService = {
    getDiscount,
    getDiscountById,
    saveDiscount,
    deleteDiscountById,
    updateDiscountById
   
}

export default CustomerService;