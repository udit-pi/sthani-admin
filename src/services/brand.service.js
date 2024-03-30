import axiosInstance from "../utils/axiosInstance";


const API_URL = "http://localhost:3500/admin/";


const getBrands = async () => {
    const res = await axiosInstance.get(API_URL + "brands")

    return res.data;

}

const saveBrand = async(data) => {
    try {
        console.log(data)
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

const updateBrandById = async(id,updatedData,deletedImages) => {
    try {
        //  console.log({updatedData,updatedImages})
        const res = await axiosInstance.patch(API_URL+ "brands/" + id ,{updatedData,deletedImages}, {
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