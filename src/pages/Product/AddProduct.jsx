import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import Layout from "../../components/layouts/Layout";
import { addCategoryValidation } from "../../validations/addCategoryValidation";
import QuillEditor from "../../components/Editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import MultiSelectDropdown from "../../components/MultiSelectDropDown";
import MultipleKeywordInput from "../../components/MultipleKeywordInput";
import VariantSelect from "../../components/VariantSelect";
import CustomField from "../../components/VariantSelect";
import SelectOrTextInput from "../../components/VariantSelect";

const AddProduct = () => {
  const options = [
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "grocery", label: "Grocery" },
  ];
  const variantOptions = [
    { value: "size", label: "Size" },
    { value: "color", label: "Color" },
  ];
  const initialValues = {
    name: "",
    description: "",
    field: "",
  };

  const handleSubmit = async (values) => {
    console.log(values);
    // const res = await dispatch(addCategory(values)).unwrap();
    // if(res) {
    //   toast.success('Category created successfully!')
    //   navigate('/category')
    // }
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
                     validationSchema={addCategoryValidation}
                  onSubmit={(values) => {
                    console.log(values);
                    handleSubmit(values);
                  }}
                >
                  {({ values, errors, setFieldValue }) => (
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
                                <h6>Variants</h6>
                                <FieldArray name="variants">
                                  {({ push, remove }) => (
                                    <div>
                                      {values.variants?.map(
                                        (variant, index) => (
                                          <div key={index} className="d-flex justify-content-between">
                                            <div>
                                              <label
                                                htmlFor={`variants.${index}.option`}
                                              >
                                                Option
                                              </label>

                                             <Field
                                                type="text"
                                                name={`variants.${index}.option`}
                                                // className="form-input"

                                            />

                                              <ErrorMessage
                                                name={`variants.${index}.option`}
                                                component="div"
                                                className="text-danger"
                                              />
                                            </div>

                                            <button
                                              type="button"
                                              className="btn btn-sm btn-danger"
                                              onClick={() => remove(index)}
                                            >
                                              Remove Variant
                                            </button>
                                          </div>
                                        )
                                      )}
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        onClick={() =>
                                          push({ option: "" })
                                        }
                                      >
                                        Add Variant
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>
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
                                <ErrorMessage
                                  name="published"
                                  component="div"
                                />
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
                                  options={options}
                                />
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
                                  <option value="samsung">Samsung</option>
                                  <option value="gucci">Gucci</option>
                                  {/* Add more options as needed */}
                                </Field>
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
