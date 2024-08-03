import React, { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { addBrandValidation } from "../../validations/addBrandValidation";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import {
  addBrand,
  fetchBrandById,
  getBrand,
  updateBrand,
} from "../../features/brand/brandSlice";
import TrendingProductsCard from "./TrendingProductsCard"; // Adjust the import based on your project structure

const mediaFolder = process.env.REACT_APP_MEDIA_URL;
const debugMode = process.env.REACT_APP_DEBUG || "";
const EditBrand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const brand = useSelector(getBrand);
  const { id } = useParams();
  const [uploadImages, setUploadImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [brands, setBrands] = useState({});
  const [trendingProducts, setTrendingProducts] = useState([]);

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
    trending_products: [],
  };

  const fetchBrand = async () => {
    await dispatch(fetchBrandById({ id })).unwrap()
      .then(res => {
        console.log("then", res);
        setBrands(res);
        setUploadImages(res.images);
        setTrendingProducts(res.trending_products || []);
        initialValues.name = res.name;
        initialValues.description = res.description;
        initialValues.website = res.website;
        initialValues.images = [];
        initialValues.slide_show = res.slide_show;
        initialValues.trending_products = res.trending_products || [];
      })
      .catch(err => {
        console.log(err);
      });
  };

  const url = mediaFolder;

  useEffect(() => {
    fetchBrand();
  }, [dispatch]);

  const handleSubmit = async (values) => {
    const updatedValues = {
      ...values,
      deletedImages: deletedImages,
      trending_products: trendingProducts,
    };

    const res = await dispatch(updateBrand({ id, values: updatedValues })).unwrap();
    if (res) {
      toast.success("Brand updated successfully!");
      navigate("/brand");
    }
  };

  const handleImageDelete = (id) => {
    const newImages = uploadImages.filter(img => img._id !== id);
    setUploadImages(newImages);
    setDeletedImages(prevDeletedImages => [...prevDeletedImages, id]);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer" onClick={goBack} />
          <h2 className="heading">Edit Brands</h2>
        </div>

        <Formik
          initialValues={brands}
          validationSchema={addBrandValidation}
          enableReinitialize={true}
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
                    />
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
                      type="text"
                      className="form-control"
                      id="description"
                      name="description"
                    />
                    {errors.description && (
                      <small className="text-danger">
                        {errors.description}
                      </small>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="color"
                      className="form-label"
                    >
                      Color
                    </label>
                    <Field
                      type="color"
                      className="form-control"
                      id="color"
                      name="color"
                      placeholder="Select a color"
                      style={{ width: "100px" }}
                    />
                    {errors.color && (
                      <small className="text-danger">
                        {errors.color}
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
                      type="url"
                      className="form-control"
                      id="website"
                      name="website"
                    />
                    {errors.website && (
                      <small className="text-danger">
                        {errors.website}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
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
                          setFieldValue("logo", event.currentTarget.files[0]);
                        }}
                      />
                      {errors.logo && (
                        <small className="text-danger">
                          {errors.logo}
                        </small>
                      )}
                    </div>
                    {typeof values.logo === "string" && values.logo && (
                      <div className="mb-2">
                        <img src={url + values.logo} height="150px" alt="Logo" />
                      </div>
                    )}
                    {values.logo && values.logo instanceof File && (
                      <div>
                        <img src={URL.createObjectURL(values.logo)} height="150px" alt="Logo Preview" />
                      </div>
                    )}
                  </div>
                  <h6>Images:</h6>
                  <div className="row mt-4 mb-2">
                    {uploadImages?.map((image, key) => (
                      <div key={key} className="col-md-3 grid-item">
                        <img
                          src={url + image.value}
                          className="img-fluid"
                          alt="Brand"
                          width={150}
                          height={150}
                        />
                        <p>{image.label}</p>
                        <button className="btn btn-sm btn-danger" onClick={() => handleImageDelete(image._id)}>Remove</button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4>Upload Images</h4>
                    <FieldArray name="images">
                      {({ push, remove }) => (
                        <div>
                          {values.images && values.images.map((image, index) => (
                            <div key={index} style={{ display: "flex", gap: "30vh" }}>
                              <div className="mb-1">
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    setFieldValue(`images[${index}]`, file);
                                  }}
                                />
                              </div>
                              <div style={{ marginBottom: '1rem' }}>
                                <label htmlFor={`labels.${index}`} style={{ fontWeight: "bold", marginBottom: '0.5rem', marginRight: "10px" }}>
                                  Label:
                                </label>
                                <Field
                                  as="select"
                                  id={`labels.${index}`}
                                  name={`labels.${index}`}
                                  placeholder="Select label"
                                  style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                                >
                                  <option value="">Select Label</option>
                                  <option value="cover">Cover Image (Used as Background)</option>
                                </Field>
                                <ErrorMessage name={`labels.${index}`} component="div" />
                              </div>
                              <ErrorMessage name={`images[${index}]`} component="div" />
                              <IoMdClose size={32} color="#D93D6E" onClick={() => remove(index)} cursor="pointer" />
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-sm mt-2"
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
                      multiple
                      onChange={(event) => {
                        const newFiles = Array.from(event.currentTarget.files);
                        const updatedValues = {
                          ...values,
                          slide_show: values.slide_show ? values.slide_show.concat(newFiles) : newFiles,
                        };
                        setFieldValue('slide_show', updatedValues.slide_show);
                      }}
                    />
                    {errors.logo && (
                      <small className="text-danger">
                        {errors.logo}
                      </small>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {values.slide_show && values.slide_show.map((image, index) => (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} key={index}>
                        {typeof image === "string" && (
                          <>
                            <img src={url + image} height="150px" alt="Slideshow" />
                            <button
                              type="button"
                              className="btn btn-sm mt-2"
                              onClick={() => {
                                setFieldValue('slide_show', values.slide_show.filter((_, i) => i !== index));
                              }}
                              style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E" }}
                            >
                              Remove Image
                            </button>
                          </>
                        )}
                        {typeof image !== "string" && (
                          <>
                            <img src={URL.createObjectURL(image)} height="150px" alt="Slideshow Preview" />
                            <button
                              type="button"
                              className="btn btn-sm mt-2"
                              onClick={() => {
                                setFieldValue('slide_show', values.slide_show.filter((_, i) => i !== index));
                              }}
                              style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E" }}
                            >
                              Remove Image
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <TrendingProductsCard
                brandId={id}
                trendingProducts={trendingProducts}
                setTrendingProducts={setTrendingProducts}
              />
              <button
                className="btn w-100 py-8 fs-4 mb-4 rounded-2 mt-4"
                type="submit"
                style={{ backgroundColor: '#D93D6E', color: "white" }}
              >
                {loading ? "Loading..." : "Edit Brand"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      {debugMode && <div> Trending Products <pre>{JSON.stringify(trendingProducts)}</pre></div>}
    </Layout>
  );
};

export default EditBrand;
