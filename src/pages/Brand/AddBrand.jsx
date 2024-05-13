import React from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { addBrandValidation } from "../../validations/addBrandValidation";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addBrand } from "../../features/brand/brandSlice";
import { IoMdClose } from "react-icons/io";
const AddBrand = () => {
  const [loading, setLoading] = useState(false);
  const [error, seError] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    description: "",
    logo: "",
    website: "",
    images: [],
    labels: [],
    slide_show: [],
  };

  const handleSubmit = async (values) => {
    // console.log(values);
    const res = await dispatch(addBrand(values)).unwrap();
    if (res) {
      toast.success("Brand created successfully!");
      navigate("/brand");
    }
  };

  const goBack = () => {
    window.history.back();
  };
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer" onClick={goBack}/>
          <h2 className="heading">Add Brands</h2>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={addBrandValidation}
          onSubmit={(values) => {
            console.log(values);
            handleSubmit(values);
          }}
        >
          {({ values, errors, setFieldValue }) => (
            <Form>
              <div className="card">
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Brand Name
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
                      htmlFor="website"
                      className="form-label"
                    >
                      Website
                    </label>
                    <Field
                      type="website"
                      className="form-control"
                      id="website"
                      name="website"
                    ></Field>
                    {errors.website && (
                      <small className="text-danger">
                        {errors.website}
                      </small>
                    )}
                  </div>



                  {/* <button
                                  className="btn  w-100 py-8 fs-4 mb-4 rounded-2 mt-4"
                                  type="submit"
                                  style={{ backgroundColor: '#D93D6E',color:"white" }}
                                >
                                  {loading ? "Loading..." : "Create Brand"}
                                </button> */}
                  {
                    // error && (
                    //     <div className='alert alert-danger' role='alert'>{error}</div>
                    // )
                  }
                </div>

              </div>

              <div className="card" >
                <div className="card-body">
                <div  style={{display:"flex",gap:"40px",marginTop:"10px"}}>
                  <div className="mb-4">
                    <label htmlFor="logo" className="form-label">
                      Logo
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="logo"
                      name="logo"
                      onChange={(event) => {
                        // Set the uploaded file to Formik state
                        setFieldValue(
                          "logo",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    {errors.logo && (
                      <small className="text-danger">
                        {errors.logo}
                      </small>
                    )}
                  </div>

     <div className="LogoImage" >
     {values.logo instanceof File && 
     
     <div >

  
     <img  src={URL.createObjectURL(values.logo)} height="100px"/>
     </div>
     }
     </div>  
     </div>
                  <div >
                    <h4>Upload Images</h4>
                    <FieldArray name="images" >
                      {({ push, remove }) => (
                        <div>
                          {values.images.map((image, index) => (
                            <div key={index} style={{ display: "flex", gap: "30vh" }}>
                              <div className="mb-1">


                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(event) => {
                                    const file =
                                      event.currentTarget.files[0];
                                    setFieldValue(
                                      `images[${index}]`,
                                      file
                                    );
                                  }}
                                />
                              </div>
                              <div style={{ marginBottom: '1rem' }}>
                                <label htmlFor="label" style={{ fontWeight: "bold", marginBottom: '0.5rem', marginRight: "10px" }}>
                                  Label:
                                </label>
                                <Field
                                  as="select"
                                  id="label"
                                  name={`labels.${index}`}
                                  placeholder="Select label"
                                  //   className="form-select"
                                  style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                                >
                                  <option value="">
                                    Select Label
                                  </option>
                                  <option value="banner">
                                    Banner
                                  </option>
                                  <option value="hero">
                                    Hero Image
                                  </option>
                                  {/* Add more options as needed */}
                                </Field>
                                <ErrorMessage
                                  name="label"
                                  component="div"
                                />
                              </div>
                              <ErrorMessage
                                name={`images[${index}]`}
                                component="div"
                              />
                              {/* <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => remove(index)}
                                          >
                                            Remove
                                          </button> */}
                              <IoMdClose size={32} color="#D93D6E" onClick={() => remove(index)} cursor="pointer" />
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-sm  mt-2"
                            onClick={() => push({ label: '', file: null })}
                            style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E" }}
                          >
                            Add Image
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>



                </div>
              </div>


              <div className="card">
                <div className="card-body">
                  <div className="mb-4">
                    <label htmlFor="slide_show" className="form-label">
                      Slideshow image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="slide_show"
                      name="slide_show"
                      onChange={(event) => {

                        const selectedFiles = [];


                        for (let i = 0; i < event.currentTarget.files.length; i++) {


                          values.slide_show.push(event.currentTarget.files[i])

                        }


                        setFieldValue('slide_show',  values.slide_show);
                        console.log(values.slide_show)


                      }}
                    />
                    {errors.logo && (
                      <small className="text-danger">
                        {errors.logo}
                      </small>
                    )}
                  </div>


                  <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>

                   
{values.slide_show.map((file, index) => (
            <div key={index} className="col-md-3 mb-2" >
            {typeof image !== "string"&&<img src={URL.createObjectURL(file)} height="150px" />}
            </div>
        ))}
        </div>
                </div>

              </div>


              <button
                className="btn  w-100 py-8 fs-4 mb-4 rounded-2 mt-4"
                type="submit"
                style={{ backgroundColor: '#D93D6E', color: "white" }}
              >
                {loading ? "Loading..." : "Create Brand"}
              </button>
            </Form>
          )}
        </Formik>

      </div>
    </Layout>
  );
};

export default AddBrand;
