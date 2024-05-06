import React from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Formik, Form, Field } from "formik";
import { addCategoryValidation } from "../../validations/addCategoryValidation";
import { addCategory } from "../../features/category/categorySlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MultiSelectDropdown from "../../components/MultiSelectDropDown";
import { FaArrowLeft } from "react-icons/fa";
const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, seError] = useState([]);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initialValues = {
    name: "",
    description: "",
    parent_category:"animal",
 
    banner: "",
 
    icon:"",
  };

  const handleSubmit = async (values) => {
   
    console.log(values);
    const res = await dispatch(addCategory(values)).unwrap();
    if (res) {
      toast.success('Category created successfully!')
      navigate('/category')

    }
  }
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={30} cursor="pointer" />
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
          {({ errors, setFieldValue}) => (

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
                      htmlFor="parent_category"
                      className="form-label"
                    >
                      Parent category:
                    </label>
                    <MultiSelectDropdown
                      name="parent_category"
                    // options={catOption}
                    />
                    {errors.parent_category && (
                      <small className="text-danger">
                        {errors.parent_category}
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
                      }}
                    />
                    {errors.banner && (
                      <small className="text-danger">
                        {errors.banner}
                      </small>
                    )}
                  </div>

                  <div className="mb-4">
                                  <label
                                    htmlFor="icon"
                                    className="form-label"
                                  >
                                  icon image
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

                </div>
              </div>

<div className="card">
            <div className="card-body">
 
 

                                <div className="mb-4">
                                  <label
                                    htmlFor="banner"
                                    className="form-label"
                                  >
                               Slideshow image 
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
                                    }}
                                  />
                                  {errors.banner && (
                                    <small className="text-danger">
                                      {errors.banner}
                                    </small>
                                  )}
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
