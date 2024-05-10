import React, { useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addPropertyValidation } from "../../validations/addPropertyValidation";
import {  fetchPropertyById, getProperty, updateProperty } from "../../features/properties/propertySlice";
import { FaArrowLeft } from "react-icons/fa";

const EditProperty = () => {
  const [loading, setLoading] = useState(false);
  const [error, seError] = useState([]);
//   const property = useSelector(getProperty)
const [property,setProperty] = useState({})
const [initialValues, setInitialValues] = useState({});

  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(property)

  

  const fetchProperty = async () => {
    const res = await dispatch(fetchPropertyById({ id })).unwrap();
    // console.log(res)
     setProperty(res)
     setInitialValues({
      name: res.name,
      unit: res.unit,
      options: res.options?.join(', ') // Assuming `options` is an array
    });
     

    // setFilteredCategories(res);
  };

  useEffect(() => {
    fetchProperty();
   
  }, []);

  const handleSubmit = async (values) => {
     const prop_options = values.options.split(',');
    values.options = prop_options;
    console.log(values);
    const res = await dispatch(updateProperty({id,  values})).unwrap();
    console.log(res);
    if (res) {
      toast.success("Property updated successfully!");
      navigate("/properties");
    }
  };
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div className="card">
          <div className="card-body">
          <Link
          to={`/properties`}
          style={{ display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}
        >
         <FaArrowLeft size={30} cursor="pointer" />
         <h2 className="heading">Update Property</h2>
        </Link>


            <div
              // className="page-wrapper"
              id="main-wrapper"
              data-layout="vertical"
              data-navbarbg="skin6"
              data-sidebartype="full"
              data-sidebar-position="fixed"
              data-header-position="fixed"
            >
              <div className="position-relative overflow-hidden d-flex align-items-center justify-content-center">
                <div className="container">
                  <div className="row">
                    <div className="">
                      <div className="card mb-0">
                        <div className="card-body">
                          {property && (
                             <Formik
                             initialValues={initialValues}
                            
                             validationSchema={addPropertyValidation}
                             enableReinitialize
                             onSubmit={(values) => {
                             //   console.log(values);
                               handleSubmit(values);
                             }}
                           >
                             {({ values, errors, setFieldValue }) => (
                               <Form>
                                 <div className="mb-3">
                                   <label htmlFor="name" className="form-label">
                                     Property Name
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
                                   <label htmlFor="unit" className="form-label">
                                     Unit
                                   </label>
                                   <Field
                                     type="text"
                                     className="form-control"
                                     id="unit"
                                     name="unit"
                                   ></Field>
                                   {errors.unit && (
                                     <small className="text-danger">
                                       {errors.unit}
                                     </small>
                                   )}
                                 </div>
                                 <div className="mb-4">
                                   <label
                                     htmlFor="options"
                                     className="form-label"
                                   >
                                     Options
                                   </label>
                                   <Field
                                     type="text"
                                     className="form-control"
                                     id="options"
                                     name="options"
                                   ></Field>
                                   {errors.propertyOptions && (
                                     <small className="text-danger">
                                       {errors.propertyOptions}
                                     </small>
                                   )}
                                   <div className="mt-2">
                                     {values.options &&
                                       values.options
                                         .split(",")
                                         .map((keyword, index) => (
                                           <span
                                             key={index}
                                             className="badge bg-secondary me-1"
                                           >
                                             {keyword.trim()}
                                           </span>
                                         ))}
                                   </div>
                                 </div>
                                 <button
                                   className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2 mt-4"
                                   type="submit"
                                 >
                                   {loading ? "Loading..." : "Update Property"}
                                 </button>
                                 {
                                   // error && (
                                   //     <div className='alert alert-danger' role='alert'>{error}</div>
                                   // )
                                 }
                               </Form>
                             )}
                           </Formik>
                          )}
                         
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

export default EditProperty;
