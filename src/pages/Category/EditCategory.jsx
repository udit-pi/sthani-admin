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
  const [category, setCategory] = useState({})
  const { id } = useParams();

  console.log(category)

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
    slide_show: []
  };

    const imageUrlBanner = `${process.env.REACT_APP_MEDIA_URL}/${category.banner}`;
    
    const imageUrlIcon = `${process.env.REACT_APP_MEDIA_URL}/${category.icon}`;
    const url = `${process.env.REACT_APP_MEDIA_URL}`
  //  const imageUrlBanner = 'http://localhost:3500/api/uploads/' + category.banner;
  //  const  imageUrlIcon  = `http://localhost:3500/api/uploads/${category.icon}`;
  //  const  url  = `http://localhost:3500/api/uploads/api/uploads/`;
  // const imageUrlIcon = 'http://localhost:3500/uploads/' + category.icon;

  // const url = 'http://localhost:3500/uploads/'


  // const  imageUrlBanner  = `${process.env.REACT_APP_API_URL}/api/uploads/${category.banner}`;
  // const  imageUrlIcon  = `${process.env.REACT_APP_API_URL}/api/uploads/${category.icon}`;
  // const  url  = `${process.env.REACT_APP_API_URL}/api/uploads/`;

  const fetchCategory = async () => {
    const res = await dispatch(fetchCategoryById({ id })).unwrap();

    setCategory(res);
    initialValues.name = res.name
    initialValues.description = res.description
    initialValues.icon = res.icon
    initialValues.banner = res.banner
    initialValues.slide_show = res.slide_show

  };


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


  const goBack = () => {
    window.history.back();
  };


  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">

        <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer" onClick={goBack} />
          <h2 className="heading">Edit Category</h2>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={editCategoryValidation}
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
                        setbannerImage("")

                      }}
                    />
                    {errors.banner && (
                      <small className="text-danger">
                        {errors.banner}
                      </small>
                    )}
                  </div>

                  {bannerImage && <div className="mb-2">

                    <img src={bannerImage} height="150px" />

                  </div>}

                  {values.banner && values.banner instanceof File && <div>

                    <img src={URL.createObjectURL(values.banner)} height="150px" />

                  </div>}



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
                        seticon("")
                      }}
                    />
                    {errors.icon && (
                      <small className="text-danger">
                        {errors.icon}
                      </small>
                    )}
                  </div>
                  {icon && <div className="mb-2">

                    <img src={icon} height="150px" />

                  </div>}

                  {values.icon && values.icon instanceof File && <div>

                    <img src={URL.createObjectURL(values.icon)} height="150px" />

                  </div>}
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
                      // onChange={(event) => {

                      //   const selectedFiles = [];


                      //   for (let i = 0; i < event.currentTarget.files.length; i++) {

                        
                      //     values.slide_show.push(event.currentTarget.files[i])

                      //   }
                     


                      //   console.log(values.slide_show)


                      // }}

                      onChange={(event) => {
    
    const newFiles = Array.from(event.currentTarget.files);
    values.slide_show = values.slide_show ? values.slide_show.concat(newFiles) : newFiles;

    console.log(values.slide_show);
}}
                    />
                    {errors.banner && (
                      <small className="text-danger">
                        {errors.banner}
                      </small>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "40px" }}>


                    {values.slide_show.map((image,index) => (
                      
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

                  </div>



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
