import React, { useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { Formik, Form, Field } from "formik";
import { editCategoryValidation } from "../../validations/editCategoryValidation";
import { addCategory, editCategory, fetchCategoryById } from "../../features/category/categorySlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const EditCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, seError] = useState([]);
  const [category,setCategory] = useState({})
  const {id} = useParams();


  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initialValues = {
    name: "",
    code: "",
    banner: "",
    meta_title: "",
    meta_description: "",
  };

  const fetchCategory = async () => {
    const res = await dispatch(fetchCategoryById({id})).unwrap();

    setCategory(res);
    initialValues.name = res.name
    initialValues.code = res.code
    initialValues.meta_title = res.meta_title
    initialValues.meta_description = res.meta_description
    // setFilteredCategories(res);
  };

  // const imageUrl = 'http://localhost:3500/uploads/' + category.banner;

  // const imageUrl = 'http://165.22.222.184/api/uploads/' + category.banner;
  const imageUrl = `${process.env.REACT_APP_API_URL}/api/uploads/${category.banner}`;

  useEffect(() => {
    fetchCategory();
  }, [dispatch]);

 
 
  const handleSubmit = async (values) => {
      //  console.log(values);
      const res = await dispatch(editCategory({"id": id,"updateData": values})).unwrap();
      if(res) {
        toast.success('Category updated successfully!')
        navigate('/category')
      }
  }
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div className="card">
          <div className="card-body">
            <h4>Edit Category</h4>

            <div
              className="page-wrapper"
              id="main-wrapper"
              data-layout="vertical"
              data-navbarbg="skin6"
              data-sidebartype="full"
              data-sidebar-position="fixed"
              data-header-position="fixed"
            >
              <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                <div className="container">
                  <div className="row">
                    <div className="">
                      <div className="card mb-0">
                        <div className="card-body">
                          <Formik
                            initialValues={initialValues}
                            validationSchema={editCategoryValidation}
                            onSubmit={(values) => {
                              // console.log(values);
                                handleSubmit(values)
                            }}
                          >
                            {({ errors,setFieldValue }) => (
                              <Form>
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
                                  <label htmlFor="code" className="form-label">
                                    Category Code
                                  </label>
                                  <Field
                                    type="code"
                                    className="form-control"
                                    id="code"
                                    name="code"
                                  ></Field>
                                  {errors.code && (
                                    <small className="text-danger">
                                      {errors.code}
                                    </small>
                                  )}
                                </div>
                                <div className="mb-4">
                                  <label
                                    htmlFor="meta_title"
                                    className="form-label"
                                  >
                                    Meta Title
                                  </label>
                                  <Field
                                    type="meta_title"
                                    className="form-control"
                                    id="meta_title"
                                    name="meta_title"
                                  ></Field>
                                  {errors.meta_title && (
                                    <small className="text-danger">
                                      {errors.meta_title}
                                    </small>
                                  )}
                                </div>
                                <div className="mb-4">
                                  <label
                                    htmlFor="meta_description"
                                    className="form-label"
                                  >
                                    Meta Description
                                  </label>
                                  <Field
                                    type="meta_description"
                                    className="form-control"
                                    id="meta_description"
                                    name="meta_description"
                                  ></Field>
                                  {errors.meta_description && (
                                    <small className="text-danger">
                                      {errors.meta_description}
                                    </small>
                                  )}
                                </div>

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
                                  <img src={imageUrl} alt="" width={150} height={150}/>
                                </div>

                                <button
                                  className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                                  type="submit"
                                >
                                  {loading ? "Loading..." : "Update Category"}
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

export default EditCategory;
