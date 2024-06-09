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
import BrandWidget from "./components/BrandWidget";
import ProductWidget from "./components/ProductWidget";
import FeaturedBrand from "./components/FeaturedBrand";
import FeaturedCategories from "./components/FeaturedCategories";
import { addWidgetValidation } from "../../validations/addWidgetValidation";
import { addWidget, fetchAllwidget } from "../../features/widget/homeWidgetSlice";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";


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
  const [featuredBrandProducts, setFeaturedBrandProducts] = useState([]);
  const [featuredCategoryProducts,setFeaturedCategoryProducts] = useState([]);
  const [homeWidgets, setHomeWidgets] = useState([]);
  const [widgetPositions,setWidgetPositions] = useState([]);
  const [showSaveButton,setShowSaveButton] = useState(false);

  const initialValues = {
    placement_id: "",
    // items: [{brand: ''}],
     widget_type: '',
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

  let positions = [
    {name: "position 1", value: "1"},
    {name: "position 2", value: "2"},
    {name: "position 3", value: "3"},
    {name: "position 4", value: "4"},
    {name: "position 5", value: "5"},
    {name: "position 6", value: "6"},
    {name: "position 7", value: "7"},
    {name: "position 8", value: "8"},
    {name: "position 9", value: "9"},
    {name: "position 10", value: "10"}
  ]

  const fetchWidget = async () => {
    const res = await dispatch(fetchAllwidget()).unwrap();
     console.log('widget',res)
    setHomeWidgets(res);
    setWidgetPositions(positions)
    res.forEach(widget => {
     
    
      const index = positions.findIndex(position => position.value === widget.placement_id);

      
      console.log(index);
  
      if (index !== -1) {
          positions.splice(index, 1);
          setWidgetPositions(positions)
      }
      console.log('positions',positions)
  });
  
  };

  useEffect(() => {
    fetchBrand();
    fetchCategory();
    fetchProducts();
    fetchWidget();
  }, [dispatch]);

  

  
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Submitting form with values:", values);

    

    setSubmitting(false);

    const res = await dispatch(addWidget(values)).unwrap();
    if (res) {
      toast.success("Widget created successfully!");
      navigate("/homePage");
    }
  };

  const handleWidgetChange = async (e) => {
     await setWidgetType(e.target.value);

    // console.log("Selected Widget:", selectedValue);
    // console.log(brands);

    // Show the button when a specific value is selected
    if (widgetType) {
      widgetType !== 'featured_brand' ?  setShowSaveButton(true) : setShowSaveButton(false)
      setShowItemForm(true);
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleAddItem = (values, setFieldValue) => {
    setShowSaveButton(true);
    setItems(values.items);
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

  const handleDestinationChange =(e, setFieldValue, index) => {
    setDestinationOptions([]);
    setFieldValue(`items.${index}.destination`, e.target.value);
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

  const handleFeaturedCategoryChange = (e, setFieldValue, index) => {
    const featuredCategoryOptions = [];
    products?.map((prod) => {
      if (prod.categories.includes(e.target.value)) {
        featuredCategoryOptions.push({ label: prod.name, value: prod.id });
      }
    });
    setFeaturedCategoryProducts(featuredCategoryOptions);
    setFieldValue(`items.${index}.category`, e.target.value);
    setFieldValue(`items.${index}.products`, []);
  };

 
  const handleFeaturedBrandChange = (e, setFieldValue, index) => {
    const selectedBrandId = e.target.value;
    const featuredBrandOptions = products
      .filter((prod) => prod.brand_id === selectedBrandId)
      .map((prod) => ({ label: prod.name, value: prod.id }));

    setFeaturedBrandProducts(featuredBrandOptions);
    setFieldValue(`items.${index}.brand`, selectedBrandId);
    setFieldValue(`items.${index}.products`, []);
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
  const goBack = () => {
    window.history.back();
  };


  return (
    <Layout>
      {/* <DndProvider backend={HTML5Backend}> */}
      <div className="col-12 stretch-card container-fluid">
      <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer" onClick={goBack} />
          <h2 className="heading">Add Widget</h2>
        </div>
      
      
           
            <Formik
              initialValues={initialValues}
              validationSchema={addWidgetValidation}
              validateOnBlur={true}
              validateOnChange={false}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values, { setSubmitting });
              }}
            >
              {({ values, errors, isSubmitting, setFieldValue,field }) => (
                <Form>

<div className="card">
          <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="placement_id" className="form-label">
                      Placement:
                    </label>
                    <Field
                      as="select"
                      id="placement_id"
                      name="placement_id"
                      className="form-select"
                      style={{ width: '30%' }}
                    >
                      <option value="">Select Position</option>
                     { widgetPositions?.map(pos => {
                        return <option value={pos.value} key={pos.value}>{pos.name}</option>
                      })}
                      {/* <option value="p1">Position 1</option>
                      <option value="p2">Position 2</option>
                      <option value="p3">Position 3</option>
                      <option value="p4">Position 4</option>
                      <option value="p5">Position 5</option>
                      <option value="p6">Position 6</option>
                      <option value="p7">Position 7</option>
                      <option value="p8">Position 8</option>
                      <option value="p9">Position 9</option>
                      <option value="p10">Position 10</option> */}
                      {/* Add more options as needed */}
                    </Field>
                    {/* <ErrorMessage name="placement_id" component="div" /> */}
                    {errors.placement_id && (
                      <p className="text-danger">{errors.placement_id}</p>
                    )}
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
                      style={{ width: '50%' }}
                    ></Field>
                    {errors.title && (
                      <p className="text-danger">{errors.title}</p>
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
                      style={{ width: '50%' }}
                    ></Field>
                    {errors.subtitle && (
                      <p className="text-danger">{errors.subtitle}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="widget_type" className="form-label">
                      Widget Type:
                    </label>
                    <Field
                      as="select"
                      id="widget_type"
                      name="widget_type"
                      className="form-select"
                     onChange={(e) => {
                      handleWidgetChange(e); 
                      setFieldValue('widget_type', e.target.value);
                      setFieldValue('items', [{}]);
                    }}
                    style={{ width: '50%' }}
                    >
                      <option value="">Select Widget</option>
                      <option value="slideshow">Slide Show</option>
                      <option value="categories">Categories</option>
                      <option value="brands">Brands</option>
                      <option value="products">Products</option>
                      <option value="featured_categories">Featured Categories</option>
                      <option value="featured_brand">Featured Brand</option>

                     
                    </Field>
                    {/* <ErrorMessage name="widget_type" component="div" /> */}
                    {errors.widget_type && (
                      <p className="text-danger">{errors.widget_type}</p>
                    )}
                  </div>

                  </div>
        </div>
                  
        <div className="card">
          <div className="card-body">

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
                   {widgetType === "brands" && showItemForm && (
                     
                     <BrandWidget
                     values={values}
                     
                     setFieldValue={setFieldValue}
                     onDragEnd={onDragEnd}
                     showButton={showButton}
                      brands={brands}
                     handleAddItem={handleAddItem}
                    
                   />
                   )}
                    {widgetType === "products" && showItemForm && (
                     
                     <ProductWidget
                     values={values}
                     
                     setFieldValue={setFieldValue}
                     onDragEnd={onDragEnd}
                     showButton={showButton}
                     productOptions={prodOption}
                     handleAddItem={handleAddItem}
                     handleSelectIdChange={handleSelectIdChange}
                    
                   />
                   )}
                    {widgetType === "featured_brand"  && (
                     
                     <FeaturedBrand
                     values={values}
                     
                     setFieldValue={setFieldValue}
                     onDragEnd={onDragEnd}
                     showButton={showButton}
                     productOptions={prodOption}
                     featuredBrandProducts={featuredBrandProducts}
                     brands={brands}
                     handleAddItem={handleAddItem}
                     handleFeaturedBrandChange={handleFeaturedBrandChange}
                    
                   />
                   )}
                   {widgetType === "featured_categories" && showItemForm && (
                     
                     <FeaturedCategories
                     values={values}
                     
                     setFieldValue={setFieldValue}
                     onDragEnd={onDragEnd}
                     showButton={showButton}
                     productOptions={prodOption}
                     featuredCategoryProducts={featuredCategoryProducts}
                     categories={categories}
                     handleAddItem={handleAddItem}
                     handleFeaturedCategoryChange={handleFeaturedCategoryChange}
                    
                   />
                   
                   )}
                    <ErrorMessage name="items" className="text-danger" component="div" />
                    <div className="d-flex justify-content-end">
                      { showSaveButton && (
                            <button
                            type="submit"
                            className="btn btn-sm mt-2 px-5 py-2 me-3"
                            style={{ backgroundColor: '#D93D6E', color: "white", fontSize:"15px" }}
                          >
                            Save
                          </button>
                      )}
                
                    </div>
                  </>

                  </div>
                  </div>

                </Form>
              )}
            </Formik>
        
      </div>

     
      {/* </DndProvider> */}
    </Layout>
  );
};

export default CreateHomeWidget;
