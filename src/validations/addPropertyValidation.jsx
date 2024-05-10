import * as Yup from 'yup'

export const addPropertyValidation = Yup.object({
    name: Yup.string().required("Please enter property name"),
    unit: Yup.string(),
    options: Yup.string().required("Please enter options"),
   
   
    
})