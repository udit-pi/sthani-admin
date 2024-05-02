import axiosInstance from "../utils/axiosInstance";


//  const API_URL = "http://localhost:3500/api/admin/";

// const API_URL = "http://165.22.222.184/api/admin/";
// const API_URL = "https://64.227.162.145/api/admin/";

 const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/`;

const getBrands = async () => {
    const res = await axiosInstance.get(API_URL + "brands")

    return res.data;

}

const saveBrand = async(data) => {
    try {
        // console.log(data)
        const res = await axiosInstance.post(API_URL+ "brands",data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}

const getBrand = async (id) => {
    const res =await axiosInstance.get(API_URL + "brands/" + id)
    return res.data;
}

const updateBrandById = async(id,updatedData) => {
    try {
        //  console.log({updatedData,updatedImages})
        const res = await axiosInstance.patch(API_URL+ "brands/" + id ,updatedData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}

const deleteBrandById = async(id) => {
    try {
        // console.log(data)
        const res = await axiosInstance.delete(API_URL+ "brands/" + id );
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}


const BrandService = {
    getBrands,
    saveBrand,
    getBrand,
    updateBrandById,
    deleteBrandById
   
}

export default BrandService;