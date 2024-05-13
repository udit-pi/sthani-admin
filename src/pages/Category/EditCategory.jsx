import React, { useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useHistory } from 'react-router-dom'
import { Formik, Form, Field } from "formik";
import { editCategoryValidation } from "../../validations/editCategoryValidation";
import { addCategory, editCategory, fetchAllCategories, fetchCategoryById } from "../../features/category/categorySlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MultiSelectDropdown from "../../components/MultiSelectDropDown";
import { FaArrowLeft } from "react-icons/fa";
import Box from '@mui/material/Box';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const EditCategory = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [error, seError] = useState([]);
  const [category, setCategory] = useState({})
  const { id } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false)
const[Allcategory,setAllcategory]=useState([])

const[catOption,setcatOption]=useState([])

const[defaultValue,setdefaultValue]=useState(null)
  console.log(dataLoaded)
  const mediaFolder = process.env.REACT_APP_MEDIA_URL;

console.log(id)
  console.log(category.parent_category)
  console.log(Allcategory)

  //image usestate

  const [bannerImage, setbannerImage] = useState("")
  const [icon, seticon] = useState("")



  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initialValues = {
    name: "",
    // code: "",
    banner: " ",
    // meta_title: "",
    description: "",
    icon: "",
    slide_show: [],
    parent_category:""
  };

    const imageUrlBanner = `${process.env.REACT_APP_MEDIA_URL}/${category.banner}`;
    
    const imageUrlIcon = `${process.env.REACT_APP_MEDIA_URL}/${category.icon}`;
    const url = `${process.env.REACT_APP_MEDIA_URL}`
  //  const imageUrlBanner = 'http://localhost:3500/api/uploads/' + category.banner;
  //  const  imageUrlIcon  = `http://localhost:3500/api/uploads/${category.icon}`;
  //  const  url  = `http://localhost:3500/api/uploads/api/uploads/`;
  // const imageUrlIcon = 'http://localhost:3500/uploads/' + category.icon;

  // const url = 'http://localhost:3500/uploads/'



 // const imageUrlBanner = mediaFolder+category.banner;
 // const imageUrlIcon = mediaFolder+category.icon;
 // const url = mediaFolder;


  const fetchCategory = async () => {

    const res = await dispatch(fetchCategoryById({ id })).unwrap()
      .then(res => {
        console.log("then", res)

        setCategory(res);
        setdefaultValue(res.parent_category)
        setDataLoaded(true)
        initialValues.name = res.name
        initialValues.description = res.description
        initialValues.icon = res.icon
        initialValues.banner = res.banner
        initialValues.slide_show = res.slide_show
        initialValues.parent_category = res.parent_category

      })
      .catch(err => {
        console.log(err)
      });

      const resAll = await dispatch(fetchAllCategories()).unwrap();

setAllcategory(resAll)

  };

console.log( defaultValue)
  // const imageUrl = 'http://165.22.222.184/api/uploads/' + category.banner;

    useEffect(() => {


        fetchCategory();

   }, [dispatch]);


  useEffect(() => {
    setbannerImage(imageUrlBanner)
    seticon(imageUrlIcon)
  }, [category])

  const handleSubmit = async (values) => {
    console.log(values);
    const res = await dispatch(editCategory({ "id": id, "updateData": values })).unwrap();
    if (res) {
      toast.success('Category updated successfully!')
      navigate('/category')
    }
  }


  const catOptions = [];
useEffect(()=>{
  const index =Allcategory.findIndex(category => category.id === id);

  

  // Return a new array without the category with the matching ID
  const newArray= Allcategory.filter((category, i) => i !== index);
  newArray?.map((cat) => {
    catOptions.push({ label: cat.name, value: cat.id });
  });
  setcatOption(catOptions)
},[Allcategory])

console.log(catOption)

  const goBack = () => {
    window.history.back();
  };

