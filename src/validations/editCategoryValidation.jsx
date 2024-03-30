import * as Yup from 'yup'

export const editCategoryValidation = Yup.object({
    name: Yup.string().required("Please enter category name"),
    code: Yup.string().required("Please enter code"),
    banner:  Yup.mixed()
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