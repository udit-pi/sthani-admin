import React, { useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Formik, Form, Field } from "formik";
import { addCategoryValidation } from "../../validations/addCategoryValidation";
import { addCategory } from "../../features/category/categorySlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import {

  fetchAllCategories, 

} from "../../features/category/categorySlice";

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, seError] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catOption, setCatOption] = useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initialValues = {
    name: "",
    description: " ",
    parent_category: " ",
    banner: " ",
    icon: " ",
    slide_show:[] ,
    tag: ''
  };
  const catOptions = [];
 
  const fetchCategory = async () => {
    const res = await dispatch(fetchAllCategories()).unwrap();
     console.log(res)
    setCategories(res);
    res?.map((cat) => {
      catOptions.push({ label: cat.name, value: cat.id });
    });

    setCatOption(catOptions);

  };

  useEffect(() => {
    fetchCategory();
  }, [dispatch]);

  const handleSubmit = async (values) => {

    console.log(values);
    const res = await dispatch(addCategory(values)).unwrap();
    if (res) {
      toast.success('Category created successfully!')
      navigate('/category')

    }
  }



  const goBack = () => {
    window.history.back();
  };
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer" onClick={goBack} />
          <h2 className="heading"> Add Category</h2>
        </div>
        <div>


          <Formik

            initialValues={initialValues}
            validationSchema={addCategoryValidation}
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
                      <label htmlFor="parent_category" className="form-label">
                        Parent Category:
                      </label>
                      <Field as="select" name="parent_category" id="parent_category" className="form-control"
                        onChange={(event) => {
                          const { value } = event.target;
                          // Explicitly handle the 'None' option by setting the value to null or undefined
                          const realValue = value === "" ? null : value;
                          setFieldValue("parent_category", realValue);
                        }}

                      >
                        <option value="">None</option>
                        {catOption.map((option) => (
                          
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          
                        ))}
                      </Field>
                      {errors.parent_category && (
                        <small className="text-danger">
                          {errors.parent_category}
                        </small>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Category Tag (Visible on Category List)
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="tag"
                        name="tag"
                        aria-describedby="nameHelp"
                      ></Field>
                      {errors.tag && (
                        <small className="text-danger">
                          {errors.tag}
                        </small>
                      )}
                    </div>

                    <div className="mb-4">
                    

                    <Field
                      type="checkbox"
                      className="form-check-input"
                      id="is_featured"
                      name="is_featured"
                    ></Field>
                    <label
                      htmlFor="is_featured"
                      className="form-check-label ms-1"
                    >
                      Show in Collection List
                    </label>
                    {errors.is_featured && (
                      <small className="text-danger">
                        {errors.is_featured}
                      </small>
                    )}
                  </div>





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
                          console.log(values.banner)
                        }}
                      />
                      {errors.banner && (
                        <small className="text-danger">
                          {errors.banner}
                        </small>
                      )}
                    </div>

                    <div className="BannerImage">
     {values.banner instanceof File && 
     
     <div >

  
     <img  src={URL.createObjectURL(values.banner)} height="100px"/>
     </div>
     }
     </div>             
</div>
                  <div  style={{display:"flex",gap:"40px",marginTop:"30px"}}>
                 
                    <div className="mb-4" >
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
                        }}
                      />
                      {errors.banner && (
                        <small className="text-danger">
                          {errors.banner}
                        </small>
                      )}
                      </div>




                 
  <div className="iconImage" >
     {values.icon instanceof File && 
     
     <div >

  
     <img  src={URL.createObjectURL(values.icon)} height="100px"/>
     </div>
     }
     </div>  


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
                        name="slide_show"
                        multiple
                        onChange={(event) => {
    
    const selectedFiles = [];
   
   
    for (let i = 0; i < event.currentTarget.files.length; i++) {
     
     
      values.slide_show.push(event.currentTarget.files[i])
     
    }
    
    setFieldValue('slide_show',  values.slide_show);

console.log(values.slide_show)


  }}
                      />


                      {errors.banner && (
                        <small className="text-danger">
                          {errors.banner}
                        </small>
                      )}
                    </div>
                    <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>

                   
                    {values.slide_show.map((file, index) => (
                                <div key={index} className="col-md-3 mb-2" style={{display:"flex",flexDirection:"column",gap:"10px"}} >
                                {typeof image !== "string"&&<img src={URL.createObjectURL(file)} height="150px" />}



                                {typeof file !== "string"&&<button
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
                            </div>
                  </div>
                </div>

               
              
                       
                 
                        
                   
               
        


                <button
                  className="btn  w-100 py-8 fs-4 mb-4 rounded-2"
                  type="submit"
                  style={{ backgroundColor: '#D93D6E', color: "white" }}

                >
                  {loading ? "Loading..." : "Create Category"}
                </button>
              </Form>


            )}

          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
