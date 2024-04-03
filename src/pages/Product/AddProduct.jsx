import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import Layout from "../../components/layouts/Layout";
import QuillEditor from "../../components/Editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import MultiSelectDropdown from "../../components/MultiSelectDropDown";
import MultipleKeywordInput from "../../components/MultipleKeywordInput";
import VariantSelect from "../../components/VariantSelect";
import CustomField from "../../components/VariantSelect";
import SelectOrTextInput from "../../components/VariantSelect";
import { addProductValidation } from "../../validations/addProductValidation";
import { fetchAllCategories } from "../../features/category/categorySlice";
import { useDispatch } from "react-redux";
import { fetchAllBrands } from "../../features/brand/brandSlice";

const AddProduct = () => {
  const dispatch = useDispatch();
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

  // const brandOptions = []
  const catOptions = [];

  const initialValues = {
    name: "",
    description: "",
    field: "",
    variants: [],
    productVariant: [{ variantSKU: '', variantPrice: '', variantStock: '' }] ,
    options: [
      { name: "Size", values: [] },
      { name: "Color", values: [] },
    ],
    files: [],
    // variants: [
    //   { name: "Color", options: ["Red", "Blue"] },
    //   { name: "Size", options: ["Small", "Medium", "Large"] },
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

  useEffect(() => {
    fetchBrand();
  }, [dispatch]);

  const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const handleSubmit = async (values) => {
    // console.log(values);
    console.log(selectedVariants);
    // console.log(errors)
    // const res = await dispatch(addCategory(values)).unwrap();
    // if(res) {
    //   toast.success('Category created successfully!')
    //   navigate('/category')
    // }
  };

  const handleVariantSubmission = (values, errors) => {
    //  console.log(values);
    if (errors.variants) {
      setVariantErrors(true);
    } else {
      setVariantErrors(false);
    }

    const variantNames = [];
    const options = values.variants.map((variant) => variant.options);

    const generateVariantNames = (currentIndex, currentName) => {
      if (currentIndex === values.variants.length) {
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
    values.variants?.map((variant) => {
      variant.options?.map((option) => {
        // console.log(option)
        addedVariantOptions.push(option);
      });
    });

    setVariantOptions(addedVariantOptions);
    setSelectedVariants(variantNames);
    setAddedVariants(values.variants);
    setShowVariant(true);
  };
  console.log(selectedVariants);

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

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <h4>Add Product</h4>

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
                  validateOnSubmit={true}
                  onSubmit={(values, errors) => {
                    console.log(errors);
                    handleSubmit(values);
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
                              <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                  Short Description
                                </label>
                                <Field
                                  as="textarea"
                                  name="short_description"
                                  className="form-control"
                                  rows="2" // Set the number of rows for the textarea
                                  cols="50" // Set the number of columns for the textarea
                                  placeholder="Enter short description"
                                />
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
                                {values.meta_keywords &&
                                  values.meta_keywords
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
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
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
                                                        >
                                                          <option value="">
                                                            Select Variant
                                                          </option>
                                                          <option value="Color">
                                                            Color
                                                          </option>
                                                          <option value="Size">
                                                            Size
                                                          </option>
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
                                                          onClick={() =>
                                                            remove(index)
                                                          }
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
                                                                          onClick={() =>
                                                                            removeOption(
                                                                              optionIndex
                                                                            )
                                                                          }
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
                                              console.log(errors);
                                              setShowVariantField(true);
                                              push({ name: "", options: [] });
                                            }}
                                            className="btn btn-sm btn-success mb-2 mt-2"
                                            style={{ maxWidth: "100px" }}
                                          >
                                            Add Variant
                                          </button>
                                          {!errors.variants && (
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
                                                  {selectedVariant.name ==
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
                                  <div className="row  table-responsive">
                                    <table class="table">
                                      <thead>
                                        <tr>
                                          {/* <th scope="col">#</th> */}
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
                                        </tr>
                                      </thead>
                                      <tbody>

                                        {selectedVariants?.map(
                                          (variant, index) => {
                                            return (

                                              <tr>
                                                <td style={{ width: "200px" }}>
                                                  {/* {variant} */}
                                                  <Field
                                                    type="text"
                                                    value={variant}
                                                    name={`productVariant.${index}.variantName`}
                                                  />
                                                  {/* <ErrorMessage
                                                        name={`productVariant.${index}.variantName`}
                                                        component="div"
                                                        className="text-danger"
                                                      /> */}
                                                  {/* {`errors.productVariant[${index}].variantName` && (
                                                        <small className="text-danger">
                                                          {`errors.productVariant[${index}].variantName`}
                                                        </small>
                                                      )} */}
                                                </td>

                                                <td>
                                                  <Field
                                                    type="text"
                                                    name={`productVariant${index}.variantSKU`}
                                                  />
                                                  {/* {errors.productVariant &&
                                                    errors.productVariant[index] &&
                                                    errors.productVariant[index]
                                                      .variantSKU && (
                                                      <div className="text-danger">
                                                        {
                                                          errors
                                                            .productVariant[index]
                                                            .variantSKU
                                                        }
                                                      </div>
                                                    )} */}
                                                     <ErrorMessage
                                                        name={`productVariant.${index}.variantSKU`}
                                                        component="div"
                                                        className="text-danger"
                                                      />
                                                </td>
                                                <td>
                                                  <Field
                                                    type="number"
                                                    name={`productVariant.${index}.variantPrice`}
                                                  />
                                                 {/* {errors.productVariant &&
                                                    errors.productVariant[index] &&
                                                    errors.productVariant[index]
                                                      .variantPrice && (
                                                      <div className="text-danger">
                                                        {
                                                          errors
                                                            .productVariant[index]
                                                            .variantPrice
                                                        }
                                                      </div>
                                                    )} */}
                                                    <ErrorMessage
                                                        name={`productVariant.${index}.variantPrice`}
                                                        component="div"
                                                        className="text-danger"
                                                      />
                                                </td>
                                                <td>
                                                  <Field
                                                    type="number"
                                                    name={`productVariant.${index}.variantStock`}
                                                  />
                                                   {/* {errors.productVariant &&
                                                    errors.productVariant[index] &&
                                                    errors.productVariant[index]
                                                      .variantStock && (
                                                      <div className="text-danger">
                                                        {
                                                          errors
                                                            .productVariant[index]
                                                            .variantStock
                                                        }
                                                      </div>
                                                    )} */}
                                                     <ErrorMessage
                                                        name={`productVariant.${index}.variantStock`}
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
                                  <option value="1">Yes</option>
                                  <option value="0">No</option>
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
                                  id="brand"
                                  name="brand"
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
                                {errors.brand && (
                                  <small className="text-danger">
                                    {errors.brand}
                                  </small>
                                )}
                                <ErrorMessage name="brand" component="div" />
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
                                >
                                  <option value="">Select </option>
                                  <option value="1">Yes</option>
                                  <option value="0">No</option>
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
