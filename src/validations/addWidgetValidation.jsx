import * as Yup from "yup";







export const addWidgetValidation = Yup.object({


  
  
  title: Yup.string().required("Please enter title"),
  placement_id: Yup.string().required("Please select position"),
  widget_type: Yup.string().required("Please select widget type"),
  items: Yup.array().when('widget_type', {
    is: (widgetType) => widgetType ? true: false, 
    then:  () =>  Yup.array()
      .min(1, "At least one item is required")
      .required("At least one item is required"),
      otherwise: () =>Yup.array().of(
        Yup.object().shape({
          brand: Yup.string().required("Please select brand"),
        })
      )
  },
 
)
 
   
  
});
