
import * as Yup from 'yup'
const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
export const AddDiscountValidation = Yup.object().shape({
    startDate: Yup.date()
      .min(getTodayDate(), 'Start date cannot be in the past')
      .required('Start date is required'),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'End date cannot be before start date')
      .when('setEndDate', {
        is: true,
        then: Yup.date().required('End date is required when "Set End Date" is checked'),
      }),
 
  });


  export const EditDiscountValidation = Yup.object().shape({
    startDate: Yup.date()
      .required('Start date is required'),
      
 
  });