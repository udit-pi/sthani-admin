import * as Yup from 'yup'

export const addBrandValidation = Yup.object({
    name: Yup.string().required("Please enter brand name"),
    description: Yup.string().required("Please enter description"),
    logo:  Yup.mixed()
    // .test(
    //   "fileSize",
    //   "File size too large, max file size is 1 Mb",
    //   (file) => file && file.size <= 1100000
    // )
    // .test(
    //   "fileType",
    //   "Incorrect file type",
    //   (file) =>
    //     file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)
    // ),
    
})