import axiosInstance from "../utils/axiosInstance";

 const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/`;

const getCategories = async () => {
    const res = await axiosInstance.get(API_URL + "categories")

    return res.data;

}

const getCategory = async (id) => {
    const res =await axiosInstance.get(API_URL + "categories/" + id)
    return res.data;
}

const saveCategory = async(data) => {
    try {
        console.log(data)
        const res = await axiosInstance.post(API_URL+ "categories",data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}
const updateCategory = async(id,updatedData) => {
    try {
        // console.log(data)
        const res = await axiosInstance.patch(API_URL+ "categories/" + id ,updatedData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}

const deleteCategoryById = async(id) => {
    try {
        // console.log(data)
        const res = await axiosInstance.delete(API_URL+ "categories/" + id );
        return res.data
    }  catch (err) {
        console.log(err)
    }
   
}

const CategoryService = {
    getCategories,
    getCategory,
    saveCategory,
    updateCategory,
    deleteCategoryById
}

export default CategoryService;