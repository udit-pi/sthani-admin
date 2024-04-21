import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useNavigate, useParams } from "react-router-dom";
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

import { fetchAllCategories } from "../../features/category/categorySlice";
import { useDispatch } from "react-redux";
import { fetchAllBrands } from "../../features/brand/brandSlice";
import { fetchAllProperties } from "../../features/properties/propertySlice";
import {
  addProduct,
  fetchProductById,
  updateProduct,
} from "../../features/product/productSlice";
import DataTable from "react-data-table-component";

import AddVariantModalComponent from "../../components/AddVariantModal";
import { editProductValidation } from "../../validations/editProductValidation";
import MultiSelect2 from "../../components/MultiSelect2";
import DraftEditor from "../../components/DraftEditor";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [brand, setBrand] = useState({});
  const [fetchedProductVariant, setFetchedProductVariant] = useState([]);
  const [productMedia, setProductMedia] = useState([]);

  const [categories, setCategories] = useState([]);
  const [catOption, setCatOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [showVariant, setShowVariant] = useState(false);
  const [addedVariants, setAddedVariants] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);

  const [showVariantField, setShowVariantField] = useState(false);

  const [propertyOption, setPropertyOption] = useState([]);

  const [showDone, setShowDone] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [images, setImages] = useState([]);
  const [oldVariantImages, setOldVariantImages] = useState([]);
  const [newVariantImages, setNewVariantImages] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [fetchedVariants, setFetchedVariants] = useState([]);
  const [variants, setVariants] = useState([]);
  const [showImage, setShowImage] = useState(true);
  const [deletedImages, setDeletedImages] = useState([]);

  // custom error
  const [productVariants1, setProductVariants1] = useState([
    { variantSKU: "" },
  ]);
  const [variantErrors, setVariantErrors] = useState({});

  // show hide modal

  const imageBaseUrl = "http://localhost:3500/uploads/";

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // console.log(propertyOption);
    setShow(true);
  };

  // const brandOptions = []
  const catOptions = [];

  const initialValues = {
    // name: product.name,
    description: "",
    category: [],
    // field: "",
    variants: [],

    // options: [
    //   { name: "Size", values: [] },
    //   { name: "Color", values: [] },
    // ],
    files: [],
    // productVariant: fetchedProductVariant?.map((item) => ({
    //   variantName: item.name,
    //   variantSKU: item.sku,
    //   variantPrice: item.price,
    // })) || [],
    // variantImages: []

    // variants: [
    //   { name: "", options: [] },

    // ],
    productVariant1: [],
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
    return res;
  };

  useEffect(() => {
    fetchBrand();
    fetchProperty();
  }, [dispatch]);

  const renderVariants = (fecthedVariant, propOption) => {
    // console.log(fecthedVariant);
    const variants = propOption
      ?.map((prop) => {
        const foundVariant = fecthedVariant.find(
          (item) => item._id === prop._id
        );

        return foundVariant;
      })
      .flat();
    console.log(variants);
    // Create a Set with unique _id values
    if (variants) {
      const uniqueVariants = [
        ...new Set(variants?.map((variant) => variant._id)),
      ].map((id) => {
        return variants.find((variant) => variant._id === id);
      });
      setVariants(uniqueVariants); // Set uniqueVariants here
    }
  };

  const fetchProduct = async () => {
    const res = await dispatch(fetchProductById({ id })).unwrap();
    // console.log(res);
    setProduct(res.product);
    setBrand(res.brand);
    setFetchedProductVariant(res.productVariant);
    uploadProductVariant(res.productVariant);
    // setFetchedProductVariant(prevState => ({
    //   ...prevState,
    //   fetchedProductVariant: res.productVariant
    // }));
    setProductMedia(res.productMedia);
    setFetchedVariants(res.variantProperties);
    initialValues.name = res.product.name;
    initialValues.description = res.product.description;
    initialValues.description_short = res.product.description_short;
    initialValues.meta_title = res.product.meta_title;
    initialValues.meta_description = res.product.meta_description;
    initialValues.meta_keywords = res.product.meta_keywords;
    initialValues.sku = res.product.sku;
    initialValues.weight = res.product.weight;
    initialValues.length = res.product.length;
    initialValues.width = res.product.width;
    initialValues.quantity_default = res.product.quantity_default;
    initialValues.quantity_min = res.product.quantity_min;
    initialValues.quantity_max = res.product.quantity_max;
    initialValues.stock = res.product.stock;
    initialValues.price = res.product.price;
    initialValues.discounted_price = res.product.discounted_price;
    initialValues.cost = res.product.cost;
    initialValues.price_includes_tax = res.product.price_includes_tax;
    initialValues.published = res.product.published;
    initialValues.brand_id = res.product.brand_id;
    initialValues.category = res.product.categories;

    setSelectedCat(res.product.categories);
    const prop = await fetchProperty();

    renderVariants(res.variantProperties, prop);
    addMediaToFetchedProduct(res.productVariant, res.productMedia);

    // setFilteredCategories(res);
  };

  useEffect(() => {
    fetchProduct();
  }, [dispatch]);

  const addMediaToFetchedProduct = (productVariant, productMedia) => {
    // console.log(productVariant);
    // console.log(productMedia);
    const updatedProductVariant = productVariant?.map((product) => {
      const matchedMedia = productMedia?.find(
        (media) => product.id === media.variant_id
      );

      if (matchedMedia) {
        return {
          ...product,
          image: matchedMedia.file_name,
        };
      }

      return product;
    });

    // console.log(updatedProductVariant);
    setFetchedProductVariant(updatedProductVariant);
  };

  const uploadProductVariant = (productVariants) => {
    initialValues.productVariant = productVariants.map((item) => ({
      variantName: item.name,
      variantSKU: item.sku,
      variantPrice: item.price,
      variantStock: item.stock,
    }));
  };

  // console.log(fetchedproductVariant)
  // console.log(fetchedVariants)

  // Transform category IDs to category objects
  const selectedCategories = selectedCat.map((catId) => {
    const category = catOption.find((cat) => cat.value === catId);
    // console.log(category);
    return category ? { value: category.value, label: category.label } : null;
  });

  const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const handleSubmit = async (values, errors) => {
    console.log(errors);
    console.log(values);
    setProductVariants1(values.productVariant1);

    const newErrors = {};
    // productVariants1?.forEach((variant, index) => {
    //   if (!variant.variantSKU) {
    //     newErrors[`productVariant1.${index}.variantSKU`] =
    //       "Variant SKU is required";
    //   }
    //   if (!variant.variantPrice) {
    //     newErrors[`productVariant1.${index}.variantPrice`] =
    //       "Variant Price is required";
    //   }
    // });

    productVariants1.forEach((variant, index) => {
      if (!variant.variantSKU || !variant.variantPrice) {
        newErrors[index] = { variantSKU: "Variant SKU is required" };
        newErrors[index] = { variantPrice: "Variant Price is required" };
       } else {
        newErrors[index] = {};
      }
    });

    console.log(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setVariantErrors(newErrors);

      return;
    }
    console.log(variantErrors);

    values.newVariantImages = newVariantImages;
    values.deletedImages = deletedImages;

    //   const mergedArray1 = values.productVariant.map((variant, index) => {
    //     return {

    //             file: oldVariantImages[index],
    //             name: selectedVariants[index]

    //     };
    // });
    values.oldImageIndex = [];
    values.oldVariantImages = oldVariantImages;
    oldVariantImages?.map((file, index) => {
      values.oldImageIndex.push({ name: file.name, index: index });
    });

    //  console.log(values.oldImageIndex)

    values.productVariant.forEach((item, itemIndex) => {
      // const index = item.index; // Getting the index from the current item

      const matchingVariant = values.oldImageIndex.find(
        (old_image) => old_image.index === itemIndex
      );
      // console.log(matchingVariant)

      if (matchingVariant) {
        matchingVariant.variantName = item.variantName;
      }
    });
    // console.log(values.oldImageIndex)

    const mergedArray = values.productVariant1.map((variant, index) => ({
      ...variant,

      variantName: selectedVariants[index],
      imageName: newVariantImages[index]?.name, // Assuming images is an array of image objects or URLs
    }));

    // values.variantImages = newVariantImages
    values.productVariant1 = mergedArray;
    // console.log(values.productVariant1.oldVariantImages)
    // console.log(variants)
    // console.log(values.variants)
    values.variants = variants;
    // console.log(images)
    // console.log(deletedImages)
    // console.log(oldVariantImages);
    // console.log(newVariantImages);
    // console.log(values)

    // const mergedArray = values.productVariant.map((variant, index) => ({
    //   ...variant,
    //   image: images[index],
    //   variantName: selectedVariants[index],
    //   // variantName: selectedVariants[index]// Assuming images is an array of image objects or URLs
    // }));
    // // values.variantImages = images
    // values.productVariant = mergedArray;

    if (typeof values?.meta_keywords === "string") {
      const metaKeyword = values?.meta_keywords?.split(", ");
      values.meta_keywords = metaKeyword;
    }

    // console.log(mergedArray)

    //  console.log(errors);
    // console.log(selectedVariants);
    // console.log(images)
    //  console.log(values)
    //  console.log(errors)
    // const res = await dispatch(updateProduct({ id, values })).unwrap();
    // if (res) {
    //   toast.success("Product updated successfully!");
    //   navigate("/product");
    // }
  };

  const handleVariantSubmission = (values, errors) => {
    setShowDone(true);
    setShowEdit(true);

    // console.log(values.variants);
    // console.log(addedVariants);

    if (addedVariants.length > 0) {
      const updatedVariants = [
        ...variants,
        ...addedVariants.filter(
          (addedVariant) =>
            !variants.find((variant) => variant.id === addedVariant.id)
        ),
      ];

      setVariants(updatedVariants);
    }
    if (addedVariants.length === 0) {
      setAddedVariants([]);
      console.log("empty variant");
    }

    const filteredVariants = values.variants?.filter((variant) => {
      if (variant) {
        // Check if the variant with the same name already exists in addedVariants

        // if(fetchedProductVariant) {
        //   const existingVariantIndex = propertyOption.findIndex(
        //     (property) =>
        //       property.name === variant.name ||
        //       (variant.name === "Custom" && variant.customName === property.name)

        //   );
        // }
        // console.log(variant);
        // console.log("inside");
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
          // console.log(updatedVariants);
        }
      } else {
        // console.log("Variant is invalid:", variant);
        // console.log("outside");
        // Handle the case where the variant is invalid, such as showing an error message
      }
      // console.log("last");
    });

    setShowVariant(true);
  };
  console.log(variants);

  // useEffect to perform actions dependent on addedVariants
  useEffect(() => {
    console.log(addedVariants);
    // let options = addedVariants?.map((variant) => variant.options).flat();
    // console.log(options);

    // const generateVariantNames = () => {
    //   const combinations = [];

    //   fetchedProductVariant.forEach((variant) => {
    //     options.forEach((option, index) => {
    //       console.log(option);
    //       combinations.push(`${variant.name} ${option}`);
    //     });
    //   });

    //   return combinations;
    // };
    // const variantNames = generateVariantNames();
    // console.log(variantNames);

    const variantNames = [];
    const options = addedVariants?.map((variant) => variant.options);
    console.log(options);

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
    console.log(variantNames);

    let mergedCombinations = [];
    fetchedProductVariant.forEach((fetched) => {
      variantNames.forEach((option) => {
        console.log(option);
        mergedCombinations.push(`${fetched.name} ${option}`);
      });
    });

    const addedVariantOptions = [];
    addedVariants?.map((variant) => {
      variant.options?.map((option) => {
        // console.log(option)
        addedVariantOptions.push(option);
      });
    });

    console.log(mergedCombinations);
    setVariantOptions(addedVariantOptions);
    setSelectedVariants(mergedCombinations);
    // setfetchedProductVariant(variantNames);
  }, [addedVariants]);
  // console.log(selectedVariants)
  // console.log(variantOptions)

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
    // setShowDone(false);
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
      // console.log(variant);
      // Check if the variant with the same name already exists in addedVariants
      const variantExists = addedVariants.some(
        (property) =>
          property.name === variant.name ||
          (property.name === "Custom" && property.customName === variant.name)
      );

      if (!variantExists) {
        //  console.log(variant);
        setAddedVariants([
          ...addedVariants,
          { name: variant.name, options: variant.options },
        ]);
      } else {
        // console.log("Variant already exists:", variant.name);
        // Handle the case where the variant already exists, such as showing an error message
      }
    }

    //  setShowVariant(true);
  };
  //   console.log(addedVariants);
  const handleVariantDelete = (values, index) => {
    console.log(index);
    console.log(values.variants);

    // propertyOption?.map()

    // setFetchedProductVariant((prevVariants) =>
    //   prevVariants.filter((item, i) => item.id !== index)
    // );
    // setAddedVariants([]);
    addedVariants.splice(index, 1);
    console.log(addedVariants);
    console.log(selectedVariants);
    //  setAddedVariants(values.variants)
  };
  // console.log(addedVariants);

  const handleFileChange = (e, index, type) => {
    const selectedFile = e.target.files[0];

    // Update the images state with the selected file for the specific row
    if (type === "oldVariantImages") {
      const updatedImages = [...oldVariantImages];
      updatedImages[index] = selectedFile;
      // setShowImage(false);
      setOldVariantImages(updatedImages);
    } else {
      const updatedImages = [...newVariantImages];
      updatedImages[index] = selectedFile;
      // setShowImage(false);
      setNewVariantImages(updatedImages);
    }
  };

  const handleImageDelete = (id) => {
    //  console.log(id);
    const newImages = productMedia.filter((img) => img.id !== id);
    setProductMedia(newImages);
    setDeletedImages((prevDeletedImages) => [...prevDeletedImages, id]);
    // console.log(newImages);
  };

  const handleNewVariant = (newVariant) => {
    // Handle new variant data
    console.log("New Variant:", newVariant);
    // Update state or perform other operations
  };

  //   product variant data table columns
  const removeVariantRow = (indexToRemove, setFieldValue, values) => {
    const updatedVariants = [...selectedVariants];
    updatedVariants.splice(indexToRemove, 1);
    setSelectedVariants(updatedVariants);

    // console.log(indexToRemove)
    // console.log(values.productVariant1)
    // setFieldValue(
    //   'productVariant1',
    //   values.productVariant1.filter((_, index) => index !== indexToRemove)
    // );
  };

  // const  removeVariantRow = (indexToRemove) => {

  //   setValues(prevValues => ({
  //     ...prevValues,
  //     productVariant1: prevValues.productVariant1.filter((_, index) => index !== indexToRemove)
  //   }));
  // }

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    // {
    //   name: "Short Description",
    //   selector: (row) => row.description_short,
    //   sortable: true,
    // },
    {
      name: "SKU",
      selector: (row) => row.sku,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
    },
    // {
    //     name: 'Meta Description',
    //     selector: row => row.meta_description,
    //     sortable: true,
    // },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            type="button"
            className="btn btn-sm btn-danger ms-1"
            // onClick={() => handleVariantDelete(row.id)}
          >
            <span>
              <FontAwesomeIcon icon={faTrash} />
            </span>
          </button>
        </div>
      ),
    },
    // {
    //     name: 'Created',
    //     selector: row => row.createdAt,
    //     sortable: true,
    // },
  ];

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <h4>Update Product</h4>

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
                  validationSchema={editProductValidation}
                  validateOnChange={true}
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
                  }) => (
                    <Form>
                      {/* {console.log(errors)} */}
                      <div className="row">
                        <div className="col-md-8">
                          {/* card for  */}
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
                                  name="description_short"
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
                                {values?.meta_keywords &&
                                  typeof values.meta_keywords === "string" &&
                                  values?.meta_keywords
                                    ?.split(", ")
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
                                {/* {console.log(fetchedproductVariant)} */}
                                <div className="mt-4">
                                  <FieldArray name="addedVariants">
                                    {({
                                      push,
                                      remove: removeSelectedVariant,
                                    }) => (
                                      <>
                                        {variants?.map(
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
                                                  (option, index) => (
                                                    <div
                                                      key={index}
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

                                {fetchedProductVariant.length > 0 &&
                                  !showVariant && (
                                    // <div className="table-responsive">
                                    //   <DataTable
                                    //     // title="Category"
                                    //     columns={columns}
                                    //     data={fetchedproductVariant}
                                    //     fixedHeader
                                    //     pagination
                                    //     highlightOnHover
                                    //     subHeader
                                    //     //    subHeaderComponent={
                                    //     //      <input
                                    //     //        type="text"
                                    //     //        className="w-25 form-control"
                                    //     //        placeholder="Search Category"
                                    //     //        value={search}
                                    //     //        onChange={(e) => setSearch(e.target.value)}
                                    //     //      />
                                    //     //    }
                                    //   />
                                    // </div>
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
                                            {fetchedProductVariant?.map(
                                              (variant, productIndex) => {
                                                return (
                                                  <tr key={productIndex}>
                                                    <td className="d-flex">
                                                      <label
                                                        htmlFor={`file-upload-${productIndex}`}
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
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
                                                            productIndex,
                                                            "oldVariantImages"
                                                          )
                                                        }
                                                        style={{
                                                          display: "none",
                                                        }} // Hide the input element
                                                      />

                                                      {/* Thumbnail preview */}
                                                      {oldVariantImages[
                                                        productIndex
                                                      ] && (
                                                        <div className="ms-2">
                                                          <img
                                                            src={URL.createObjectURL(
                                                              oldVariantImages[
                                                                productIndex
                                                              ]
                                                            )}
                                                            width={50}
                                                            height={50}
                                                            alt={`Thumbnail ${productIndex}`}
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
                                                        // value={variant.name}
                                                        name={`productVariant[${productIndex}].variantName`}
                                                      />
                                                    </td>

                                                    <td>
                                                      <Field
                                                        type="text"
                                                        // value={variant.sku}
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
                                                        // value= {variant.price}
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
                                                        // value={variant.stock}
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

                                        {/* <button
                                          type="button"
                                          className="btn btn-sm btn-warning"
                                          onClick={() => {
                                            handleReset();
                                            console.log(errors);
                                            console.log(values);
                                          }}
                                        >
                                          Edit Variants  
                                        </button> */}
                                      </div>
                                    </FieldArray>
                                  )}

                                {showVariant && (
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
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <FieldArray
                                          key={selectedVariants.length}
                                          name="productVariant1"
                                        >
                                          {({ push, remove }) => (
                                            <>
                                              {selectedVariants?.map(
                                                (variant, productIndex1) => {
                                                  return (
                                                    <tr key={productIndex1}>
                                                      <td className="d-flex">
                                                        <label
                                                          htmlFor={`file-upload-${productIndex1}`}
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          <FontAwesomeIcon
                                                            icon={faUpload}
                                                          />
                                                        </label>
                                                        <input
                                                          id={`file-upload-${productIndex1}`}
                                                          type="file"
                                                          onChange={(e) =>
                                                            handleFileChange(
                                                              e,
                                                              productIndex1,
                                                              "newVariantImages"
                                                            )
                                                          }
                                                          style={{
                                                            display: "none",
                                                          }} // Hide the input element
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name={`newVariantImagesOrder[${productIndex1}]`}
                                                          value={productIndex1}
                                                        />

                                                        {/* Thumbnail preview */}
                                                        {newVariantImages[
                                                          productIndex1
                                                        ] && (
                                                          <div className="ms-2">
                                                            <img
                                                              src={URL.createObjectURL(
                                                                newVariantImages[
                                                                  productIndex1
                                                                ]
                                                              )}
                                                              width={50}
                                                              height={50}
                                                              alt={`Thumbnail ${productIndex1}`}
                                                            />
                                                          </div>
                                                        )}
                                                      </td>
                                                      <td>
                                                        <Field
                                                          type="text"
                                                          value={variant}
                                                          name={`productVariant1[${productIndex1}].variantName`}
                                                        />
                                                      </td>

                                                      <td>
                                                        <Field
                                                          type="text"
                                                          name={`productVariant1[${productIndex1}].variantSKU`}
                                                          value=""
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
                                                          name={`productVariant1.${productIndex1}.variantSKU`}
                                                          component="div"
                                                          className="text-danger"
                                                        />
                                                        {errors[productIndex1] &&
                                                          errors[productIndex1]
                                                            .variantSKU && (
                                                            <p className="error">
                                                              {
                                                                errors[productIndex1]
                                                                  .variantSKU
                                                              }
                                                            </p>
                                                          )}
                                                        {variantErrors[productIndex1] &&
                                                          variantErrors[productIndex1]
                                                            .variantSKU && (
                                                            <p className="error">
                                                              {
                                                                variantErrors[productIndex1]
                                                                  .variantSKU
                                                              }
                                                            </p>
                                                          )}
                                                      </td>
                                                      <td>
                                                        <Field
                                                          type="number"
                                                          name={`productVariant1[${productIndex1}].variantPrice`}
                                                        />

                                                        <ErrorMessage
                                                          name={`productVariant1.${productIndex1}.variantPrice`}
                                                          component="div"
                                                          className="text-danger"
                                                        />
                                                        {variantErrors[
                                                          `productVariant1.${productIndex1}.variantPrice`
                                                        ] && (
                                                          <p className="text-danger">
                                                            {
                                                              variantErrors[
                                                                `productVariant1.${productIndex1}.variantPrice`
                                                              ]
                                                            }
                                                          </p>
                                                        )}
                                                      </td>
                                                      <td>
                                                        <Field
                                                          type="number"
                                                          name={`productVariant1[${productIndex1}].variantStock`}
                                                        />

                                                        <ErrorMessage
                                                          name={`productVariant1.${productIndex1}.variantStock`}
                                                          component="div"
                                                          className="text-danger"
                                                        />
                                                      </td>
                                                      <td>
                                                        <Field
                                                          type="number"
                                                          name={`productVariant1[${productIndex1}].variantDiscountedPrice`}
                                                        />

                                                        <ErrorMessage
                                                          name={`productVariant1.${productIndex1}.variantDiscountedPrice`}
                                                          component="div"
                                                          className="text-danger"
                                                        />
                                                      </td>
                                                      <td>
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            remove(
                                                              productIndex1
                                                            );
                                                            removeVariantRow(
                                                              productIndex1,
                                                              setFieldValue,
                                                              values
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
                                                      </td>
                                                    </tr>
                                                  );
                                                }
                                              )}
                                            </>
                                          )}
                                        </FieldArray>
                                      </tbody>
                                    </table>

                                    {showEdit ? (
                                      <>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-warning"
                                          onClick={() => {
                                            handleReset();
                                            console.log(errors);
                                            console.log(values);
                                          }}
                                        >
                                          Edit Variants
                                        </button>
                                      </>
                                    ) : (
                                      <span>False</span>
                                    )}
                                  </div>
                                )}

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

                                {/* <button type="button" className="btn btn-small btn-success" style={{"width":"150px"}} onClick={handleShow}>Manage Variant</button> */}
                              </div>
                            </div>
                          </div>
                          <div className="card mb-3">
                            <div className="card-body">
                              <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                  Media
                                </label>
                                <h6>Images:</h6>
                                <div className="row mt-4 mb-2">
                                  {productMedia?.map((media, key) => {
                                    if (!media.variant_id) {
                                      return (
                                        <div
                                          key={key}
                                          class="col-md-3 grid-item"
                                        >
                                          <img
                                            src={imageBaseUrl + media.file_name}
                                            className="img-fluid"
                                            alt="Image 2"
                                            width={150}
                                            height={150}
                                          ></img>
                                          {/* <p>{image.label}</p> */}
                                          <button
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
                                {/* <Field
                                  name="category"
                                  component={MultiSelect2}
                                  options={catOption}
                                /> */}
                                <MultiSelectDropdown
                                  name="category"
                                  options={catOption}
                                  value={selectedCategories.filter(
                                    (cat) => cat != null
                                  )}
                                  // value={selectedCategories}
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
                            Update Product
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
      {show && (
        <>
          <div
            className="modal-backdrop show"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "1040" }}
          ></div>
          <AddVariantModalComponent
            handleClose={handleClose}
            variants={propertyOption}
            onNewVariant={handleNewVariant}
          />
        </>
      )}
    </Layout>
  );
};

export default EditProduct;
