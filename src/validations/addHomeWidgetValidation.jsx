import * as Yup from 'yup'

export const addHomeWidgetValidation = Yup.object({
    placement_id: Yup.string().required("Please select position"),
     
    
})