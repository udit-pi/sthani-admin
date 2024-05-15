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

const AddProduct = () => {
    const dispatch = useDispatch();
     const navigate = useNavigate()

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
  const [propertyOption, setPropertyOption] = useState([]);
  const [showVariantPills, setShowVariantPills] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [images, setImages] = useState([]);

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
      image: images[index] ,
      variantName: selectedVariants[index]
      // variantName: selectedVariants[index]// Assuming images is an array of image objects or URLs
    }));
    // values.variantImages = images
    values.productVariant = mergedArray

    if(typeof values?.meta_keywords === 'string' ) {
      const metaKeyword =  values?.meta_keywords?.split(', ');
      values.meta_keywords = metaKeyword
    }

    // if(values.allow_out_of_stock_purchase === "true") {
    //   values.allow_out_of_stock_purchase = true
    // } else {
    //   values.allow_out_of_stock_purchase = false
    // }
   
    // console.log(mergedArray)
   
     console.log(errors);
    // console.log(selectedVariants);
    // console.log(images)
     console.log(values)
    //  console.log(errors)
    const res = await dispatch(addProduct({values})).unwrap();
    if(res) {
      toast.success('Product created successfully!')
      navigate('/product')
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
      // Check if variant name exists in addedVariants
      // if(variant.name === 'Custom') {
      //   return !addedVariants.some(addedVariant => addedVariant.name === variant.customName);
      // }
      // return !addedVariants.some(addedVariant => addedVariant.name === variant.name);

      // if (variant) {
      //   // Check if the variant with the same name already exists in addedVariants

      //   const variantExists = addedVariants.some(property => property.name === variant.name || (variant.name === "Custom" && variant.customName === property.name));
      //   console.log(variantExists)
      //   if (!variantExists) {
      //     console.log(variant);
      //     if(variant.name === 'Custom') {
      //       let updatedOptions = [...variant.options];
      //       setAddedVariants([...addedVariants, { name: variant.customName, options: updatedOptions }]);
      //     } else {
      //       setAddedVariants([...addedVariants, { name: variant.name, options: variant.options }]);
      //     }

      //   } else {
      //     console.log("Variant already exists:", variant.name);
      //     // Handle the case where the variant already exists, such as showing an error message
      //   }
      // }

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
    // console.log(filteredVariants)
    // setAddedVariants([...addedVariants, ...filteredVariants]);
    // setAddedVariants(prevAddedVariants => [...prevAddedVariants, ...filteredVariants]);
    // setAddedVariants(updatedVariants)
    // console.log(addedVariants)
    //   setAddedVariants([...addedVariants, ...filteredVariants]);
    //  console.log(addedVariants)

    // setShowVariantPills(true)
    // console.log(addedVariants)

    // const variantNames = [];
    //   console.log(selectedVariants);
    //   const options = addedVariants?.map((variant) => variant.options);

    //   const generateVariantNames = (currentIndex, currentName) => {
    //     if (currentIndex === addedVariants.length) {
    //       variantNames.push(currentName.trim());
    //     } else {
    //       options[currentIndex].forEach((option) => {
    //         const newName = currentName + option + " ";
    //         generateVariantNames(currentIndex + 1, newName);
    //       });
    //     }
    //   };
    //   generateVariantNames(0, "");
    //   //  console.log(values.variant)
    //   const addedVariantOptions = [];
    //   addedVariants?.map((variant) => {
    //     variant.options?.map((option) => {
    //       // console.log(option)
    //       addedVariantOptions.push(option);
    //     });
    //   });

    //   setVariantOptions(addedVariantOptions);
    //   setSelectedVariants(variantNames);

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

  const renderVariantsByGroup = (groupName) => {
    return selectedVariants
      .filter((variant) => variant.name === groupName)
      .map((variant, index) => (
        <li key={index}>
          <strong>{variant.customName || variant.name}</strong>:{" "}
          {variant.options.join(", ")}
        </li>
      ));
  };

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

  const handleSelectChange = (e, index) => {
    // e.preventDefault();

    // console.log(e.target.value);
    // console.log(propertyOption)
    setShowDone(true);
    const variant = propertyOption?.find(
      (property) => property.name === e.target.value
    );

    if (variant) {
      // Check if the variant with the same name already exists in addedVariants
      const variantExists = addedVariants.some(
        (property) =>
          property.name === variant.name ||
          (property.name === "Custom" && property.customName === variant.name)
      );

      if (!variantExists) {
        // console.log(variant);
        setAddedVariants([
          ...addedVariants,
          { name: variant.name, options: variant.options },
        ]);
      } else {
        console.log("Variant already exists:", variant.name);
        // Handle the case where the variant already exists, such as showing an error message
      }
    }

    // console.log(addedVariants);
    //  setShowVariant(true);
  };
               
  const handleVariantDelete = (values, index) => {
    // console.log(index)
    setAddedVariants((prevVariants) =>
      prevVariants.filter((_, i) => i !== index)
    );
    // setAddedVariants(values.variants)
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

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
      
          
      <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
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
                                  Name
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
                                <label
                                  htmlFor="meta_title"
                                  className="form-label"
                                >
                                  Meta Title
                                </label>
                                <Field
                                  type="name"
                                  className="form-control"
                                  id="meta_title"
                                  name="meta_title"
                                  aria-describedby="nameHelp"
                                ></Field>
                                {errors.meta_title && (
                                  <small className="text-danger">
                                    {errors.meta_title}
                                  </small>
                                )}
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="meta_description"
                                  className="form-label"
                                >
                                  Meta Description
                                </label>
                                <Field
                                  name="meta_description"
                                  component={QuillEditor}
                                />
                              </div>
                              {/* <FieldArray name="meta_keywords">
                                {({ push, remove }) => (
                                  <div>
                                    <label
                                      htmlFor="meta_keywords"
                                      className="form-label"
                                      style={{ marginRight: "10px" }}
                                    >
                                      Meta Keywords
                                    </label>
                                    {values.meta_keywords?.map(
                                      (keyword, index) => (
                                        <div key={index} className="d-flex">
                                          <Field
                                            name={`meta_keywords.${index}`}
                                            className="form-control"
                                          />
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => remove(index)}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )
                                    )}
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-success"
                                      onClick={() => push("")}
                                    >
                                      Add Keywords
                                    </button>
                                  </div>
                                )}
                              </FieldArray> */}
                              <div>
                                <label
                                  htmlFor="meta_keywords"
                                  className="form-label"
                                >
                                  Meta Keywords
                                </label>
                                <Field
                                  name="meta_keywords"
                                  type="text"
                                  placeholder="Enter keywords separated by commas"
                                  className="form-control"
                                />
                                <ErrorMessage
                                  name="meta_keywords"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="mt-2">
                                {values?.meta_keywords && typeof values.meta_keywords === 'string' &&
                                  values?.meta_keywords?.split(', ').map((keyword, index) => (
                                      <span
                                        key={index}
                                        className="badge bg-secondary me-1"
                                      >
                                        {keyword.trim()}
                                      </span>
                                    ))}
                              </div>
                            </div>
                          </div>
                          <div className="card mb-3">
                            <div className="card-body">
                              <label
                                htmlFor="meta_keywords"
                                className="form-label"
                              >
                                SKU
                              </label>
                              <Field
                                name="sku"
                                type="text"
                                placeholder=""
                                className="form-control"
                              />
                              {errors.sku && (
                                <small className="text-danger">
                                  {errors.sku}
                                </small>
                              )}
                              <FieldArray name="additional_properties">
                                {({ push, remove }) => (
                                  <div>
                                    <label
                                      htmlFor="additional_properties"
                                      className="form-label mt-4"
                                      style={{ marginRight: "10px" }}
                                    >
                                      Additional Properties
                                    </label>
                                    {values.additional_properties?.map(
                                      (keyword, index) => (
                                        <div
                                          key={index}
                                          className="d-flex justify-content-between"
                                        >
                                          <label htmlFor="value">Value:</label>
                                          <Field
                                            name={`additional_properties.${index}.value`}
                                            className="form-control"
                                            style={{
                                              maxWidth: "300px",
                                              maxHeight: "30px",
                                            }}
                                          />
                                          <div>
                                            <label htmlFor="label">
                                              Label:
                                            </label>
                                            <Field
                                              as="select"
                                              id="label"
                                              name={`additional_properties.${index}.label`}
                                              placeholder="Select label"
                                              //  className="form-select"
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
                                          <button
                                            className="btn btn-sm btn-danger ms-1"
                                            onClick={() => remove(index)}
                                          >
                                            <span>
                                              <FontAwesomeIcon icon={faTrash} />
                                            </span>
                                          </button>
                                        </div>
                                      )
                                    )}
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-success"
                                      onClick={() => push("")}
                                    >
                                      Add Properties
                                    </button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          </div>
                          <div className="card mb-3">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6">
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
                                <div className="col-md-6">
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
                              </div>
                              <div className="row mt-3">
                                <div className="col-md-6">
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
                                <div className="col-md-6">
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
                              </div>
                            </div>
                          </div>
                          <div className="card mb-3">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6">
                                  <label
                                    htmlFor="quantity_default"
                                    className="form-label"
                                  >
                                    Default Quantity
                                  </label>
                                  <Field
                                    type="number"
                                    className="form-control"
                                    id="quantity_default"
                                    name="quantity_default"
                                    aria-describedby="nameHelp"
                                  ></Field>
                                  {errors.quantity_default && (
                                    <small className="text-danger">
                                      {errors.quantity_default}
                                    </small>
                                  )}
                                </div>
                                <div className="col-md-6">
                                  <label
                                    htmlFor="quantity_min"
                                    className="form-label"
                                  >
                                    Minimum Quantity
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
                                      {errors.quantity_min}
                                    </small>
                                  )}
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-md-6">
                                  <label
                                    htmlFor="quantity_max"
                                    className="form-label"
                                  >
                                    Maximum Quantity
                                  </label>
                                  <Field
                                    type="number"
                                    className="form-control"
                                    id="quantity_max"
                                    name="quantity_max"
                                    aria-describedby="nameHelp"
                                  ></Field>
                                  {errors.quantity_max && (
                                    <small className="text-danger">
                                      {errors.quantity_max}
                                    </small>
                                  )}
                                </div>
                                <div className="col-md-6">
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
                            </div>
                          </div>
                          <div className="card mb-3">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6">
                                  <label htmlFor="price" className="form-label">
                                    Price
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
                                <div className="col-md-6">
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
                                <div className="col-md-6">
                                  <label
                                    htmlFor="price_includes_tax"
                                    className="form-label"
                                  >
                                    Price Includes Tax:
                                  </label>
                                  <Field
                                    as="select"
                                    id="price_includes_tax"
                                    name="price_includes_tax"
                                    // placeholder="Select label"
                                    className="form-select"
                                  >
                                    <option value="">Select </option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                    {/* Add more options as needed */}
                                  </Field>
                                  <ErrorMessage
                                    name="price_includes_tax"
                                    component="div"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card mb-3">
                            <div className="card-body">
                              <div className="row">
                                <h6>Product Variant</h6>

                                <FieldArray name="variants">
                                  {({ push, remove }) => (
                                    <>
                                      {!showVariant && (
                                        <>
                                          {values.variants.map(
                                            (variant, index) => {
                                              return (
                                                <>
                                                  {showVariantField && (
                                                    <div
                                                      key={index}
                                                      className="mb-2"
                                                    >
                                                      <div className="d-flex">
                                                        <Field
                                                          as="select"
                                                          name={`variants[${index}].name`}
                                                          placeholder="Variant Name"
                                                          className="form-select"
                                                          onChange={(e) => {
                                                            setFieldValue(
                                                              `variants[${index}].name`,
                                                              e.target.value
                                                            );
                                                            handleSelectChange(
                                                              e,
                                                              index
                                                            );
                                                          }}
                                                        >
                                                          <option value="">
                                                            Select Variant
                                                          </option>
                                                          {/* <option value="Color">
                                                            Color
                                                          </option>
                                                          <option value="Size">
                                                            Size
                                                          </option> */}
                                                          {propertyOption.map(
                                                            (property) => {
                                                              return (
                                                                <option
                                                                  value={
                                                                    property.name
                                                                  }
                                                                >
                                                                  {
                                                                    property.name
                                                                  }
                                                                </option>
                                                              );
                                                            }
                                                          )}
                                                          <option value="Custom">
                                                            Custom
                                                          </option>
                                                          {/* Allow adding custom variants */}
                                                        </Field>
                                                        {/* {`errors.variants[index].name` && (
                                                  <small className="text-danger">
                                                    {`errors.variants[index].name`}
                                                  </small>
                                                )} */}

                                                        {variant.name ===
                                                          "Custom" && (
                                                          <Field
                                                            type="text"
                                                            name={`variants[${index}].customName`}
                                                            placeholder="Custom Variant Name"
                                                            className="form-control ms-2"
                                                          />
                                                        )}
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            remove(index);
                                                            handleVariantDelete(
                                                              values,
                                                              index
                                                            );
                                                          }}
                                                          className="btn btn-sm btn-danger mt-2 ms-2"
                                                        >
                                                          <span>
                                                            <FontAwesomeIcon
                                                              icon={faTrash}
                                                            />
                                                          </span>
                                                        </button>
                                                      </div>
                                                      <ErrorMessage
                                                        name={`variants.${index}.name`}
                                                        component="div"
                                                        className="text-danger"
                                                      />
                                                      {/* {errors.variants.name && (
                                                        <small className="text-danger">
                                                          {errors.variants.name}
                                                        </small>
                                                      )} */}

                                                      {variant.name && (
                                                        <div className="mt-2 mb-2">
                                                          {variant.name ===
                                                            "Custom" && (
                                                            <FieldArray
                                                              name={`variants[${index}].options`}
                                                            >
                                                              {({
                                                                push: pushOption,
                                                                remove:
                                                                  removeOption,
                                                              }) => (
                                                                <>
                                                                  {variant.options.map(
                                                                    (
                                                                      option,
                                                                      optionIndex
                                                                    ) => (
                                                                      <>
                                                                        <div
                                                                          key={
                                                                            optionIndex
                                                                          }
                                                                          className="d-flex justify-content-start mt-2"
                                                                        >
                                                                          <Field
                                                                            name={`variants[${index}].options[${optionIndex}]`}
                                                                            placeholder="Option"
                                                                            className="form-control"
                                                                            style={{
                                                                              width:
                                                                                "300px",
                                                                            }}
                                                                          />

                                                                          <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                              removeOption(
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
                                                                          name={`variants.${index}.options.${optionIndex}`}
                                                                          component="div"
                                                                          className="text-danger"
                                                                        />
                                                                      </>
                                                                    )
                                                                  )}

                                                                  <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                      pushOption(
                                                                        ""
                                                                      );
                                                                      console.log();
                                                                    }}
                                                                    className="btn btn-sm btn-success mt-2"
                                                                  >
                                                                    Add Option
                                                                  </button>
                                                                </>
                                                              )}
                                                            </FieldArray>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  )}
                                                </>
                                              );
                                            }
                                          )}

                                          <button
                                            type="button"
                                            onClick={() => {
                                              // console.log(errors);
                                              setShowVariantField(true);
                                              push({ name: "", options: [] });
                                            }}
                                            className="btn btn-sm btn-success mb-2 mt-2"
                                            style={{ maxWidth: "100px" }}
                                          >
                                            Add Variant
                                          </button>
                                          {!errors.variants && showDone && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleVariantSubmission(
                                                  values,
                                                  errors
                                                )
                                              }
                                              disabled={errors.variants}
                                              className="btn btn-sm btn-primary"
                                            >
                                              Done
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </FieldArray>
                                {showVariant && (
                                  <div>
                                    <FieldArray name="addedVariants">
                                      {({
                                        push,
                                        remove: removeSelectedVariant,
                                      }) => (
                                        <>
                                          {addedVariants?.map(
                                            (selectedVariant, varIndex) => (
                                              <div
                                                className="border mb-2"
                                                key={varIndex}
                                              >
                                                <label
                                                  htmlFor="published"
                                                  className="form-label"
                                                >
                                                  {selectedVariant.name ===
                                                  "Custom"
                                                    ? selectedVariant.customName
                                                    : selectedVariant.name}
                                                </label>
                                                <div className="d-flex">
                                                  {selectedVariant.options?.map(
                                                    (option) => (
                                                      <div
                                                        className="badge rounded-pill text-bg-secondary ms-2"
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                          removeOption(option)
                                                        }
                                                      >
                                                        {option}
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                                {/* <button
                                                  type="button"
                                                  onClick={() =>
                                                    removeSelectedVariant(
                                                      varIndex
                                                    )
                                                  }
                                                >
                                                  Remove Variant
                                                </button> */}
                                              </div>
                                            )
                                          )}
                                        </>
                                      )}
                                    </FieldArray>
                                  </div>
                                )}

                                {showVariant && (
                                  <FieldArray name="productVariant">
                                    <div className="row table-responsive">
                                      <table className="table">
                                        <thead>
                                          <tr>
                                            {/* <th scope="col">#</th> */}
                                            <th
                                              scope="col"
                                              style={{ width: "200px" }}
                                            >
                                              Image
                                            </th>
                                            <th
                                              scope="col"
                                              style={{ width: "200px" }}
                                            >
                                              Variant
                                            </th>
                                            <th
                                              scope="col"
                                              style={{ width: "100px" }}
                                            >
                                              SKU
                                            </th>
                                            <th
                                              scope="col"
                                              style={{ width: "100px" }}
                                            >
                                              Price
                                            </th>
                                            <th
                                              scope="col"
                                              style={{ width: "100px" }}
                                            >
                                              Stock
                                            </th>
                                            <th
                                              scope="col"
                                              style={{ width: "100px" }}
                                            >
                                              Discounted Price
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {selectedVariants?.map(
                                            (variant, productIndex) => {
                                              return (
                                                <tr key={productIndex}>
                                                  <td className="d-flex">
                                                    <label
                                                      htmlFor={`file-upload-${productIndex}`}
                                                      style={{"cursor": "pointer"}}
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={faUpload}
                                                      />
                                                      
                                                    </label>
                                                    <input
                                                      id={`file-upload-${productIndex}`}
                                                      type="file"
                                                      onChange={(e) =>
                                                        handleFileChange(
                                                          e,
                                                          productIndex
                                                        )
                                                      }
                                                      style={{
                                                        display: "none",
                                                      }} // Hide the input element
                                                    />

                                                    {/* Thumbnail preview */}
                                                    {images[productIndex] && (
                                                      <div className="ms-2">
                                                        <img
                                                          src={URL.createObjectURL(
                                                            images[productIndex]
                                                          )}
                                                          width={50}
                                                          height={50}
                                                          alt={`Thumbnail ${productIndex}`}
                                                        />
                                                      </div>
                                                    )}
                                                  </td>
                                                  <td>
                                                    <Field
                                                      type="text"
                                                      value={variant}
                                                      name={`productVariant[${productIndex}].variantName`}
                                                    />
                                                    </td>

                                                  <td>
                                                    <Field
                                                      type="text"
                                                      name={`productVariant[${productIndex}].variantSKU`}
                                                    />
                                                    {/* {errors.productVariant &&
                                                      errors.productVariant[
                                                        productIndex
                                                      ] &&
                                                      errors.productVariant[
                                                        productIndex
                                                      ].variantSKU && (
                                                        <small className="text-danger">
                                                          {
                                                            errors
                                                              .productVariant[
                                                              productIndex
                                                            ].variantSKU
                                                          }
                                                        </small>
                                                      )} */}

                                                    <ErrorMessage
                                                      name={`productVariant.${productIndex}.variantSKU`}
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </td>
                                                  <td>
                                                    <Field
                                                      type="number"
                                                      name={`productVariant[${productIndex}].variantPrice`}
                                                    />

                                                    <ErrorMessage
                                                      name={`productVariant.${productIndex}.variantPrice`}
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </td>
                                                  <td>
                                                    <Field
                                                      type="number"
                                                      name={`productVariant[${productIndex}].variantStock`}
                                                    />

                                                    <ErrorMessage
                                                      name={`productVariant.${productIndex}.variantStock`}
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </td>
                                                  <td>
                                                    <Field
                                                      type="number"
                                                      name={`productVariant[${productIndex}].variantDiscountedPrice`}
                                                    />

                                                    <ErrorMessage
                                                      name={`productVariant.${productIndex}.variantDiscountedPrice`}
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </tbody>
                                      </table>

                                      <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() => {
                                          handleReset();
                                          console.log(errors);
                                          console.log(values);
                                        }}
                                      >
                                        Edit Variants
                                      </button>
                                    </div>
                                  </FieldArray>
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

export default AddProduct;
