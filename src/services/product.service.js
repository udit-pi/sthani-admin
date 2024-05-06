import axiosInstance from "../utils/axiosInstance";


 const API_URL = "http://localhost:3500/admin/";
//  const STORE_URL = "http://localhost:3500/store/"

// const API_URL = "http://165.22.222.184/api/admin/";
// const STORE_URL = "http://165.22.222.184/api/store/";

// const API_URL = "https://64.227.162.145/api/admin/";
// const STORE_URL = "https://64.227.162.145/api/store/";


// const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/`;
const STORE_URL = `${process.env.REACT_APP_API_URL}/api/store/`;


const getProducts = async () => {
    const res = await axiosInstance.get(STORE_URL + "products/getProducts")

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