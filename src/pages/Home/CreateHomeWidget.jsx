import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Layout from "../../components/layouts/Layout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllBrands } from "../../features/brand/brandSlice";
import { fetchAllCategories } from "../../features/category/categorySlice";
import { fetchAllProducts } from "../../features/product/productSlice";
import SlideShowWidget from "./components/SlideShowWidget";
import CategoryWidget from "./components/CategoryWidget";


const CreateHomeWidget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showButton, setShowButton] = useState(false);
  const [widgetType, setWidgetType] = useState(" ");
  const [showItemForm, setShowItemForm] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catOption, setCatOption] = useState([]);
  const [products, setProducts] = useState([]);
  const [prodOption, setProdOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [destinationId, setDestinationId] = useState([]);

  const initialValues = {
    placement_id: "",
    items: [],
  };

  //   get brands
  const brandOptions = [];
  const fetchBrand = async () => {
    const res = await dispatch(fetchAllBrands()).unwrap();
    //  console.log(res)
    setBrands(res);
    res?.map((brand) => {
      brandOptions.push({ label: brand.name, value: brand.id });
    });

    setBrandOption(brandOptions);
  };

  const catOptions = [];
  const fetchCategory = async () => {
    const res = await dispatch(fetchAllCategories()).unwrap();
    //  console.log(res)
    setCategories(res);
    res?.map((cat) => {
      catOptions.push({ label: cat.name, value: cat.id });
    });

    setCatOption(catOptions);
  };

  const prodOptions = [];
  const fetchProducts = async () => {
    const res = await dispatch(fetchAllProducts()).unwrap();
    //  console.log(res)
    setProducts(res);

    res?.map((prod) => {
      prodOptions.push({ label: prod.name, value: prod.id });
    });

    setProdOption(prodOptions);
  };

  useEffect(() => {
    fetchBrand();
    fetchCategory();
    fetchProducts();
  }, [dispatch]);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Submitting form with values:", values);
    setSubmitting(false);
  };

  const handleWidgetChange = async (e) => {
    console.log(e.target.value);
    await setWidgetType(e.target.value);
    // console.log("Selected Widget:", selectedValue);
    // console.log(brands);

    // Show the button when a specific value is selected
    if (widgetType) {
      setShowItemForm(true);
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleAddItem = (values, setFieldValue) => {
    setShowItemForm(true);
    setItems(values.item);
    // const newItems = [
    //   ...values.items,
    //   {
    //     image: '',
    //     description: '',
    //     tag: '',
    //     brand: '',
    //     destination: '',
    //     id: '',
    //     index: values.items.length,
    //   },
    // ];
    // console.log('New Items:', newItems);
    // setFieldValue('items', newItems);
  };

  const handleDestinationChange = (e) => {
    setDestinationOptions([]);
    if (e.target.value === "product") {
      setDestinationOptions(prodOption);
    } else if (e.target.value === "category") {
      setDestinationOptions(catOption);
    } else if (e.target.value === "brand") {
      setDestinationOptions(brandOption);
    } else {
      setDestinationOptions([]);
    }
  };

  const handleSelectIdChange = (fieldName, selectedOption, setFieldValue) => {
    setFieldValue(fieldName, selectedOption.value);
    console.log(selectedOption)
    // setDestinationId(selectedOption)
    
  };

  const moveItem = (values, fromIndex, toIndex) => {
    const itemsCopy = [...values.items];
    const [movedItem] = itemsCopy.splice(fromIndex, 1);
    itemsCopy.splice(toIndex, 0, movedItem);

    // Update the index of all items
    const updatedItems = itemsCopy.map((item, index) => ({ ...item, index }));
    values.items = updatedItems;
    console.log(values.items);
    return updatedItems;
  };

  // const moveItem = (values, fromIndex, toIndex) => {
  //   const itemsCopy = [...values.items];

  //   // Remove the item from the array at the fromIndex
  //   const [movedItem] = itemsCopy.splice(fromIndex, 1);

  //   // Insert the moved item at the toIndex
  //   itemsCopy.splice(toIndex, 0, movedItem);

  //   // Update the index and id of all items
  //   const updatedItems = itemsCopy.map((item, index) => ({
  //     ...item,
  //     index,
  //     id: item.id,
  //   }));

  //   return updatedItems;
  // };

  const onDragEnd = (result, values, setFieldValue) => {
    if (!result.destination) return;
    console.log(result);

    const widgetItems = [...values.items];
    const [removed] = widgetItems.splice(result.source.index, 1);
    widgetItems.splice(result.destination.index, 0, removed);

   
    values.items = widgetItems;
    console.log(values);
  };

  // const onDragEnd = (result, values, setFieldValue) => {
  //   if (!result.destination) return;
  
  //   const { source, destination } = result;
  
  //   if (source.index !== destination.index) {
  //     // Reorder items
  //     const reorderedItems = Array.from(values.items);
  //     const [removed] = reorderedItems.splice(source.index, 1);
  //     reorderedItems.splice(destination.index, 0, removed);
  
  //     // Update IDs and images based on reordered items
  //     reorderedItems.forEach((item, index) => {
  //       setFieldValue(`items.${index}.id`, item.id); // Update ID
  //       setFieldValue(`items.${index}.image`, item.image); // Update image
  //     });
  //     console.log("Reordered Items:", reorderedItems);
  //     values.items = reorderedItems
  //     // setFieldValue('items', reorderedItems);
  //     console.log("Formik Values:", values);
  //   }
  // };
  

  return (
    <Layout>
      {/* <DndProvider backend={HTML5Backend}> */}
      <div className="col-12 stretch-card container-fluid">
        <div className="card">
          <div className="card-body">
            <h4>Add Home Widget</h4>
            <Formik
              initialValues={initialValues}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values, { setSubmitting });
              }}
            >
              {({ values, errors, isSubmitting, setFieldValue,field }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="placement_id" className="form-label">
                      Placement:
                    </label>
                    <Field
                      as="select"
                      id="placement_id"
                      name="placement_id"
                      className="form-select"
                    >
                      <option value="">Select Position</option>
                      <option value="p1">Position 1</option>
                      <option value="p2">Position 2</option>
                      <option value="p3">Position 3</option>
                      <option value="p4">Position 4</option>
                      <option value="p5">Position 5</option>
                      <option value="p6">Position 6</option>
                      <option value="p7">Position 7</option>
                      <option value="p8">Position 8</option>
                      <option value="p9">Position 9</option>
                      <option value="p10">Position 10</option>
                      {/* Add more options as needed */}
                    </Field>
                    <ErrorMessage name="placement_id" component="div" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      aria-describedby="titleHelp"
                    ></Field>
                    {errors.title && (
                      <small className="text-danger">{errors.title}</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subtitle" className="form-label">
                      Subtitle
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="subtitle"
                      name="subtitle"
                      aria-describedby="subtitleHelp"
                    ></Field>
                    {errors.subtitle && (
                      <small className="text-danger">{errors.subtitle}</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="placement_id" className="form-label">
                      Widget Type:
                    </label>
                    <Field
                      as="select"
                      id="widget_type"
                      name="widget_type"
                      className="form-select"
                      onChange={handleWidgetChange}
                    >
                      <option value="">Select Widget</option>
                      <option value="slideshow">Slide Show</option>
                      <option value="categories">Categories</option>
                      <option value="brands">Brands</option>
                      <option value="products">Products</option>
                      <option value="categories_products">
                        Categories Products
                      </option>
                      <option value="featured_brand">Featured Brand</option>

                      {/* Add more options as needed */}
                    </Field>
                    <ErrorMessage name="widget_type" component="div" />
                  </div>

                  {/* items selection according to widget selection */}
                  <>
                    {widgetType === "slideshow" && showItemForm && (
                     
                      <SlideShowWidget
                      values={values}
                      brands={brands}
                      setFieldValue={setFieldValue}
                      onDragEnd={onDragEnd}
                      showButton={showButton}
                      destinationOptions={destinationOptions}
                      handleAddItem={handleAddItem}
                      handleSelectIdChange={handleSelectIdChange}
                      handleDestinationChange={handleDestinationChange}
                    />
                    )}
                     {widgetType === "categories" && showItemForm && (
                     
                     <CategoryWidget
                     values={values}
                     
                     setFieldValue={setFieldValue}
                     onDragEnd={onDragEnd}
                     showButton={showButton}
                      categories={categories}
                     handleAddItem={handleAddItem}
                    
                   />
                   )}
                  </>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {/* </DndProvider> */}
    </Layout>
  );
};

export default CreateHomeWidget;
