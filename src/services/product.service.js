import axiosInstance from "../utils/axiosInstance";


//   const API_URL = "http://localhost:3500/api/admin/";
//   const STORE_URL = "http://localhost:3500/api/store/"

// const API_URL = "http://165.22.222.184/api/admin/";
// const STORE_URL = "http://165.22.222.184/api/store/";

// const API_URL = "https://64.227.162.145/api/admin/";
// const STORE_URL = "https://64.227.162.145/api/store/";


const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/`;
const STORE_URL = `${process.env.REACT_APP_API_URL}/api/store/`;


const getProducts = async () => {
    const res = await axiosInstance.get(API_URL + "products")

    return res.data;

}

const getProduct = async (id) => {
    const res =await axiosInstance.get(API_URL + "products/" + id)
    return res.data;
}

const saveProduct = async (data) => {
    try {
        //console.log("in updateProduct service file")
        //console.log(data)
        const res = await axiosInstance.post(API_URL + "products", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data
    } catch (err) {
        console.log(err)
    }

}
const updateProduct = async (id, updatedValues) => {
    try {
       // console.log("in updateProduct service file")
       // console.log(updatedValues)
        const res = await axiosInstance.patch(API_URL + "products/" + id, updatedValues, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data
    } catch (err) {
        console.log(err)
    }

}

const deleteProduct = async (id) => {
    try {
      //  console.log("Attempting to delete product with ID:", id);
        const res = await axiosInstance.delete(API_URL + "products/" + id);
       // console.log("Product deleted successfully:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error deleting product:", err);
        throw err; // Re-throwing the error is important if you want to handle it (e.g., show a user message) at a higher level in your application.
    }
}



const ProductService = {
    getProducts,
    getProduct,
    saveProduct,
    updateProduct,
    deleteProduct
}
export default ProductService;