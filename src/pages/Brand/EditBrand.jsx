import React, { useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { addBrandValidation } from "../../validations/addBrandValidation";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addBrand,
  fetchBrandById,
  getBrand,
  updateBrand,
} from "../../features/brand/brandSlice";
import { IoMdClose } from "react-icons/io";

const EditBrand = () => {
  const [loading, setLoading] = useState(false);
  const [error, seError] = useState([]);
  const brand = useSelector(getBrand);
  const { id } = useParams();
  const [uploadImages, setUploadImages] = useState([])
  const [deletedImages, setDeletedImages] = useState([])

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    description: "",
    logo: "",
    website: "",
    images: [],
    labels: [],
    slide_show: []
  };

  const fetchBrand = async () => {
    const res = await dispatch(fetchBrandById({ id })).unwrap();
    console.log(res)

    setUploadImages(res.images);
    initialValues.name = res.name;
    initialValues.description = res.description;
    initialValues.website = res.website;
     initialValues.images = [];
     initialValues.slide_show=res.slide_show
     

    // setFilteredCategories(res);
  };

  //  const imageBaseUrl = "http://localhost:3500/uploads/";
  // const imageBaseUrl = "http://165.22.222.184/api/uploads/";
  // const imageBaseUrl = "https://64.227.162.145/api/uploads/";
  
  const imageBaseUrl = `${process.env.REACT_APP_API_URL}/api/uploads/`;
  useEffect(() => {
    fetchBrand();
  }, [dispatch]);

  const handleSubmit = async (values) => {
     values.deletedImages = deletedImages
    //  console.log(values);
    

    const res = await dispatch(updateBrand({id,  values})).unwrap();
    console.log(res);
    if (res) {
      toast.success("Brand updated successfully!");
      navigate("/brand");
    }
  };


  const handleImageDelete = (id) => {
   
  //  console.log(uploadImages)
    const newImages =  uploadImages.filter(img => img._id !== id)
    setUploadImages(newImages)
    setDeletedImages(prevDeletedImages => [...prevDeletedImages, id]);
    // console.log(newImages);
  }
  console.log(deletedImages)
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
      <div style={{marginBottom: '30px',display:"flex",alignItems:"center",gap:"20px",color:'#D93D6E'  }}>
      <FaArrowLeft size={30} cursor="pointer"/>
      <h2 className="heading">Edit Brands</h2>
    </div>
   
                          <Formik
                            initialValues={initialValues}
                            validationSchema={addBrandValidation}
                            onSubmit={(values) => {
                              // console.log(values);
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
                                    type="code"
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
      
                             

                               
                                {
                                  // error && (
                                  //     <div className='alert alert-danger' role='alert'>{error}</div>
                                  // )
                                }
                                </div>
        </div>
        <div className="card">
          <div  className="card-body">
          <div className="mb-4">
                                  <label htmlFor="logo" className="form-label">
                                    Logo
                                  </label>
                               {!initialValues.logo=="" &&  <img
                                    src={imageBaseUrl + brand.logo}
                                    alt=""
                                    width={50}
                                    height={50}
                                  />}
                           
                                  <input
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    name="image"
                                  
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


                                <h6>Images:</h6>
                                <div className="row mt-4 mb-2">
                                  {uploadImages?.map((image, key) => {
                                    return (
                                      <div key={key} class="col-md-3 grid-item">
                                        <img
                                          src={imageBaseUrl + image.value}
                                          className="img-fluid"
                                          alt="Image 2"
                                          width={150}
                                          height={150}
                                        ></img>
                                        <p>{image.label}</p>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleImageDelete(image._id)}>Remove</button>
                                      </div>
                                    
                                    );
                                  })}
                                </div>

                                <FieldArray name="images" >
                                  {({ push, remove }) => (
                                    <div>
                                      {values.images.map((image, index) => (
                                        <div key={index}  style={{display:"flex",gap:"30vh"}}>
                                        <div className="mb-1">

                                      
                                          <input
                                            type="file"
                                            className="form-control"
                                            // height={20}    
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
                                            <label htmlFor="label" style={{ fontWeight:"bold", marginBottom: '0.5rem',marginRight:"10px" }}>
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
                                          <IoMdClose size={32} color="#D93D6E" onClick={() => remove(index)} cursor="pointer"/>

                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        className="btn btn-sm  mt-2"
                                        onClick={() => push({ label: '', file: null })}
                                        style={{ backgroundColor: 'transparent',border:"1px solid #D93D6E" }}
                                      >
                                        Add Image
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>
          </div>
        </div>
        <div className="card">
          <div  className="card-body">
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
    
    const newFiles = Array.from(event.currentTarget.files);
    values.slide_show = values.slide_show ? values.slide_show.concat(newFiles) : newFiles;

    console.log(values.slide_show);
}}
                                  />
                                  {errors.logo && (
                                    <small className="text-danger">
                                      {errors.logo}
                                    </small>
                                  )}
                                </div>

                                <div style={{ display: "flex", gap: "40px" }}>


{values.slide_show.map((image,index) => (
  
  <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
  

   
   {typeof image === "string"&&<img src={imageBaseUrl + image} height="150px" />}

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

</div>
                         
          </div>
        </div>
        <button
                                  className="btn  w-100 py-8 fs-4 mb-4 rounded-2 mt-4"
                                  type="submit"
                                  style={{ backgroundColor: '#D93D6E',color:"white" }}
                                >
                                  {loading ? "Loading..." : "Edit Brand"}
                                </button>
                              </Form>
                              
                            )}
                            
                          </Formik>
       
      </div>
    </Layout>
  );
};

export default EditBrand;
