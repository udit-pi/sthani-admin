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
const saveCategory = async (data) => {
    try {
        console.log(data);
        const res = await axiosInstance.post(API_URL + "categories", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (err) {
        console.log("ERROR ------->", err);
        // Check for specific MongoDB error codes and provide a more readable message
        if (err.response && err.response.data && err.response.data.code === "E11000") {
            throw new Error(`Category name already exists.`);
        }
        throw err;
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

const validateCategories = async (formData, shouldImport) => {

    
    const endpoint = shouldImport ? `${API_URL}categories/import` : `${API_URL}categories/validate`;
    try {
      const res = await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
     // console.log("response", res);
      return res.data;
    } catch (err) {
      console.error("Error validating/importing category:", err);
      throw err;
    }
  };

const CategoryService = {
    getCategories,
    getCategory,
    saveCategory,
    updateCategory,
    deleteCategoryById,
    validateCategories

}

export default CategoryService;