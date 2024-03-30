import React from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { addBrandValidation } from "../../validations/addBrandValidation";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addBrand } from "../../features/brand/brandSlice";

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
    labels: []
  };

  const handleSubmit = async (values) => {
    // console.log(values);
    const res = await dispatch(addBrand(values)).unwrap();
    if (res) {
      toast.success("Brand created successfully!");
      navigate("/brand");
    }
  };
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div className="card">
          <div className="card-body">
            <h4>Add Brand</h4>

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
                               console.log(values);
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

                                {/* <div className="mb-4">
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
                                </div> */}
                                <div >
                                    <h4>Upload Images</h4>
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
                                </div>
                               

                                <button
                                  className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2 mt-4"
                                  type="submit"
                                >
                                  {loading ? "Loading..." : "Create Brand"}
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

export default AddBrand;
