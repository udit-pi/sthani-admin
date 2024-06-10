import React, { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  useFormik,


} from "formik";
import { Select, Creatable } from 'react-select';
import { Link, useNavigate, useParams } from "react-router-dom";
import MultiSelectDropdown from "../../components/MultiSelectDropDown2"; //Note using second version
import ImageUploadPreview from "../../components/ImageUploadPreview";
import Layout from "../../components/layouts/Layout";
import QuillEditor from "../../components/Editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { addProductValidation } from "../../validations/addProductValidation";
import { fetchAllCategories } from "../../features/category/categorySlice";
import { useDispatch } from "react-redux";
import { fetchAllBrands } from "../../features/brand/brandSlice";
import { FaArrowLeft } from "react-icons/fa";


import {
  addProduct,
  fetchProductById,
  updateProduct,
  deleteProduct
} from "../../features/product/productSlice";




import DraggableMediaGallery from '../../components/DraggableMediaGallery';
const mediaFolder = process.env.REACT_APP_MEDIA_URL;
const debugMode = process.env.REACT_APP_DEBUG || "";
const EditProductNew = () => {
  const { id } = useParams();
  const isEditMode = id !== undefined;


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({});

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // categories values of product
  const [product, setProduct] = useState({});
  const [brand, setBrand] = useState({});

  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState([]);

  const [open, setOpen] = useState(false);

  const [mediaItems, setMediaItems] = useState([]);



  const handleDelete = () => {
    // Use the browser's confirm dialog to confirm deletion
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct({ id: id }))
        .unwrap()
        .then(() => {
          toast.success('Product deleted successfully!');
          navigate("/product"); // Adjust route as needed
        })
        .catch((error) => {
          toast.error(`Failed to delete product: ${error}`);
        });
    }
  };


  const defaultInitialValues = {
    name: "",
    description: "",
    description_short: "",
    sku: "",
    weight: 0,
    length: 0,
    width: 0,
    quantity_min: 1, // Default to a minimum quantity of 1
    stock: 0,
    price: "",
    media: [],
    discounted_price: "",
    cost: "",
    published: false,
    brand_id: "",
    categories: [],
    files: [],
    options: [],
    productVariants: [],
  };





  const imageBaseUrl = `${process.env.REACT_APP_MEDIA_URL}`;



  const fetchBrands = async () => {
    const res = await dispatch(fetchAllBrands()).unwrap();
    //  console.log(res)
    setBrands(res);
  };

  const fetchCategories = async () => {
    // fetch all categories 
    const res = await dispatch(fetchAllCategories()).unwrap();
    const categoryOptions = res.map(cat => ({
      value: cat.id,
      label: cat.name
    }));
    console.log(categoryOptions)
    setCategories(categoryOptions);
  }

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) {

      fetchProduct(); // Only fetch product if in edit mode
    } else {
      setInitialValues(defaultInitialValues); // Set default for add new product
    }
  }, [dispatch, isEditMode]);

  const fetchProduct = async () => {
    try {





      const response = await dispatch(fetchProductById({ id })).unwrap();
      const { product } = response;

      console.log('Fetched Product Data');
      console.log(product);


      const productCategories = product.categories ? categories.filter(cat => product.categories.includes(cat.value)) : []
      setSelectedCategories(productCategories);

      const formattedVariants = product.product_variants?.map(variant => ({
        name: variant.name || "",
        price: variant.price || "",
        discounted_price: variant.discounted_price || "",
        stock: variant.stock || "",
        sku: variant.sku || "",
        image: variant.image || "",
        _id: variant._id || ""  // Assuming each variant has a unique ID
      })) || [];

      const initialValues = {
        name: product.name || "",
        description: product.description || "",
        description_short: product.description_short || "",
        sku: product.sku || "",
        weight: product.weight || "",
        length: product.length || "",
        width: product.width || "",
        quantity_min: product.quantity_min || "",
        stock: product.stock || "",
        price: product.price || "",
        discounted_price: product.discounted_price || "",
        cost: product.cost || "",
        published: product.published || false,
        brand_id: product.brand_id?.id || "",
        categories: productCategories,
        productVariants: formattedVariants,
        additional_descriptions: product.additional_descriptions || [],
        media: product.media || [],
        files: [],
        options: [],
      };

      console.log('Initial Values');
      console.log(initialValues);

      setInitialValues(initialValues);
      setFormData(product);
      setMediaItems(product.media || []);

    } catch (error) {
      //console.error('Failed to fetch product details:', error);
      toast.error('Error fetching product details');
    }
  };



  const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const handleSubmit = async (values, errors) => {

    const data = {
      ...values,
      media: mediaItems,
      categories: values.categories.map((cat) => cat.value),
    };




    console.log(data);
    console.log("------------")
    //  console.log(errors)

    try {
      let res;
      if (isEditMode) {
        res = await dispatch(updateProduct({ id, values: data })).unwrap();
        toast.success("Product updated successfully!");
      } else {
        res = await dispatch(addProduct(data)).unwrap();
        toast.success("Product added successfully!");
        //console.log(res);
        navigate("/product");
        //if(res) navigate("/editproduct/"+res.product.id); // Redirect to products page after adding
      }

      if (res.status === 400) {
        toast.error(res.message || "An error occurred");
      }
    } catch (error) {
      console.error("Failed to process product:", error);
      toast.error("Failed to process product");
    }
  };

  const goBack = () => {
    window.history.back();
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
          <h2 className="heading">{isEditMode ? "Edit Product" : "Add Product"}</h2>

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
                    validateOnChange={false}
                    validateOnBlur={true}
                    validateOnSubmit={true}
                    onSubmit={(values, errors) => {
                      handleSubmit(values, errors);
                    }}
                  >
                    {({
                      values,
                      errors,
                      setFieldValue,
                      validateForm,

                    }) => (
                      <>
                     
                        {debugMode && <div><pre>{JSON.stringify(values, null, 2)}</pre></div>}
                        {debugMode && <pre>{JSON.stringify(values.categories)}</pre>}
                        {debugMode && <pre>{JSON.stringify(categories)}</pre>}
                        <Form>
                          <div className="row">
                            <div className="col-md-9">
                              <div className="card mb-3">
                                <div className="card-body">
                                  {/* Name */}
                                  <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name <span className="text-danger">*</span></label>
                                    <Field type="name" className="form-control" id="name" name="name" aria-describedby="nameHelp"></Field>
                                    {errors.name && <small className="text-danger">{errors.name}</small>}
                                  </div>
                                  {/* Short Description */}
                                  <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Short Description</label>
                                    <Field as="textarea" name="description_short" className="form-control" rows="2" cols="50" placeholder="Enter short description" />
                                  </div>
                                  {/* Description */}
                                  <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Description</label>
                                    <Field name="description" component={QuillEditor} />
                                    {errors.description && <small className="text-danger">{errors.description}</small>}
                                  </div>

                                </div>
                              </div>
                              {/* Additional Description */}
                              <div className="card mb-3">
                                <div className="card-body">
                                  <FieldArray name="additional_descriptions">
                                    {({ push, remove }) => (
                                      <div>
                                        <div>
                                          <label htmlFor="additional_descriptions" className="form-label mt-4" style={{ marginRight: "10px" }}>
                                            Additional Descriptions
                                          </label>
                                        </div>

                                        {values.additional_descriptions?.map(
                                          (keyword, index) => (
                                            <div key={index} className="mb-3">
                                              <div>
                                                <label htmlFor="label">Label:</label>
                                                <Field name={`additional_descriptions.${index}.label`} className="form-control" />
                                                <ErrorMessage name="label" component="div" />
                                              </div>
                                              <div className="mb-3">
                                                <label htmlFor="name" className="form-label">Text</label>
                                                <Field name={`additional_descriptions.${index}.value`} component={QuillEditor} />
                                                {errors.description && (
                                                  <small className="text-danger">{errors.value}</small>
                                                )}
                                              </div>
                                              <button className="btn btn-sm btn-danger mt-5" onClick={() => remove(index)}>
                                                <span><FontAwesomeIcon icon={faTrash} /></span> Remove
                                              </button>
                                            </div>

                                          )
                                        )}
                                        <button type="button" className="btn btn-sm btn-dark mt-2" onClick={() => push("")}>Add descriptions</button>

                                      </div>
                                    )}
                                  </FieldArray>
                                </div>
                              </div>


                              {/* Media */}
                              <div className="card mb-3">
                                <div className="card-body">
                                  <div className="mb-3">
                                    <label htmlFor="media" className="form-label">Media</label>
                                    <div className="form-group">
                                      <label htmlFor="file-upload">Upload Files</label>
                                    </div>
                                    <DraggableMediaGallery mediaItems={mediaItems} setMediaItems={setMediaItems} />
                                  </div>
                                </div>
                              </div>

                              {/* Pricing */}
                              <div className="card mb-3">
                                <div className="card-body">
                                  <div className="row">
                                    <h6><b>Pricing</b></h6>
                                  </div>

                                  <div className="row">
                                    <div className="col-md-6 mt-3">
                                      <label htmlFor="price" className="form-label">Price <span className="text-danger">*</span></label>
                                      <Field type="number" className="form-control" id="price" name="price" aria-describedby="priceHelp" />
                                      {errors.price && <small className="text-danger">{errors.price}</small>}
                                    </div>

                                    <div className="col-md-6 mt-3">
                                      <label htmlFor="discounted_price" className="form-label">Discounted Price</label>
                                      <Field type="number" className="form-control" id="discounted_price" name="discounted_price" aria-describedby="discountPriceHelp" />
                                      {errors.discounted_price && <small className="text-danger">{errors.discounted_price}</small>}
                                    </div>
                                  </div>

                                  <div className="row mt-3">
                                    <div className="col-md-6">
                                      <label htmlFor="cost" className="form-label">Cost</label>
                                      <Field type="number" className="form-control" id="cost" name="cost" aria-describedby="costHelp" />
                                      {errors.cost && <small className="text-danger">{errors.cost}</small>}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Inventory & Shipping */}
                              <div className="card mb-3">
                                <div className="card-body">
                                  <h6><b>Inventory & Shipping</b></h6>
                                  <div className="row mt-4">
                                    <div className="col-md-4">
                                      <label htmlFor="sku" className="form-label">SKU <span className="text-danger">*</span></label>
                                      <Field type="text" className="form-control" id="sku" name="sku" aria-describedby="skuHelp"></Field>
                                      {errors.sku && <small className="text-danger">{errors.sku}</small>}
                                    </div>
                                    <div className="col-md-4">
                                      <label htmlFor="quantity_min" className="form-label">Min quantity per order</label>
                                      <Field type="number" className="form-control" id="quantity_min" name="quantity_min" aria-describedby="quantityMinHelp"></Field>
                                      {errors.quantity_min && <small className="text-danger">{errors.quantity_min}</small>}
                                    </div>
                                    <div className="col-md-4">
                                      <label htmlFor="stock" className="form-label">Stock</label>
                                      <Field type="number" className="form-control" id="stock" name="stock" aria-describedby="stockHelp"></Field>
                                      {errors.stock && <small className="text-danger">{errors.stock}</small>}
                                    </div>
                                  </div>
                                  <div className="row mt-3">
                                    <div className="col-md-3">
                                      <label htmlFor="length" className="form-label">Length</label>
                                      <Field type="number" className="form-control" id="length" name="length" aria-describedby="lengthHelp"></Field>
                                      {errors.length && <small className="text-danger">{errors.length}</small>}
                                    </div>
                                    <div className="col-md-3">
                                      <label htmlFor="width" className="form-label">Width</label>
                                      <Field type="number" className="form-control" id="width" name="width" aria-describedby="widthHelp"></Field>
                                      {errors.width && <small className="text-danger">{errors.width}</small>}
                                    </div>
                                    <div className="col-md-3">
                                      <label htmlFor="height" className="form-label">Height</label>
                                      <Field type="number" className="form-control" id="height" name="height" aria-describedby="heightHelp"></Field>
                                      {errors.height && <small className="text-danger">{errors.height}</small>}
                                    </div>
                                    <div className="col-md-3">
                                      <label htmlFor="weight" className="form-label">Weight</label>
                                      <Field type="number" className="form-control" id="weight" name="weight" aria-describedby="weightHelp"></Field>
                                      {errors.weight && <small className="text-danger">{errors.weight}</small>}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Variants */}
                              <div className="card mb-3">
                                <div className="card-body">
                                  <h6><b>Variants</b></h6>

                                  <FieldArray name="productVariants">

                                    {({ push, remove, form }) => (
                                      <div>

                                        <table className="table table-responsive table-bordered">
                                          <thead style={{ fontSize: '12px' }}>
                                            <tr>
                                              <th></th>
                                              <th width="200">Name</th>
                                              <th>Price</th>
                                              <th>Discounted Price</th>
                                              <th>Stock</th>
                                              <th>SKU</th>
                                              <th ></th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {values.productVariants && values.productVariants.length > 0 ? (

                                              values.productVariants.map((variant, index) => (
                                                <tr key={index}>
                                                  <td>
                                                    <ImageUploadPreview
                                                      name={`productVariants[${index}][image]`} // Dynamic name for the input
                                                      imageFile={variant.image} // This is just the image file name from the server
                                                      setImageFile={file => setFieldValue(`productVariants.${index}.image`, file)}
                                                      imagePreview={variant.imagePreview || (variant.image ? `${mediaFolder}/${variant.image}` : null)}
                                                      setImagePreview={preview => setFieldValue(`productVariants.${index}.imagePreview`, preview)}
                                                    />
                                                  </td>
                                                  <td>
                                                    <Field required type="text" name={`productVariants.${index}.name`} className="form-control form-control-sm" />
                                                  </td>
                                                  <td>
                                                    <Field required type="number" name={`productVariants.${index}.price`} className="form-control form-control-sm" />
                                                  </td>
                                                  <td>
                                                    <Field type="number" name={`productVariants.${index}.discounted_price`} className="form-control  form-control-sm" />
                                                  </td>
                                                  <td>
                                                    <Field required type="number" name={`productVariants.${index}.stock`} className="form-control  form-control-sm" />
                                                  </td>
                                                  <td>
                                                    <Field type="text" name={`productVariants.${index}.sku`} className="form-control  form-control-sm" />
                                                  </td>
                                                  <td>


                                                    {variant._id && <input type="hidden" name={`productVariants.${index}._id`} value={variant._id} />}
                                                    <button type="button" className="btn btn-link text-danger" onClick={() => remove(index)}>
                                                      X
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td colSpan="6" className="text-center">No variants added</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                        <button type="button" className="btn btn-outline-primary" onClick={() => push({ name: '', price: '', discounted_price: '', stock: '', sku: '' })}>
                                          Add Variant
                                        </button>
                                      </div>
                                    )}
                                  </FieldArray>

                                </div>
                              </div>

                            </div>
                            <div className="col-md-3">
                              <div className="card mb-3">
                                <div className="card-body">
                                  {/* Published */}
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
                                      <option value="false">Draft</option>
                                      <option value="true">Published</option>
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

                                  {/* Category */}
                                  <div>
                                    <label
                                      htmlFor="category"
                                      className="form-label"
                                    >
                                      Category:
                                    </label>
                                    <MultiSelectDropdown
                                      name="categories"
                                      options={categories}
                                      onChange={(selectedOption) => {

                                        setFieldValue("categories", selectedOption);
                                        setSelectedCategories(selectedOption.map((cat) => cat.value));

                                      }}

                                    />

                                    {/* 
                                  <MultiSelectDropdown
                                      name="categories"
                                      options={categories.map(cat => ({
                                        value: cat.id,  // Assuming you're using 'id' from categories as the value.
                                        label: cat.name // The name field from categories as the label.
                                      }))}
                                      value={values.categories.map((selectedCategory) => {
                                        // Finding each selected category in the 'categories' array by its 'id'.
                                        const category = categories.find((cat) => cat.id === selectedCategory.id);
                                        return category ? { value: category.id, label: category.name } : null;
                                      }).filter(Boolean)} // Filters out any null values if a category wasn't found
                                      onChange={(selectedOption) => {
                                        // Handling change, assuming you want to save the selected options.
                                        setFieldValue("categories", selectedOption);
                                      }}
                                    /> */}

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
                                  {/* Brand */}
                                  <div>
                                    <label htmlFor="brand" className="form-label">
                                      Brand:
                                    </label>
                                    <Field
                                      as="select"
                                      id="brand_id"
                                      name="brand_id"
                                      value={values.brand_id}

                                      className="form-select"
                                    >
                                      <option value="">Select Brand</option>
                                      {brands?.map((brand) => (
                                        <option value={brand.id} key={brand.id}>
                                          {capitalize(brand.name)}
                                        </option>
                                      ))}

                                    </Field>
                                    {errors.brand_id && (
                                      <small className="text-danger">
                                        {errors.brand_id}
                                      </small>
                                    )}

                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12 d-flex justify-content-between">
                              <button type="submit" className="btn btn-primary mt-2" >
                                {isEditMode ? "Update Product" : "Add Product"}
                              </button>

                              {isEditMode ? <button type="button" onClick={handleDelete} className="btn btn-outline-danger mt-2" >
                                Delete
                              </button> : ''}

                            </div>
                          </div>
                        </Form>
                      </>
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

    </Layout>
  );
};

export default EditProductNew;
