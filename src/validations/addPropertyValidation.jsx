import * as Yup from 'yup'

export const addPropertyValidation = Yup.object({
    name: Yup.string().required("Please enter property name"),
    unit: Yup.string().required("Please enter unit"),
    propertyOptions: Yup.string().required("Please enter options"),
   
   
    
})