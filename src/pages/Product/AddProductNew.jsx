import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import QuillEditor from "../../components/Editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
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

const AddProductNew = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [catOption, setCatOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [showVariant, setShowVariant] = useState(false);
  const [addedVariants, setAddedVariants] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [showVariantField, setShowVariantField] = useState(false);
  const [variantErrors, setVariantErrors] = useState(true);
  const [propertyOption, setPropertyOption] = useState({});
  const [showVariantPills, setShowVariantPills] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [images, setImages] = useState([]);
  const [options,setOptions] = useState([])
  const [showOptionForm,setShowOptionForm] = useState(false);
  const [showOptions,setShowOptions] = useState(false);

  // const brandOptions = []
  const catOptions = [];

  const initialValues = {
    name: "",
    description: "",
    // field: "",
    variants: [],
    productVariant: [],
    // options: [
    //   { name: "Size", values: [] },
    //   { name: "Color", values: [] },
    // ],
    files: [],
    // variantImages: []

    // variants: [
    //   { name: "", options: [] },

    // ],
    options: [{}, {}, {}],
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
    const mergedArray = values.productVariant.map((variant, index) => ({
      ...variant,
      image: images[index],
      variantName: selectedVariants[index],
      // variantName: selectedVariants[index]// Assuming images is an array of image objects or URLs
    }));
    // values.variantImages = images
    values.productVariant = mergedArray;

    if (typeof values?.meta_keywords === "string") {
      const metaKeyword = values?.meta_keywords?.split(", ");
      values.meta_keywords = metaKeyword;
    }

   //  console.log(errors)
    const res = await dispatch(addProduct({ values })).unwrap();
    if (res) {
      toast.success("Product created successfully!");
      navigate("/product");
    }
  };

  const handleVariantSubmission = (values, errors) => {
    //  console.log(errors);

    setShowDone(true);
    if (errors.variants) {
      setVariantErrors(true);
    } else {
      setVariantErrors(false);
    }
    console.log(values.variants);
    console.log(addedVariants);
    // selectedVariants.map((variant,index) =>   )
    const filteredVariants = values.variants.filter((variant) => {
   
      if (variant) {
        // Check if the variant with the same name already exists in addedVariants
        const existingVariantIndex = addedVariants.findIndex(
          (property) =>
            property.name === variant.name ||
            (variant.name === "Custom" && variant.customName === property.name)
        );
        if (existingVariantIndex === -1) {
          // Variant does not exist, add it to addedVariants
          let newVariant;
          if (variant.name === "Custom") {
            newVariant = {
              name: variant.customName,
              options: [...variant.options],
            };
          } else {
            newVariant = { name: variant.name, options: [...variant.options] };
          }
          setAddedVariants([...addedVariants, newVariant]);
        } else {
          // Variant already exists, update its options
          const updatedVariants = addedVariants.map((variantItem, index) => {
            if (index === existingVariantIndex) {
              const mergedOptions = [
                ...new Set([...variantItem.options, ...variant.options]),
              ];
              return { ...variantItem, options: mergedOptions };
            }
            return variantItem;
          });
          setAddedVariants(updatedVariants);
        }
      } else {
        console.log("Variant is invalid:", variant);
        // Handle the case where the variant is invalid, such as showing an error message
      }
    });
   

    setShowVariant(true);
  };

  // useEffect to perform actions dependent on addedVariants
  useEffect(() => {
    const variantNames = [];
    // console.log(addedVariants);
    const options = addedVariants?.map((variant) => variant.options);

    const generateVariantNames = (currentIndex, currentName) => {
      if (currentIndex === addedVariants.length) {
        variantNames.push(currentName.trim());
      } else {
        options[currentIndex].forEach((option) => {
          const newName = currentName + option + " ";
          generateVariantNames(currentIndex + 1, newName);
        });
      }
    };
    generateVariantNames(0, "");
    //  console.log(values.variant)
    const addedVariantOptions = [];
    addedVariants?.map((variant) => {
      variant.options?.map((option) => {
        // console.log(option)
        addedVariantOptions.push(option);
      });
    });

    setVariantOptions(addedVariantOptions);
    setSelectedVariants(variantNames);
  }, [addedVariants]);

 

  // console.log(showVariant);
  //  console.log(selectedVariants);

  const generateVariantName = (selectedOptions) => {
    return selectedOptions?.map((option) => option.values?.join(" ")).join(" ");
  };

  const handleReset = () => {
    setShowVariant(false);
    // console.log()
  };

  // console.log(addedVariants);

  const removeOption = (option) => {
    const deleteVariants = [];
    const filteredVariants = selectedVariants?.filter(
      (variant) => !variant.includes(option)
    );

    const filteredOptions = variantOptions?.filter(
      (variantOption) => !variantOption.includes(option)
    );
    // console.log(filteredOptions);
    setSelectedVariants(filteredVariants);
    // setAddedVariants(filteredAddedVariants)
    setVariantOptions(filteredOptions);
  };


  

  const handleFileChange = (e, index) => {
    const selectedFile = e.target.files[0];

    // Update the images state with the selected file for the specific row
    const updatedImages = [...images];
    updatedImages[index] = selectedFile;
    setImages(updatedImages);
  };

  const goBack = () => {
    window.history.back();
  };

  const handleOptionDelete = (values) => {
    values.optionName = '';
    values.options = [{},{},{}]
    setShowOptionForm(false);
  }

  const handleOptiondone = (values) => {
      // console.log(values);
      setOptions((prev) => [
        ...prev,
        {
          optionName: values.optionName,
          options: values.options
        }

      ])
      values.optionName = '';
      values.options = [{},{},{}]
      setShowOptionForm(false);
      setShowOptions(true);
    
  }
  console.log(options)

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
                  // validateOnChange={true}
                  // validateOnBlur={true}
                  // validateOnSubmit={true}
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
                              <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                  Media
                                </label>
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
                                        {values.files.map((file, index) => (
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

                          <div className="card mb-3">
                            <div className="card-body">
                              <div className="row">
                                <h6>
                                  <b>Variants</b>
                                </h6>

                                <>
                                  <a
                                    onClick={() => {
                                      // console.log(errors);
                                      setShowOptionForm(true);
                                    }}
                                    // className="btn btn-sm btn-success mb-2 mt-2"
                                    style={{
                                      color: "blue",
                                      "text-decoration": "underline",
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
                                                            <ErrorMessage
                                                              name={`options.${optionIndex}.value`}
                                                              component="div"
                                                              className="text-danger"
                                                            />
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
                                              <button  type="button" className="btn btn-sm btn-outline-dark"  onClick={() => handleOptionDelete(values)}>Delete</button>
                                              <button  type="button" onClick={() => handleOptiondone(values)} className="btn btn-sm btn-dark ms-2">Done</button>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </>

                              <>
                               
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
                                  <option value="">Status</option>
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
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
                          <div className="card mb-3">
                            <div className="card-body">
                              <div>
                                <label
                                  htmlFor="allow_out_of_stock_purchase"
                                  className="form-label"
                                >
                                  Allow Out Of Stock Purchase:
                                </label>
                                <Field
                                  as="select"
                                  id="allow_out_of_stock_purchase"
                                  name="allow_out_of_stock_purchase"
                                  // placeholder="Select label"
                                  className="form-select"
                                  onChange={() => console.log(errors)}
                                >
                                  <option value="">Select </option>
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                                  {/* Add more options as needed */}
                                </Field>
                                <ErrorMessage
                                  name="allow_out_of_stock_purchase"
                                  component="div"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <button
                            className="btn btn-primary btn-md  mb-4 rounded-2"
                            type="submit"
                            // disabled={isSubmitting}
                          >
                            Create Product
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
