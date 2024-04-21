import axiosInstance from "../utils/axiosInstance";


const API_URL = "http://localhost:3500/admin/";


const getProducts = async () => {
    const res = await axiosInstance.get(API_URL + "products")

    return res.data;

}

const getProduct = async (id) => {
    const res =await axiosInstance.get(API_URL + "products/" + id)
    return res.data;
}

const saveProduct = async(data) => {
    try {
        // console.log(data.values)
        const res = await axiosInstance.post(API_URL+ "products",data.values, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}
const updateProduct = async(id,updatedValues) => {
    try {
         console.log(updatedValues)
        const res = await axiosInstance.patch(API_URL+ "products/" + id,updatedValues, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}


const ProductService = {
    getProducts,
    getProduct,
    saveProduct,
    updateProduct
}
export default ProductService;