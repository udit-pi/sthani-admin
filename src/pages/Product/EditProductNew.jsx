import React, { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  useFormik,
} from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import QuillEditor from "../../components/Editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import MultiSelectDropdown from "../../components/MultiSelectDropDown";
import MultipleKeywordInput from "../../components/MultipleKeywordInput";
import VariantSelect from "../../components/VariantSelect";
import CustomField from "../../components/VariantSelect";
import SelectOrTextInput from "../../components/VariantSelect";
import { addProductValidation } from "../../validations/addProductValidation";
import { fetchAllCategories } from "../../features/category/categorySlice";
import { useDispatch } from "react-redux";
import { fetchAllBrands } from "../../features/brand/brandSlice";
import { fetchAllProperties } from "../../features/properties/propertySlice";
import {
  addProduct,
  fetchProductById,
  updateProduct,
} from "../../features/product/productSlice";
import { FaArrowLeft } from "react-icons/fa";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

const EditProductNew = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [catOption, setCatOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [product, setProduct] = useState({});
  const [brand, setBrand] = useState({});
  const [productMedia, setProductMedia] = useState([]);
  const [images, setImages] = useState([]);
  const [options, setOptions] = useState([]);
  const [showOptionForm, setShowOptionForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [variants, setVariants] = useState([]);
  const [optionErrors, setOptionErrors] = useState({});
  const [optionsArray, setOptionsArray] = useState([]);
  const [formData, setFormData] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [fetchedProductVariants, setFetchedProductVariants] = useState([]);
  const [showNewVariantForm, setShowNewVariantForm] = useState(false);
  const [showOldVariantForm, setShowOldVariantForm] = useState(false);
  const [oldOptions, setOldOptions] = useState([]);
  const [showAddOptionButton, setShowAddOptionButton] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteId, setdeleteId] = useState("");
  const [valuesArray, setValuesArray] = useState([]);
  const [showVariantOptions, setShowVariantOptions] = useState(false);
  const [oldVariantImages, setOldVariantImages] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    description_short: "",
    sku: "",
    weight: "",
    length: "",
    width: "",
    quantity_min: "",
    stock: "",
    price: "",
    discounted_price: "",
    cost: "",
    published: false,
    brand_id: "",
    category: [],
    productVariant: [],
    files: [],
    options: [],
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,

    bgcolor: "background.paper",
    border: "2px solid white",
    borderRadius: "10px",
    boxShadow: 24,
    pt: 4,
    px: 4,
    pb: 5,
  };

  // const brandOptions = []
  const catOptions = [];

  const imageBaseUrl = `${process.env.REACT_APP_MEDIA_URL}`;
  //   const initialValues = {
  //     name: "",
  //     // description: "",
  //     // field: "",
  //     // variants: [],
  //     // productVariant: [],
  //     // options: [
  //     //   { name: "Size", values: [] },
  //     //   { name: "Color", values: [] },
  //     // ],
  //     files: [],
  //     // variantImages: []

  //     // variants: [
  //     //   { name: "", options: [] },

  //     // ],
  //     options: [{}, {}, {}],
  //     additional_descriptions: []
  //   };

  const fetchCategory = async () => {
    const res = await dispatch(fetchAllCategories()).unwrap();
    //  console.log(res)
    setCategories(res);
    res?.map((cat) => {
      catOptions.push({ label: cat.name, value: cat.id });
    });

    setCatOption(catOptions);
  };

  useEffect(() => {
    fetchCategory();
  }, [dispatch]);

  const fetchBrand = async () => {
    const res = await dispatch(fetchAllBrands()).unwrap();
    //  console.log(res)
    setBrandOption(res);
  };

  useEffect(() => {
    fetchBrand();
  }, [dispatch]);
  // console.log(propertyOption);

  useEffect(() => {
    fetchProduct();
    //   setDataLoaded(true)
  }, [dispatch]);
  const fetchProduct = async () => {
    const res = await dispatch(fetchProductById({ id })).unwrap();
    // console.log(res);
    setProduct(res.product);
    setBrand(res.brand);

    setProductMedia(res.productMedia);

    const initialValues = {
      name: res.product.name || "",
      description: res.product.description || "",
      description_short: res.product.description_short || "",
      sku: res.product.sku || "",
      weight: res.product.weight || "",
      length: res.product.length || "",
      width: res.product.width || "",
      quantity_min: res.product.quantity_min || "",
      stock: res.product.stock || "",
      price: res.product.price || "",
      discounted_price: res.product.discounted_price || "",
      cost: res.product.cost || "",
      published: res.product.published || false,
      brand_id: res.product.brand_id || "",
      category: res.product.categories || [],
      productVariants: res.product.productVariants || [],
      additional_descriptions: res.product.additional_descriptions || [],
      files: [],
      options: [],
    };
    if(res.product.productVariants.length >0) {
      setShowOldVariantForm(true);
    }
    setInitialValues(initialValues);
    setSelectedCat(res.product.categories);
    setFetchedProductVariants(res.product.productVariants);
    setFormData(res);
    setOldOptions(res.product.options);
    addMediaToFetchedVariant(res.product.productVariants, res.productMedia);
  };

  const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const handleSubmit = async (values, errors) => {
    values.deletedImages = deletedImages;
    values.oldImageIndex = [];
    values.oldVariantImages = oldVariantImages;

    oldVariantImages?.map((file, index) => {
      if (file) {
        values.oldImageIndex.push({
          name: file.name,
          index: index,
          variantName: values.productVariants[index].variantName,
        });
      }
    });

    //  console.log(images);
    // console.log(variants);

    const mergedArray = values.productVariantsNew?.map((variant, index) => ({
      ...variant,

      image: images[index],
      variantName: variants[index],
      // variantOption: options[index].optionName
      // variantName: selectedVariants[index]// Assuming images is an array of image objects or URLs
    }));
    values.productVariantsNew = mergedArray;
    values.options = optionsArray;
    values.images = images;

    values.category = selectedCat
      .map((catId) => {
        const category = catOption.find((cat) => cat.value === catId);
        // console.log(category);
        return category
          ? { value: category.value, label: category.label }
          : null;
      })
      .filter(Boolean);

    console.log(values);
    // //  console.log(errors)
    const res = await dispatch(updateProduct({ id, values })).unwrap();
    if (res.status === 200) {
      toast.success("Product updated successfully!");
      navigate("/product");
    }
    if (res.status === 400) {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    console.log(options);
    console.log(oldOptions);
    const combinedArray = [];
    const generateCombinations = (optionsArray, index = 0, current = []) => {
      if (index === optionsArray.length) {
        combinedArray.push(current.join("-"));
        return;
      }

      options[index]?.options?.forEach((option) => {
        generateCombinations(optionsArray, index + 1, [
          ...current,
          option.value,
        ]);
      });
    };

    generateCombinations(options);
    setOptionsArray(options);

    console.log(combinedArray);
    setVariants(combinedArray);
  }, [options]);

  //   console.log(variants)

  const handleFileChange = (e, index) => {
    const selectedFile = e.target.files[0];

    // Update the images state with the selected file for the specific row
    const updatedImages = [...images];
    updatedImages[index] = selectedFile;
    setImages(updatedImages);
  };
  const handleOldFileChange = (e, index) => {
    const selectedFile = e.target.files[0];

    // Update the images state with the selected file for the specific row
    const updatedImages = [...oldVariantImages];
    updatedImages[index] = selectedFile;
    // setShowImage(false);
    setOldVariantImages(updatedImages);
  };

  const goBack = () => {
    window.history.back();
  };

  const handleOptionDelete = (values, optionName) => {
    console.log(optionName);
    setOptions((prev) => prev.filter((opt) => opt.optionName !== optionName));
    console.log(options);
    // Reset form or any other necessary state changes
    values.optionName = "";
    values.options = [{}, {}, {}];
    setShowOptionForm(false);
    setShowOptions(true);
    setShowVariantOptions(true);
  };

  const handleOptiondone = async (values, validateForm) => {
    setShowOldVariantForm(false);
    // setShowNewVariantForm(true);

    setOptions((prev) => {
      // Check if prev is an array and log its value
      if (!Array.isArray(prev)) {
        console.error("prev is not an array:", prev);
        // Initialize prev as an empty array if it's not already an array
        prev = [];
      }

      const index = prev.findIndex(
        (opt) => opt.optionName === values.optionName
      );
      const newOption = {
        optionName: values.optionName,
        options: values.options,
      };

      if (index !== -1) {
        const updatedOptions = [...prev];
        updatedOptions[index] = newOption;
        return updatedOptions;
      } else {
        return [...prev, newOption];
      }
    });

    values.optionName = "";
    values.options = [{}, {}, {}];
    setShowOptionForm(false);
    setShowOptions(true);
    setShowVariantOptions(true);
  };

  const handleVariantEdit = (values, setFieldValue, option) => {
    // console.log(option);
    setFieldValue("optionName", option.optionName);
    option.options?.map((item, index) => {
      setFieldValue(`options.${index}.value`, item.value);
    });

    // setOptions(values.options)
    setShowOptionForm(true);
    setShowOptions(false);
    setShowVariantOptions(false);
  };

  const handleImageDelete = (id) => {
    //  console.log(id);
    const newImages = productMedia.filter((img) => img.id !== id);
    setProductMedia(newImages);
    setDeletedImages((prevDeletedImages) => [...prevDeletedImages, id]);
    // console.log(newImages);
  };

  const addMediaToFetchedVariant = (productVariant, productMedia) => {
    // console.log(productVariant);
    // console.log(productMedia);
    const updatedProductVariant = productVariant?.map((product) => {
      const matchedMedia = productMedia?.find(
        (media) => product.variantName === media.title
      );

      if (matchedMedia) {
        return {
          variantName: product.name,
          variantSKU: product.sku,
          variantPrice: product.price,
          variantStock: product.stock,

          image: matchedMedia.file_name,
        };
      }

      return product;
    });

     console.log(updatedProductVariant);
    setFetchedProductVariants(updatedProductVariant);
  };

  const deleteOldVariant = (values) => {
    values.optionName = "";
    values.options = [{}, {}, {}];
    setShowAddOptionButton(true);
    setShowOldVariantForm(false);
    const newOption = {
      optionName: values.optionName,
      options: values.options,
    };
    setOptions(newOption);
    setOpen(false);
  };

  const handleOpen = (values) => {
    //  setdeleteId(optionName);
    setValuesArray(values);
    setOpen(true);
    console.log("open");
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            color: "#D93D6E",
          }}
        >
          <FaArrowLeft size={20} cursor="pointer" onClick={goBack} />
          <h2 className="heading">Edit Product</h2>
        </div>

        <div
          className="page-wrapper"
          id="main-wrapper"
          data-layout="vertical"
          data-navbarbg="skin6"
          data-sidebartype="full"
          data-sidebar-position="fixed"
          data-header-position="fixed"
        >
          <div>
            <div className="container">
              <div className="row">
                {initialValues ? (
                  <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={addProductValidation}
                    //   validateOnChange={true}
                    //   validateOnBlur={true}
                    validateOnSubmit={true}
                    onSubmit={(values, errors) => {
                      // console.log(errors);
                      handleSubmit(values, errors);
                    }}
                  >
                    {({
                      values,
                      errors,
                      setFieldValue,
                      isValid,
                      isSubmitting,
                      validateForm,
                      touched,
                      handleBlur,
                    }) => (
                      <Form>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="card mb-3">
                              <div className="card-body">
                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">
                                    Name <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    type="name"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    aria-describedby="nameHelp"
                                  ></Field>
                                  {/* {console.log(values)} */}
                                  {errors.name && (
                                    <small className="text-danger">
                                      {errors.name}
                                    </small>
                                  )}
                                </div>

                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">
                                    Short Description
                                  </label>
                                  <Field
                                    as="textarea"
                                    name="description_short"
                                    className="form-control"
                                    rows="2" // Set the number of rows for the textarea
                                    cols="50" // Set the number of columns for the textarea
                                    placeholder="Enter short description"
                                  />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">
                                    Description
                                  </label>
                                  <Field
                                    name="description"
                                    component={QuillEditor}
                                  />
                                  {errors.description && (
                                    <small className="text-danger">
                                      {errors.description}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="card mb-3">
                            <div className="card-body">
                              <FieldArray name="additional_descriptions">
                                {({ push, remove }) => (
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="additional_descriptions"
                                        className="form-label mt-4"
                                        style={{ marginRight: "10px" }}
                                      >
                                        Additional Descriptions
                                      </label>
                                    </div>
                                    {values.additional_descriptions?.map(
                                      (keyword, index) => (
                                        <div key={index} className="mb-3">
                                          <div>
                                            <label htmlFor="label">
                                              Label:
                                            </label>
                                            <Field
                                              name={`additional_descriptions.${index}.label`}
                                              className="form-control"
                                             
                                            />
                                            <ErrorMessage
                                              name="label"
                                              component="div"
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label
                                              htmlFor="name"
                                              className="form-label"
                                            >
                                              Text
                                            </label>
                                            <Field
                                              name={`additional_descriptions.${index}.value`}
                                              component={QuillEditor}
                                            />
                                            {errors.description && (
                                              <small className="text-danger">
                                                {errors.value}
                                              </small>
                                            )}
                                          </div>
                                          <button
                                            className="btn btn-sm btn-danger mt-5"
                                            onClick={() => remove(index)}
                                          >
                                            <span>
                                              <FontAwesomeIcon icon={faTrash} />
                                            </span>
                                            Remove
                                          </button>
                                        </div>
                                      )
                                    )}
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-dark mt-2"
                                      onClick={() => push("")}
                                    >
                                      Add descriptions
                                    </button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          </div>
                            <div className="card mb-3">
                              <div className="card-body">
                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">
                                    Media
                                  </label>
                                  <div className="row mt-4 mb-2">
                                    {productMedia?.map((media, key) => {
                                      if (media.title === "Media") {
                                        return (
                                          <div
                                            key={key}
                                            class="col-md-3 grid-item"
                                          >
                                            <img
                                              src={
                                                imageBaseUrl + media.file_name
                                              }
                                              className="img-fluid"
                                              alt="Image 2"
                                              width={150}
                                              height={150}
                                            ></img>
                                            {/* <p>{image.label}</p> */}
                                            <button
                                            type="button"
                                              className="btn btn-sm btn-danger mt-2"
                                              onClick={() =>
                                                handleImageDelete(media.id)
                                              }
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        );
                                      }
                                      return;
                                    })}
                                  </div>
                                  <div>
                                    <input
                                      type="file"
                                      multiple
                                      onChange={(event) => {
                                        const newFiles = Array.from(
                                          event.target.files
                                        );
                                        setFieldValue("files", [
                                          ...values.files,
                                          ...newFiles,
                                        ]);
                                      }}
                                    />
                                    <FieldArray name="files">
                                      {({ push, remove }) => (
                                        <div className="row mt-4">
                                          {values.files?.map((file, index) => (
                                            <div
                                              key={index}
                                              className="col-md-4 mb-4"
                                            >
                                              {file.type.startsWith(
                                                "image/"
                                              ) && (
                                                <img
                                                  src={URL.createObjectURL(
                                                    file
                                                  )}
                                                  alt={`Preview ${index}`}
                                                  style={{
                                                    width: "100px",
                                                    height: "100px",
                                                  }}
                                                />
                                              )}
                                              {file.type.startsWith(
                                                "video/"
                                              ) && (
                                                <video
                                                  src={URL.createObjectURL(
                                                    file
                                                  )}
                                                  controls
                                                  width="100"
                                                  height="100"
                                                />
                                              )}
                                              <div>
                                                <p>{file.name}</p>
                                                <button
                                                  type="button"
                                                  onClick={() => remove(index)}
                                                  className="btn btn-sm btn-danger"
                                                >
                                                  <span>
                                                    <FontAwesomeIcon
                                                      icon={faTrash}
                                                    />
                                                  </span>
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </FieldArray>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="card mb-3">
                              <div className="card-body">
                                <div className="row">
                                  <h6>
                                    <b>Pricing</b>
                                  </h6>

                                  <div className="col-md-6 mt-3">
                                    <label
                                      htmlFor="price"
                                      className="form-label"
                                    >
                                      Price{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                      type="number"
                                      className="form-control"
                                      id="price"
                                      name="price"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.price && (
                                      <small className="text-danger">
                                        {errors.price}
                                      </small>
                                    )}
                                  </div>
                                  <div className="col-md-6 mt-3">
                                    <label
                                      htmlFor="discounted_price"
                                      className="form-label"
                                    >
                                      Discounted Price
                                    </label>
                                    <Field
                                      type="number"
                                      className="form-control"
                                      id="discounted_price"
                                      name="discounted_price"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.discounted_price && (
                                      <small className="text-danger">
                                        {errors.discounted_price}
                                      </small>
                                    )}
                                  </div>
                                </div>
                                <div className="row mt-3">
                                  <div className="col-md-6">
                                    <label
                                      htmlFor="cost"
                                      className="form-label"
                                    >
                                      Cost
                                    </label>
                                    <Field
                                      type="number"
                                      className="form-control"
                                      id="cost"
                                      name="cost"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.cost && (
                                      <small className="text-danger">
                                        {errors.cost}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="card mb-3">
                              <div className="card-body">
                                <h6>
                                  <b>Inventory & Shipping</b>
                                </h6>
                                <div className="row mt-4">
                                  <div className="col-md-4">
                                    <label htmlFor="sku" className="form-label">
                                      SKU <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      id="sku"
                                      name="sku"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.sku && (
                                      <small className="text-danger">
                                        {errors.sku}
                                      </small>
                                    )}
                                  </div>
                                  <div className="col-md-4">
                                    <label
                                      htmlFor="quantity_min"
                                      className="form-label"
                                    >
                                      Min quantity per order
                                    </label>
                                    <Field
                                      type="number"
                                      className="form-control"
                                      id="quantity_min"
                                      name="quantity_min"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.quantity_min && (
                                      <small className="text-danger">
                                        {errors.length}
                                      </small>
                                    )}
                                  </div>
                                  <div className="col-md-4">
                                    <label
                                      htmlFor="stock"
                                      className="form-label"
                                    >
                                      Stock
                                    </label>
                                    <Field
                                      type="number"
                                      className="form-control"
                                      id="stock"
                                      name="stock"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.stock && (
                                      <small className="text-danger">
                                        {errors.stock}
                                      </small>
                                    )}
                                  </div>
                                </div>
                                <div className="row mt-3">
                                  <div className="col-md-3">
                                    <label
                                      htmlFor="length"
                                      className="form-label"
                                    >
                                      Length
                                    </label>
                                    <Field
                                      type="number"
                                      className="form-control"
                                      id="length"
                                      name="length"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.length && (
                                      <small className="text-danger">
                                        {errors.length}
                                      </small>
                                    )}
                                  </div>
                                  <div className="col-md-3">
                                    <label
                                      htmlFor="width"
                                      className="form-label"
                                    >
                                      Width
                                    </label>
                                    <Field
                                      type="number"
                                      className="form-control"
                                      id="width"
                                      name="width"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.width && (
                                      <small className="text-danger">
                                        {errors.width}
                                      </small>
                                    )}
                                  </div>
                                  <div className="col-md-3">
                                    <label
                                      htmlFor="height"
                                      className="form-label"
                                    >
                                      Height
                                    </label>
                                    <Field
                                      type="number"
                                      className="form-control"
                                      id="height"
                                      name="height"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.height && (
                                      <small className="text-danger">
                                        {errors.height}
                                      </small>
                                    )}
                                  </div>
                                  <div className="col-md-3">
                                    <label
                                      htmlFor="weight"
                                      className="form-label"
                                    >
                                      Weight
                                    </label>
                                    <Field
                                      type="number"
                                      className="form-control"
                                      id="weight"
                                      name="weight"
                                      aria-describedby="nameHelp"
                                    ></Field>
                                    {errors.weight && (
                                      <small className="text-danger">
                                        {errors.weight}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="card mb-3">
                              <div className="card-body">
                                <div className="row">
                                  <h6>
                                    <b>Variants</b>
                                  </h6>
                                  {showAddOptionButton && (
                                    <>
                                      <a
                                        onClick={() => {
                                          // console.log(errors);
                                          setShowOptionForm(true);
                                        }}
                                        // className="btn btn-sm btn-success mb-2 mt-2"
                                        style={{
                                          color: "blue",
                                          textDecoration: "underline",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Add options like size and color
                                      </a>
                                      {showOptionForm && (
                                        <>
                                          <div className="mb-2">
                                            <FieldArray name="options">
                                              {({ push, remove }) => (
                                                <div className="card mb-3 border-dark">
                                                  <div className="card-body">
                                                    <div className="col-md-12">
                                                      <label
                                                        htmlFor="name"
                                                        className="form-label"
                                                      >
                                                        Name
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="form-control"
                                                        id="optionName"
                                                        name="optionName"
                                                        aria-describedby="nameHelp"
                                                      ></Field>
                                                      {optionErrors.name ===
                                                        "optionName" && (
                                                        <small className="text-danger">
                                                          {optionErrors.message}
                                                        </small>
                                                      )}
                                                    </div>
                                                    <div className="col-md-12 mt-2">
                                                      <label
                                                        htmlFor="options"
                                                        className="form-label"
                                                      >
                                                        Option Values
                                                      </label>

                                                      <div>
                                                        {values.options?.map(
                                                          (
                                                            option,
                                                            optionIndex
                                                          ) => {
                                                            return (
                                                              <>
                                                                <div
                                                                  key={
                                                                    optionIndex
                                                                  }
                                                                  className="d-flex justify-content-start mb-2"
                                                                >
                                                                  <Field
                                                                    type="text"
                                                                    required={
                                                                      true
                                                                    }
                                                                    className="form-control"
                                                                    id={`options[${optionIndex}].value`}
                                                                    name={`options[${optionIndex}].value`}
                                                                    aria-describedby="nameHelp"
                                                                  ></Field>
                                                                  <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                      remove(
                                                                        optionIndex
                                                                      );
                                                                    }}
                                                                    className="btn btn-sm btn-danger ms-2"
                                                                  >
                                                                    <span>
                                                                      <FontAwesomeIcon
                                                                        icon={
                                                                          faTrash
                                                                        }
                                                                      />
                                                                    </span>
                                                                  </button>
                                                                </div>
                                                                {Object.keys(
                                                                  optionErrors
                                                                ).map(
                                                                  (index) => (
                                                                    <small
                                                                      key={
                                                                        index
                                                                      }
                                                                      className="text-danger"
                                                                    >
                                                                      {
                                                                        optionErrors[
                                                                          index
                                                                        ]
                                                                          .message
                                                                      }
                                                                    </small>
                                                                  )
                                                                )}
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            push("");
                                                          }}
                                                          className="btn btn-sm btn-dark mt-2"
                                                        >
                                                          + Add Values
                                                        </button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </FieldArray>
                                            <div className="d-flex justify-content-end mt-2">
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-outline-dark"
                                                onClick={() =>
                                                  handleOptionDelete(
                                                    values,
                                                    values.optionName
                                                  )
                                                }
                                              >
                                                Delete
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleOptiondone(
                                                    values,
                                                    validateForm
                                                  )
                                                }
                                                className="btn btn-sm btn-dark ms-2"
                                              >
                                                Done
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      {showOptions && (
                                        <div className="mt-4">
                                          <FieldArray name="variantOption">
                                            {({ push, remove }) => (
                                              <>
                                                {options?.map(
                                                  (option, optionIndex) => (
                                                    <div className="card mb-3 border-dark">
                                                      <div
                                                        className="card-body"
                                                        style={{
                                                          "background-color":
                                                            "silver",
                                                        }}
                                                      >
                                                        <div className="d-flex justify-content-between">
                                                          <div>
                                                            <FontAwesomeIcon
                                                              icon={faBars}
                                                            />
                                                          </div>
                                                          <div>
                                                            <h6>
                                                              {
                                                                option.optionName
                                                              }
                                                            </h6>
                                                            {option.options?.map(
                                                              (item) => (
                                                                <span>
                                                                  {item.value},
                                                                </span>
                                                              )
                                                            )}
                                                          </div>
                                                          <button
                                                            className="btn btn-sm btn-dark"
                                                            onClick={() =>
                                                              handleVariantEdit(
                                                                values,
                                                                setFieldValue,
                                                                option
                                                              )
                                                            }
                                                          >
                                                            Edit
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </>
                                            )}
                                          </FieldArray>
                                        </div>
                                      )}
                                    </>
                                  )}

                                  <>
                         
                                    {showOldVariantForm && (
                                      <div className="card mb-3">
                                        <div className="card-body">
                                          <FieldArray name="productVariants">
                                            {({ push, remove }) => (
                                              <>
                                                <div className="row table-responsive">
                                                  <table className="table">
                                                    <thead>
                                                      <tr>
                                                        {/* <th scope="col">#</th> */}
                                                        <th
                                                          scope="col"
                                                          style={{
                                                            width: "200px",
                                                          }}
                                                        >
                                                          Image
                                                        </th>
                                                        <th
                                                          scope="col"
                                                          style={{
                                                            width: "200px",
                                                          }}
                                                        >
                                                          Variant
                                                        </th>
                                                      
                                                        <th
                                                          scope="col"
                                                          style={{
                                                            width: "100px",
                                                          }}
                                                        >
                                                          Price
                                                        </th>
                                                        <th
                                                          scope="col"
                                                          style={{
                                                            width: "100px",
                                                          }}
                                                        >
                                                          Discounted Price
                                                        </th>
                                                        <th
                                                          scope="col"
                                                          style={{
                                                            width: "100px",
                                                          }}
                                                        >
                                                          Stock
                                                        </th>
                                                      
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {fetchedProductVariants?.map(
                                                        (
                                                          variant,
                                                          variantIndex
                                                        ) => (
                                                          <tr
                                                            key={variantIndex}
                                                          >
                                                            <td className="d-flex">
                                                            
                                                                    {oldVariantImages[
                                                                      variantIndex
                                                                    ] && (
                                                                      <div className="ms-2">
                                                                        <img
                                                                          src={URL.createObjectURL(
                                                                            oldVariantImages[
                                                                              variantIndex
                                                                            ]
                                                                          )}
                                                                          width={
                                                                            50
                                                                          }
                                                                          height={
                                                                            50
                                                                          }
                                                                          alt={`Thumbnail ${variantIndex}`}
                                                                        />
                                                                      </div>
                                                                    )}
                                                                    {variant.image && (
                                                                      <div>
                                                                        <img
                                                                          src={
                                                                            imageBaseUrl +
                                                                            variant.image
                                                                          }
                                                                          width={
                                                                            50
                                                                          }
                                                                          height={
                                                                            50
                                                                          }
                                                                          alt={`Thumbnail ${variantIndex}`}
                                                                        />
                                                                      </div>
                                                                    )}
                                                                    <label
                                                                      htmlFor={`file-upload-${variantIndex}`}
                                                                      className="ms-2"
                                                                      style={{
                                                                        cursor:
                                                                          "pointer",
                                                                      }}
                                                                    >
                                                                      <FontAwesomeIcon
                                                                        icon={
                                                                          faUpload
                                                                        }
                                                                      />
                                                                    </label>
                                                                    <input
                                                                      id={`file-upload-${variantIndex}`}
                                                                      type="file"
                                                                      onChange={(
                                                                        e
                                                                      ) =>
                                                                        handleOldFileChange(
                                                                          e,
                                                                          variantIndex
                                                                        )
                                                                      }
                                                                      style={{
                                                                        display:
                                                                          "none",
                                                                      }} // Hide the input element
                                                                    />

                                                                    {/* Thumbnail preview */}
                                                                 </td>
                                                                 <td>
                                                            
                                                                    <Field
                                                                      type="text"
                                                                      name={`productVariants[${variantIndex}].variantName`}
                                                                      //   value={option}
                                                                      readonly
                                                                      className="form-control"
                                                                      style={{
                                                                        width:
                                                                          "150px",
                                                                      }}
                                                                    />
                                                                    {/* <p>{option}</p> */}
                                                                  </td>
                                                              
                                                             
                                                                   <td>
                                                                    <Field
                                                                      type="number"
                                                                      name={`productVariants[${variantIndex}].variantPrice`}
                                                                      placeholder="Price"
                                                                      required
                                                                      className="form-control"
                                                                      style={{
                                                                        width:
                                                                          "75px",
                                                                      }}
                                                                    />

                                                                    <ErrorMessage
                                                                      name={`productVariants.${variantIndex}.variantPrice`}
                                                                      component="div"
                                                                      className="text-danger"
                                                                    />
                                                                  </td>
                                                                  <td>
                                                                  
                                                                    <Field
                                                                      type="number"
                                                                      name={`productVariants[${variantIndex}].variantDiscountedPrice`}
                                                                      placeholder="Discountde Price"
                                                                      required
                                                                      className="form-control"
                                                                      style={{
                                                                        width:
                                                                          "75px",
                                                                      }}
                                                                    />

                                                                    <ErrorMessage
                                                                      name={`productVariants.${variantIndex}.variantDiscountedPrice`}
                                                                      component="div"
                                                                      className="text-danger"
                                                                    />
                                                                    </td>
                                                                  <td>
                                                              
                                                                    <Field
                                                                      type="number"
                                                                      name={`productVariants[${variantIndex}].variantStock`}
                                                                      placeholder="Stock"
                                                                      required
                                                                      className="form-control"
                                                                      style={{
                                                                        width:
                                                                          "75px",
                                                                      }}
                                                                    />

                                                                    <ErrorMessage
                                                                      name={`productVariants.${variantIndex}.variantStock`}
                                                                      component="div"
                                                                      className="text-danger"
                                                                    />
                                                                 
                                                               
                                                                  </td>
                                                          </tr>
                                                        )
                                                      )}
                                                    </tbody>
                                                  </table>
                                                </div>
                                                <div>
                                                  <button
                                                    type="button"
                                                    className="btn btn-danger mt-4"
                                                    onClick={() =>
                                                      handleOpen(values)
                                                    }
                                                  >
                                                    Delete
                                                  </button>
                                                </div>
                                              </>
                                            )}
                                          </FieldArray>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                  <>
                                    {options?.length > 0 &&
                                      showVariantOptions && (
                                        <div className="card mb-3">
                                          <div className="card-body">
                                            <FieldArray name="productVariantsNew">
                                              {({ push, remove }) => (
                                                <>
                                                  {variants?.map(
                                                    (option, variantIndex) => (
                                                      <div className="d-flex justify-content-between mb-2">
                                                        <div className="d-flex justify-content-between">
                                                          <div className="d-flex">
                                                            {images[
                                                              variantIndex
                                                            ] && (
                                                              <div className="ms-2">
                                                                <img
                                                                  src={URL.createObjectURL(
                                                                    images[
                                                                      variantIndex
                                                                    ]
                                                                  )}
                                                                  width={50}
                                                                  height={50}
                                                                  alt={`Thumbnail ${variantIndex}`}
                                                                />
                                                              </div>
                                                            )}
                                                            <label
                                                              htmlFor={`file-upload-${variantIndex}`}
                                                              className="ms-2"
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                            >
                                                              <FontAwesomeIcon
                                                                icon={faUpload}
                                                              />
                                                            </label>
                                                            <input
                                                              id={`file-upload-${variantIndex}`}
                                                              type="file"
                                                              onChange={(e) =>
                                                                handleFileChange(
                                                                  e,
                                                                  variantIndex
                                                                )
                                                              }
                                                              style={{
                                                                display: "none",
                                                              }} // Hide the input element
                                                            />

                                                            {/* Thumbnail preview */}
                                                          </div>
                                                          <div className="ms-4">
                                                            <Field
                                                              type="text"
                                                              name={`productVariantsNew[${variantIndex}].variantName`}
                                                              value={option}
                                                              readonly
                                                              className="form-control"
                                                              style={{
                                                                width: "200px",
                                                              }}
                                                            />
                                                            {/* <p>{option}</p> */}
                                                          </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between ms-2">
                                                          <div>
                                                            <Field
                                                              type="number"
                                                              name={`productVariantsNew[${variantIndex}].variantPrice`}
                                                              placeholder="Price"
                                                              required
                                                              className="form-control"
                                                              style={{
                                                                width: "100px",
                                                              }}
                                                            />

                                                            <ErrorMessage
                                                              name={`productVariantsNew.${variantIndex}.variantPrice`}
                                                              component="div"
                                                              className="text-danger"
                                                            />
                                                          </div>
                                                          <div>
                                                            <Field
                                                              type="number"
                                                              name={`productVariantsNew[${variantIndex}].variantDiscountedPrice`}
                                                              placeholder="Discountde Price"
                                                              required
                                                              className="form-control"
                                                              style={{
                                                                width: "100px",
                                                              }}
                                                            />

                                                            <ErrorMessage
                                                              name={`productVariantsNew.${variantIndex}.variantDiscountedPrice`}
                                                              component="div"
                                                              className="text-danger"
                                                            />
                                                          </div>
                                                          <div className="">
                                                            <Field
                                                              type="number"
                                                              name={`productVariantsNew[${variantIndex}].variantStock`}
                                                              placeholder="Stock"
                                                              required
                                                              className="form-control"
                                                              style={{
                                                                width: "100px",
                                                              }}
                                                            />

                                                            <ErrorMessage
                                                              name={`productVariantsNew.${variantIndex}.variantStock`}
                                                              component="div"
                                                              className="text-danger"
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </>
                                              )}
                                            </FieldArray>
                                          </div>
                                        </div>
                                      )}
                                  </>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="card mb-3">
                              <div className="card-body">
                                <div>
                                  <label
                                    htmlFor="published"
                                    className="form-label"
                                  >
                                    Published:
                                  </label>
                                  <Field
                                    as="select"
                                    id="published"
                                    name="published"
                                    // placeholder="Select label"
                                    className="form-select"
                                  >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    {/* Add more options as needed */}
                                  </Field>
                                  {errors.published && (
                                    <small className="text-danger">
                                      {errors.published}
                                    </small>
                                  )}

                                  {/* <ErrorMessage
                                  name="published"
                                  component="div"
                                /> */}
                                </div>
                              </div>
                            </div>
                            <div className="card mb-3">
                              <div className="card-body">
                                <div>
                                  <label
                                    htmlFor="category"
                                    className="form-label"
                                  >
                                    Category:
                                  </label>
                                  <MultiSelectDropdown
                                    name="category"
                                    options={catOption}
                                    // value={selectedCategories.filter(
                                    //   (cat) => cat != null
                                    // )}
                                    value={selectedCat
                                      .map((catId) => {
                                        const category = catOption.find(
                                          (cat) => cat.value === catId
                                        );
                                        return category
                                          ? {
                                              value: category.value,
                                              label: category.label,
                                            }
                                          : null;
                                      })
                                      .filter(Boolean)}
                                    onChange={(selectedOption) => {
                                      // console.log("Selected Option:", selectedOption);
                                      setFieldValue("category", selectedOption);
                                      setSelectedCat(
                                        selectedOption.map((cat) => cat.value)
                                      );
                                      // console.log("Form Values:", values);
                                    }}
                                    // value={selectedCategories}
                                  />
                                  {errors.category && (
                                    <small className="text-danger">
                                      {errors.category}
                                    </small>
                                  )}
                                  <ErrorMessage
                                    name="category"
                                    component="div"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="card mb-3">
                              <div className="card-body">
                                <div>
                                  <label htmlFor="brand" className="form-label">
                                    Brand:
                                  </label>
                                  <Field
                                    as="select"
                                    id="brand_id"
                                    name="brand_id"
                                    // placeholder="Select label"
                                    className="form-select"
                                  >
                                    <option value="">Select Brand</option>
                                    {brandOption?.map((brand) => (
                                      <option value={brand.id} key={brand.id}>
                                        {capitalize(brand.name)}
                                      </option>
                                    ))}
                                    {/* Add more options as needed */}
                                  </Field>
                                  {errors.brand_id && (
                                    <small className="text-danger">
                                      {errors.brand_id}
                                    </small>
                                  )}
                                  {/* <ErrorMessage name="brand_id" component="div" /> */}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 ">
                            <button
                              type="submit"
                              className="btn btn-sm mt-2"
                              style={{
                                backgroundColor: "#D93D6E",
                                color: "white",
                                width: "40%",
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2 id="child-modal-title">Do you want to delete?</h2>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <button
              type="button"
              className="btn btn-sm  mt-4"
              style={{
                backgroundColor: "transparent",
                border: "1px solid #D93D6E",
                width: "100px",
              }}
              onClick={() => deleteOldVariant(valuesArray)}
            >
              Yes
            </button>

            <button
              type="button"
              className="btn btn-sm  mt-4"
              onClick={handleClose}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #D93D6E",
                width: "100px",
                marginLeft: "20px",
              }}
            >
              No
            </button>
          </Typography>
        </Box>
      </Modal>
    </Layout>
  );
};

export default EditProductNew;