console.log(category.parent_category)

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">

        <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer" onClick={goBack} />
          <h2 className="heading">Edit Category</h2>
        </div>

  <Formik
          initialValues={category}
          validationSchema={editCategoryValidation}
          enableReinitialize={true}
          onSubmit={(values) => {
            console.log(values)
            handleSubmit(values)
          }}




        >
          {({ values, errors, setFieldValue }) => (
         
       
              <Form>
                <div className="card">
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Category Name
                      </label>
                      <Field
                        type="name"
                        className="form-control"
                        id="name"
                        name="name"

                        aria-describedby="nameHelp"
                      ></Field>
                      {errors.name && (
                        <small className="text-danger">
                          {errors.name}
                        </small>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="form-label"
                      >
                        Description
                      </label>
                      <Field
                        as="textarea"
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                      ></Field>
                      {errors.description && (
                        <small className="text-danger">
                          {errors.description}
                        </small>
                      )}
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="category"
                        className="form-label"
                      >
                        Parent category:
                      </label>
                      {/* <MultiSelectDropdown
                        name="Parent category"
                      // options={catOption}
                      /> */}

<Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
  
       <Select
          labelId="demo-simple-select-label"
          id="parent_category"
          name="parent_category"
        defaultOpen={category.parent_category}
        value={defaultValue}
      onChange={(event) => {
 setdefaultValue(event.target.value)
setFieldValue("parent_category",event.target.value)


 }}
    >
        
          {Allcategory.map((option) => (


       option.id!=id&& <MenuItem key={option.id.toString()} value={option.id}>{option.name}</MenuItem>
        
      
          ))}

    
        </Select>
   
      </FormControl>
    </Box>







                      {errors.category && (
                        <small className="text-danger">
                          {errors.category}
                        </small>
                      )}

                    </div>




                    {
                      // error && (
                      //     <div className='alert alert-danger' role='alert'>{error}</div>
                      // )
                    }
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">

                  <div style={{display:"flex",gap:"40px"}}>

                    <div className="mb-4">
                      <label
                        htmlFor="banner"
                        className="form-label"
                      >
                        Banner
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="banner"
                        name="banner"
                        onChange={(event) => {
                          // Set the uploaded file to Formik state
                          setFieldValue(
                            "banner",
                            event.currentTarget.files[0]
                          );
                          setbannerImage("")

                        }}
                      />
                      {errors.banner && (
                        <small className="text-danger">
                          {errors.banner}
                        </small>
                      )}
                    </div>

                    { category.banner&&bannerImage && <div className="mb-2">

                    <img src={bannerImage} height="150px" />

                  </div>}

                  {values.banner && values.banner instanceof File && <div>

                    <img src={URL.createObjectURL(values.banner)} height="150px" />

                  </div>}

</div>
          <div style={{display:"flex",gap:"40px",marginTop:"30px"}}>

     
                    <div className="mb-4">
                      <label
                        htmlFor="icon"
                        className="form-label"
                      >
                        Icon image
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="icon"
                        name="icon"
                        onChange={(event) => {
                          // Set the uploaded file to Formik state
                          setFieldValue(
                            "icon",
                            event.currentTarget.files[0]
                          );
                          seticon("")
                        }}
                      />
                      {errors.icon && (
                        <small className="text-danger">
                          {errors.icon}
                        </small>
                      )}
                    </div>

                    {category.icon&&icon && <div className="mb-2">

                    <img src={icon} height="150px" />

                  </div>}

                  {values.icon && values.icon instanceof File && <div>

                    <img src={URL.createObjectURL(values.icon)} height="150px" />

                  </div>}

                  </div>


                  </div>
                </div>

                <div className="card">
                  <div className="card-body">



                    <div className="mb-4">
                      <label
                        htmlFor="slide_show"
                        className="form-label"
                      >
                        Slideshow images
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="slide_show"
                        multiple
                        name="slide_show"
                        // onChange={(event) => {

                        //   const selectedFiles = [];


                        //   for (let i = 0; i < event.currentTarget.files.length; i++) {


                        //     values.slide_show.push(event.currentTarget.files[i])

                        //   }



                        //   console.log(values.slide_show)


                        // }}

                        // onChange={(event) => {

                        //   const newFiles = Array.from(event.currentTarget.files);
                        //   values.slide_show = values.slide_show ? values.slide_show.concat(newFiles) : newFiles;

                        //   console.log(values.slide_show);
                        // }}

                        onChange={(event) => {
  const newFiles = Array.from(event.currentTarget.files);
  // Create a new object with the updated 'slide_show' property
  const updatedValues = {
    ...values, // Spread the existing values
    slide_show: values.slide_show ? values.slide_show.concat(newFiles) : newFiles,
  };
  // Update 'values' using Formik's setValues function
  setFieldValue('slide_show', updatedValues.slide_show);
  
}}
                      />
                      {errors.banner && (
                        <small className="text-danger">
                          {errors.banner}
                        </small>
                      )}
                    </div>

                   { <div style={{ display: "flex", gap: "20px",flexWrap:"wrap" }}>


                    { values.slide_show&& values.slide_show.map((image,index) => (
                      
                      <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                      

                       
                       {typeof image === "string"&&<img src={url + image} height="150px" />}
                    
                       




                       {typeof image === "string"&&<button
                          type="button"
                          className="btn btn-sm  mt-2"
                          onClick={() => {
                        setFieldValue('slide_show', values.slide_show.filter((_, i) => i !== index));
                        console.log(values.slide_show)
                      }}
                          style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E" }}
                        >
                          Remove Image
                        </button>}
                      </div>
                   
                    ))}





                    { values.slide_show&& values.slide_show.map((image,index) => (
                      
                      <div style={{display:"flex",flexDirection:"column",gap:"10px",flexWrap:"wrap"}}>
                      

                       
                       {typeof image !== "string"&&<img src={URL.createObjectURL(image)} height="150px" />}
                    
                       




                       {typeof image !== "string"&&<button
                          type="button"
                          className="btn btn-sm  mt-2"
                          onClick={() => {
                        setFieldValue('slide_show', values.slide_show.filter((_, i) => i !== index));
                        console.log(values.slide_show)
                      }}
                          style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E" }}
                        >
                          Remove Image
                        </button>}
                      </div>
                   
                    ))}


                  </div>}



                  </div>
                </div>

                <button
                  className="btn  w-100 py-8 fs-4 mb-4 rounded-2"
                  type="submit"
                  style={{ backgroundColor: '#D93D6E', color: "white" }}
                >
                  {loading ? "Loading..." : "Update Category"}
                </button>
              </Form>
            
          )}
        </Formik>

      </div>
    </Layout>
  );
};

export default EditCategory;
