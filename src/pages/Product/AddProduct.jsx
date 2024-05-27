import React, { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  useFormik,
} from "formik";
import { Link, useNavigate } from "react-router-dom";
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
import { addProduct } from "../../features/product/productSlice";
import { FaArrowLeft } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ObjectId from 'bson-objectid';

const AddProductNew = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [catOption, setCatOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);

  const [propertyOption, setPropertyOption] = useState({});

  const [images, setImages] = useState([]);
  const [options, setOptions] = useState([]);
  const [showOptionForm, setShowOptionForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [variants, setVariants] = useState([]);
  const [optionErrors, setOptionErrors] = useState([]);
  const [optionsArray, setOptionsArray] = useState([]);
  const [showVariantOptions, setShowVariantOptions] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [showAddOptionButton, setShowAddOptionButton] = useState(false);
  const [showVariant,setShowVariant] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);


  const generateVariantId = () => {
    return ObjectId().toString();
  };
  // const brandOptions = []
  const catOptions = [];

  const formik = useFormik({});
  const initialValues = {
    name: "",
    // description: "",
    // field: "",
    // variants: [],
    productVariants: [],
    // options: [
    //   { name: "Size", values: [] },
    //   { name: "Color", values: [] },
    // ],
    files: [],
    // variantImages: []

    // variants: [
    //   { name: "", options: [] },

    // ],
    options: [{ value: "" }, { value: "" }, { value: "" }],
    additional_descriptions: [],
  };

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

  const fetchProperty = async () => {
    const res = await dispatch(fetchAllProperties()).unwrap();
    // console.log(res);
    setPropertyOption(res);
  };

  useEffect(() => {
    fetchBrand();
    fetchProperty();
  }, [dispatch]);
  // console.log(propertyOption);

  const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const handleSubmit = async (values, errors) => {
    // console.log(errors);

    // console.log(images);
    // console.log(variants);

    // const mergedArray = values.productVariants?.map((variant, index) => ({
    //   ...variant,

    //   image: mediaItems[index],
    //   variantName: variants[index],
    //   // variantOption: options[index].optionName
    //   // variantName: selectedVariants[index]// Assuming images is an array of image objects or URLs
    // }));
    // values.variantImages = images

    // values.productVariants = mergedArray;
    values.options = optionsArray;
    values.mediaItems = mediaItems

    console.log(values);

    //  console.log(errors)
     const res = await dispatch(addProduct({ values })).unwrap();
    if (res.status === 201) {
       console.log(res.product);
      toast.success("Product created successfully!");
      navigate(`/product`);
    }
    if (res.status === 400) {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    const combinedArray = [];
    const generateCombinations = (optionsArray, index = 0, current = []) => {
      if (index === optionsArray.length) {
        combinedArray.push(current.join("-"));
        return;
      }

      options[index].options?.forEach((option) => {
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

  // const handleFileChange = (e, index) => {
  //   const selectedFile = e.target.files[0];

  //   // Update the images state with the selected file for the specific row
  //   const updatedImages = [...mediaItems];
  //   updatedImages[index] = selectedFile;
  //   setMediaItems(updatedImages);
  // };

  const goBack = () => {
    window.history.back();
  };

  const handleOptionDelete = (values, optionName) => {
    setOptions((prev) => prev.filter((opt) => opt.optionName !== optionName));

    values.optionName = "";
    values.options = [{}, {}, {}];
    // console.log(values)
    setVariants([]);
    setShowOptionForm(false);
    setShowOptions(true);
    setShowVariantOptions(true);
    setOptionErrors([]);
  };

  useEffect(() => {
    if (optionErrors.length === 0) {
      setShowOptions(true);
      setShowVariantOptions(true);
    }
  }, [optionErrors]);

  const validateOptions = (values) => {
    const newErrors = values.options
      .map((opt, index) => {
        console.log(opt);
        if (opt.value === "" || opt === "" || Object.keys(opt).length === 0) {
          console.log("inside");
          return {
            name: "options",
            index,
            message: "This field is required",
          };
        }
        return null;
      })
      .filter((error) => error !== null);

    return newErrors;
  };
  const handleOptiondone = async (values, validateForm) => {
    console.log("Submitted values:", values.options);

    const optionValidationErrors = validateOptions(values);

    if (optionValidationErrors.length > 0) {
      setOptionErrors(optionValidationErrors);
      return;
    }

    // Ensure optionName is trimmed to avoid mismatch due to extra spaces
    values.optionName = values.optionName.trim();

    setOptions((prev) => {
      console.log("Previous options:", prev);
      console.log("Submitted values after trim:", values);

      const index = prev.findIndex(
        (opt) => opt.optionName === values.optionName
      );
      console.log("Found index:", index);

      const newOption = {
        optionName: values.optionName,
        options: values.options,
      };

      if (index !== -1) {
        // Update existing option
        return prev.map((opt, idx) => (idx === index ? newOption : opt));
      } else {
        // Add new option
        return [...prev, newOption];
      }
    });

    setShowOptionForm(false);
    setShowOptions(true);
    setShowVariantOptions(true);
    setOptionErrors([]);
    setVariants([]);

    values.optionName = "";
    values.options = [];
  };

  const getErrorMessage = (optionIndex) => {
    console.log(optionErrors);
    const error = optionErrors.find((err) => err.index === optionIndex);
    return error ? error.message : null;
  };

  // console.log("optionErrors:", optionErrors);
  const handleVariantEdit = (values, setFieldValue, option) => {
    console.log(option);
    setFieldValue("optionName", option.optionName);
    // values.optionName = option.optionName
    option.options?.map((item, index) => {
      setFieldValue(`options[${index}].value`, item.value);

      // values.options[index]?.value = item.value
    });

    //  setOptions(values.options)
    setShowOptionForm(true);
    setShowOptions(false);
    setShowVariantOptions(false);
  };

  const onDragEnd = (result, values, setFieldValue) => {
    if (!result.destination) return;

    const reorderedOptions = Array.from(options);
    const [movedOption] = reorderedOptions.splice(result.source.index, 1);
    reorderedOptions.splice(result.destination.index, 0, movedOption);

    console.log("Original options:", options);
    console.log("Reordered options:", reorderedOptions);
    setOptions(reorderedOptions);
    values.productVariants = [];
    setFieldValue("productVariants", []);
    // setFieldValue('options', reorderedOptions);
    setTimeout(() => {
      console.log("ProductVariants after reset:", values.productVariants);
    }, 0);
    setVariants([]);
    setForceUpdate((prev) => !prev);
  };

  const handleImageDragEnd = (result, values, setFieldValue) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(mediaItems);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    setMediaItems(reorderedImages);
  };
  const handleMediaRemoveImage = (fileName) => {
    const updatedMediaItems = mediaItems.filter(
      (item) => item.file_name !== fileName
    );
    setMediaItems(updatedMediaItems);
  };

  const handleMediaFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      file: file,
      variant_id: "",
      preview: URL.createObjectURL(file),
     
    }));
    setMediaItems([...mediaItems, ...newFiles]);
   
  };

  const handleFileChange = (e, index) => {
    const selectedFile = e.target.files[0];

    // Create a new media item with the selected file
    const newMediaItem = {
      file_name: selectedFile.name,
      file_size: selectedFile.size,
      file_type: selectedFile.type,
      file: selectedFile,
      variant_id: index,
      preview: URL.createObjectURL(selectedFile),
    };

    // Update the mediaItems state by adding the new media item or replacing the existing one for the variant
    const updatedMediaItems = [...mediaItems];
    updatedMediaItems[index] = newMediaItem;

    setMediaItems(updatedMediaItems);
  };

  const handleRemoveImage = (index) => {
    const updatedMediaItems = [...mediaItems];
    updatedMediaItems.splice(index, 1);
    setMediaItems(updatedMediaItems);
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
          <h2 className="heading">Add Product</h2>
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
                <Formik
                  initialValues={initialValues}
                  validationSchema={addProductValidation}
                  validateOnChange={false}
                  validateOnBlur={true}
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
                                <DragDropContext
                                  onDragEnd={(result) =>
                                    handleImageDragEnd(
                                      result,
                                      values,
                                      setFieldValue
                                    )
                                  }
                                >
                                  <Droppable
                                    droppableId="gallery"
                                    direction="horizontal"
                                  >
                                    {(provided) => (
                                      <div
                                        // className="gallery"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        // style={{
                                        //   display: "flex",
                                        //   overflowX: "auto",
                                        // }}
                                      >
                                        <div className="row mt-4 mb-2">
                                          {mediaItems?.map((media, key) => {
                                            return (
                                              <div className="col-md-3 grid-item">
                                                <Draggable
                                                  key={key}
                                                  draggableId={`Item ${
                                                    key + 1
                                                  }`}
                                                  // draggableId= {option.value}
                                                  index={key}
                                                >
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                    >
                                                      <div
                                                        key={key}
                                                        className="col-md-3 grid-item mt-2"
                                                      >
                                                        <img
                                                          src={
                                                            media.preview
                                                              ? media.preview
                                                              : ""
                                                          }
                                                          width={80}
                                                          height={80}
                                                          alt={`Thumbnail ${key}`}
                                                        />

                                                        <button
                                                          type="button"
                                                          className="btn btn-sm btn-danger mt-2"
                                                          onClick={() =>
                                                            handleMediaRemoveImage(
                                                              media.file_name
                                                            )
                                                          }
                                                        >
                                                          Remove
                                                        </button>
                                                      </div>
                                                    </div>
                                                  )}
                                                </Draggable>
                                              </div>
                                            );
                                          })}
                                        </div>
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                                <div>
                                  {/* <input
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
                                    /> */}
                                  <input
                                    type="file"
                                    name="files"
                                    multiple
                                    onChange={handleMediaFileChange}
                                  />
                                  <FieldArray name="files">
                                    {({ push, remove }) => (
                                      <div className="row mt-4">
                                        {values.files?.map((file, index) => (
                                          <div
                                            key={index}
                                            className="col-md-4 mb-4"
                                          >
                                            {file.type.startsWith("image/") && (
                                              <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index}`}
                                                style={{
                                                  width: "100px",
                                                  height: "100px",
                                                }}
                                              />
                                            )}
                                            {file.type.startsWith("video/") && (
                                              <video
                                                src={URL.createObjectURL(file)}
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
                                  <label htmlFor="price" className="form-label">
                                    Price <span className="text-danger">*</span>
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
                                  <label htmlFor="cost" className="form-label">
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
                                  <label htmlFor="stock" className="form-label">
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
                                  <label htmlFor="width" className="form-label">
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
                          {showVariant && (
                             <div className="card mb-3">
                             <div className="card-body">
                               <div className="row">
                                 <h6>
                                   <b>Variants</b>
                                 </h6>
 
                                 <>
                                 {showAddOptionButton && (
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
                                 )}
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
                                                   {errors.optionName && (
                                                     <small className="text-danger">
                                                       {errors.optionName}
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
                                                       (option, optionIndex) => {
                                                         return (
                                                           <>
                                                             <div
                                                               key={optionIndex}
                                                               className="d-flex justify-content-start mb-2"
                                                             >
                                                               <Field
                                                                 type="text"
                                                                 required={true}
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
                                                             {getErrorMessage(
                                                               optionIndex
                                                             ) && (
                                                               <p className="text-danger">
                                                                 {getErrorMessage(
                                                                   optionIndex
                                                                 )}
                                                               </p>
                                                             )}
                                                             {/* {Object.keys(
                                                               optionErrors
                                                             ).map((index) => (
                                                               <small
                                                                 key={index}
                                                                 className="text-danger"
                                                               >
                                                                 {
                                                                   optionErrors[
                                                                     index
                                                                   ].message
                                                                 }
                                                               </small>
                                                             ))} */}
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
                                       <DragDropContext
                                         onDragEnd={(result) =>
                                           onDragEnd(
                                             result,
                                             values,
                                             setFieldValue
                                           )
                                         }
                                       >
                                         <Droppable droppableId="items">
                                           {(provided) => (
                                             <div
                                               {...provided.droppableProps}
                                               ref={provided.innerRef}
                                             >
                                               <FieldArray name="variantOption">
                                                 {({ push, remove }) => (
                                                   <>
                                                     {options?.map(
                                                       (option, optionIndex) => (
                                                         <Draggable
                                                           key={optionIndex}
                                                           draggableId={`Item ${
                                                             optionIndex + 1
                                                           }`}
                                                           // draggableId= {option.value}
                                                           index={optionIndex}
                                                         >
                                                           {(
                                                             provided,
                                                             snapshot
                                                           ) => (
                                                             <div
                                                               ref={
                                                                 provided.innerRef
                                                               }
                                                               {...provided.draggableProps}
                                                               {...provided.dragHandleProps}
                                                             >
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
                                                                         icon={
                                                                           faBars
                                                                         }
                                                                       />
                                                                     </div>
                                                                     <div>
                                                                       <h6>
                                                                         {
                                                                           option.optionName
                                                                         }
                                                                       </h6>
                                                                       {option.options?.map(
                                                                         (
                                                                           item
                                                                         ) => (
                                                                           <span>
                                                                             {
                                                                               item.value
                                                                             }
                                                                             ,
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
                                                             </div>
                                                           )}
                                                         </Draggable>
                                                       )
                                                     )}
                                                     {provided.placeholder}
                                                   </>
                                                 )}
                                               </FieldArray>
                                             </div>
                                           )}
                                         </Droppable>
                                       </DragDropContext>
                                     </div>
                                   )}
                                 </>
 
                                 <>
                                   {options?.length > 0 &&
                                     showVariantOptions && (
                                       <div className="card mb-3">
                                         <div className="card-body">
                                           <FieldArray name="productVariants">
                                             {({ push, remove }) => (
                                               <>
                                                 {variants?.map(
                                                   (option, variantIndex) => {
                                                     const mediaItem =
                                                             mediaItems.find(
                                                               (item) =>
                                                                 item.variant_id ===
                                                               variantIndex
                                                             ) || {};
                                                     return (
                                                       <div className="d-flex justify-content-between mb-2">
                                                         <div className="d-flex justify-content-between">
                                                           <div className="d-flex">
                                                           {mediaItem.file_name ? (
                                                                   <>
                                                                     <div className="ms-2">
                                                                       <img
                                                                         src={
                                                                           mediaItem.preview
                                                                             ? mediaItem.preview
                                                                             : ""
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
                                                                     <button
                                                                       className="btn  ms-1"
                                                                       onClick={() =>
                                                                         handleRemoveImage(
                                                                           variantIndex
                                                                         )
                                                                       }
                                                                     >
                                                                       <span>
                                                                         <FontAwesomeIcon
                                                                           icon={
                                                                             faTrash
                                                                           }
                                                                         />
                                                                       </span>
                                                                     </button>
                                                                   </>
                                                                 ) : (
                                                                   <>
                                                                     <label
                                                                       htmlFor={`file-upload-${variantIndex}`}
                                                                       className="btn btn-primary ms-2"
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
                                                                       <input
                                                                         id={`file-upload-${variantIndex}`}
                                                                         type="file"
                                                                         onChange={(
                                                                           e
                                                                         ) =>
                                                                           handleFileChange(
                                                                             e,
                                                                             variantIndex
                                                                           )
                                                                         }
                                                                         style={{
                                                                           display:
                                                                             "none",
                                                                         }}
                                                                       />
                                                                     </label>
                                                                   </>
                                                                 )}
                                                           </div>
                                                           <div className="ms-4">
                                                             <Field
                                                               type="text"
                                                               name={`productVariants[${variantIndex}].variantName`}
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
                                                               name={`productVariants[${variantIndex}].variantPrice`}
                                                               placeholder="Price"
                                                               required
                                                               className="form-control"
                                                               style={{
                                                                 width: "100px",
                                                               }}
                                                             />
 
                                                             <ErrorMessage
                                                               name={`productVariants.${variantIndex}.variantPrice`}
                                                               component="div"
                                                               className="text-danger"
                                                             />
                                                           </div>
                                                           <div>
                                                             <Field
                                                               type="number"
                                                               name={`productVariants[${variantIndex}].variantDiscountedPrice`}
                                                               placeholder="Discountde Price"
                                                               required
                                                               className="form-control"
                                                               style={{
                                                                 width: "100px",
                                                               }}
                                                             />
 
                                                             <ErrorMessage
                                                               name={`productVariants.${variantIndex}.variantDiscountedPrice`}
                                                               component="div"
                                                               className="text-danger"
                                                             />
                                                           </div>
                                                           <div className="">
                                                             <Field
                                                               type="number"
                                                               name={`productVariants[${variantIndex}].variantStock`}
                                                               placeholder="Stock"
                                                               required
                                                               className="form-control"
                                                               style={{
                                                                 width: "100px",
                                                               }}
                                                             />
 
                                                             <ErrorMessage
                                                               name={`productVariants.${variantIndex}.variantStock`}
                                                               component="div"
                                                               className="text-danger"
                                                             />
                                                           </div>
                                                         </div>
                                                       </div>
                                                     );
                                                   }
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
                          )}
                         
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
                                />
                                {errors.category && (
                                  <small className="text-danger">
                                    {errors.category}
                                  </small>
                                )}
                                <ErrorMessage name="category" component="div" />
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
                          <button
                            type="submit"
                            className="btn btn-sm mt-2 ms-3 btn-dark"
                            style={{
                              // backgroundColor: "#D93D6E",
                              // color: "white",
                              width: "40%",
                            }}
                          >
                            Save & Close
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddProductNew;
