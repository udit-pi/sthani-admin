import axiosInstance from "../utils/axiosInstance";


//  const API_URL = "http://localhost:3500/api/admin/";

// const API_URL = "http://165.22.222.184/api/admin/";
// const API_URL = "https://64.227.162.145/api/admin/";

 const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/`;

const getProperties = async () => {
    const res = await axiosInstance.get(API_URL + "properties")

    return res.data;

}

const saveProperty = async(data) => {
    try {
        // console.log(data)
        const res = await axiosInstance.post(API_URL+ "properties",data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}

const getProperty = async (id) => {
    const res =await axiosInstance.get(API_URL + "properties/" + id)
    return res.data;
}

const updatePropertyById = async(id,updatedData) => {
    try {
        //  console.log({updatedData,updatedImages})
        const res = await axiosInstance.patch(API_URL+ "properties/" + id ,updatedData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}

const deletePropertyById = async(id) => {
    try {
        // console.log(data)
        const res = await axiosInstance.delete(API_URL+ "properties/" + id );
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}


const PropertyService = {
    getProperties,
    saveProperty,
    getProperty,
    updatePropertyById,
    deletePropertyById
   
}

export default PropertyService;