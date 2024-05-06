import React, { useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useHistory } from 'react-router-dom'
import { Formik, Form, Field } from "formik";
import { editCategoryValidation } from "../../validations/editCategoryValidation";
import { addCategory, editCategory, fetchCategoryById } from "../../features/category/categorySlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MultiSelectDropdown from "../../components/MultiSelectDropDown";
import { FaArrowLeft } from "react-icons/fa";
const EditCategory = ({ history }) => {
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
    // meta_title: "",
    // meta_description: "",
  };

  const fetchCategory = async () => {
    const res = await dispatch(fetchCategoryById({id})).unwrap();

    setCategory(res);
    initialValues.name = res.name
    initialValues.code = res.code
    // initialValues.meta_title = res.meta_title
    // initialValues.meta_description = res.meta_description
    // setFilteredCategories(res);
  };

  // const imageUrl = 'http://localhost:3500/uploads/' + category.banner;

  // const imageUrl = 'http://165.22.222.184/api/uploads/' + category.banner;
  const imageUrl = `${process.env.REACT_APP_API_URL}/api/uploads/${category.banner}`;

  useEffect(() => {
    fetchCategory();
  }, [dispatch]);

 
 
  const handleSubmit = async (values) => {
       console.log(values);
      const res = await dispatch(editCategory({"id": id,"updateData": values})).unwrap();
      if(res) {
        toast.success('Category updated successfully!')
        navigate('/category')
      }
  }


  // const history = useHistory(); 
  
  
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
    
      <div style={{marginBottom: '30px',display:"flex",alignItems:"center",gap:"20px",color:'#D93D6E'  }}>
      <FaArrowLeft size={30} cursor="pointer"/>
      <h2 className="heading">Edit Category</h2>
    </div>
  
                          <Formik
                            initialValues={initialValues}
                            validationSchema={editCategoryValidation}
                            onSubmit={(values) => {
                              // console.log(values);
                                handleSubmit(values)
                            }}
                          >
                            {({values, errors,setFieldValue }) => (
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
                                <MultiSelectDropdown
                                  name="Parent category"
                                  // options={catOption}
                                />
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
                                    htmlFor="banner"
                                    className="form-label"
                                  >
                                  icon image
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
                                  style={{ backgroundColor: '#D93D6E',color:"white" }}
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
