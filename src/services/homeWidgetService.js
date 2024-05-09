import axiosInstance from "../utils/axiosInstance";


  //  const API_URL = "http://localhost:3500/api/admin/";

// const API_URL = "http://165.22.222.184/api/admin/";
// const API_URL = "https://64.227.162.145/api/admin/";

 const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/`;



const savehomeWidget = async(data) => {
    try {
        
        const res = await axiosInstance.post(API_URL+ "home",data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },});
         return res
    }  catch (err) {
        console.log(err)
    }
   
}

const getAllWidgets = async() => {
  const res = await axiosInstance.get(API_URL + "home")

  return res.data;
}

const getWidget = async (id) => {
  const res =await axiosInstance.get(API_URL + "home/" + id)
  return res.data;
}

const updateWidgetById = async(id,updatedData) => {
  try {
      //  console.log({updatedData,updatedImages})
      const res = await axiosInstance.patch(API_URL+ "home/" + id ,updatedData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },});
      return res.data
  }  catch (err) {
      console.log(err)
  }
 
}

const deleteWidgetById = async(id) => {
  try {
       console.log(id)
      const res = await axiosInstance.delete(API_URL+ "home/" + id );
      return res.data
  }  catch (err) {
      console.log(err)
  }
 
}



const HomeWidgetService = {
    savehomeWidget,
    getAllWidgets,
    getWidget,
    updateWidgetById,
    deleteWidgetById
   
}

export default HomeWidgetService;