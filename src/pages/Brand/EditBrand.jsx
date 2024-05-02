import React, { useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { addBrandValidation } from "../../validations/addBrandValidation";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addBrand,
  fetchBrandById,
  getBrand,
  updateBrand,
} from "../../features/brand/brandSlice";

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
    labels: []
  };

  const fetchBrand = async () => {
    const res = await dispatch(fetchBrandById({ id })).unwrap();
    console.log(res)

    setUploadImages(res.images);
    initialValues.name = res.name;
    initialValues.description = res.description;
    initialValues.website = res.website;
     initialValues.images = [];
     

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
        <div className="card">
          <div className="card-body">
            <h4>Edit Brand</h4>

            <div
              // className="page-wrapper"
              id="main-wrapper"
              data-layout="vertical"
              data-navbarbg="skin6"
              data-sidebartype="full"
              data-sidebar-position="fixed"
              data-header-position="fixed"
            >
              <div className="position-relative overflow-hidden  min-vh-100 d-flex align-items-center justify-content-center">
                <div className="container">
                  <div className="row">
                    <div className="">
                      <div className="card mb-0">
                        <div className="card-body">
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
                                <div className="mb-4">
                                  <label htmlFor="logo" className="form-label">
                                    Logo
                                  </label>
                                  <img
                                    src={imageBaseUrl + brand.logo}
                                    alt=""
                                    width={50}
                                    height={50}
                                  />
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
                                        <div key={index} className="d-flex justify-content-between mt-2">
                                          <input
                                            type="file"
                                            onChange={(event) => {
                                              const file =
                                                event.currentTarget.files[0];
                                              setFieldValue(
                                                `images[${index}]`,
                                                file
                                              );
                                            }}
                                          />
                                          <div>
                                            <label htmlFor="label">
                                              Label:
                                            </label>
                                            <Field
                                              as="select"
                                              id="label"
                                              name={`labels.${index}`}
                                              placeholder="Select label"
                                            //   className="form-select"
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
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => remove(index)}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-success mt-2"
                                        onClick={() => push({ label: '', file: null })}
                                      >
                                        Add Image
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>

                                <button
                                  className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2 mt-4"
                                  type="submit"
                                >
                                  {loading ? "Loading..." : "Edit Brand"}
                                </button>
                                {
                                  // error && (
                                  //     <div className='alert alert-danger' role='alert'>{error}</div>
                                  // )
                                }
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditBrand;
