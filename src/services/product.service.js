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


const ProductService = {
    getProducts,
    getProduct
}
export default ProductService;