import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpDownLeftRight , faBars } from "@fortawesome/free-solid-svg-icons";
import CustomFileInput from "./CustomFileInput";
import MultiSelectDropdown from "../../../components/MultiSelectDropDown";

const FeaturedCategories = ({
  values,
  setFieldValue,
  onDragEnd,
  showButton,
  productOptions,
  handleAddItem,
  handleFeaturedCategoryChange,
  featuredCategoryProducts,
  categories,
}) => {

  const addNewItemAtTop = (push, values, setFieldValue) => {
    // Create a new blank item
    const newItem = {
    
      category: '',
      products: [],
      tag: '',
      description: ''
    };

    
    push(newItem);
  
    const newItemsArray = [newItem].concat(values.items);

    setFieldValue('items', newItemsArray);
    console.log(values.items)
  };

  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result, values, setFieldValue)}
    >
      <Droppable droppableId="items">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <FieldArray name="items">
              {({ push, remove }) => (
                <div>
                  <div className="d-flex justify-content-between">
                    <h5>Featured Category Items:</h5>
                    {showButton && (
                      <button
                        type="button"
                        className="btn  btn-dark mb-4"
                        // style={{ width: "65px", height: "65px" }}
                        // onClick={() => {
                        //   push({});
                        //   handleAddItem(values, setFieldValue);
                        // }}
                        onClick={() => addNewItemAtTop(push,values,setFieldValue )}
                      >
                        Add Item
                      </button>
                    )}
                  </div>
                  {values.items?.map((item, index) => (
                    <Draggable
                      key={index}
                      draggableId={`Item ${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card" style={{ background: "#F2F2F2" }} >
                            <div className="card-body">
                            <div className="d-flex justify-content-between">


                             <div className="left-container w-25 d-flex justify-content-between flex-column">

                              <div className="d-flex w-100 align-items-center ">
                                     

                                     <FontAwesomeIcon icon={faBars} style={{ color: "#cc1d54" }} className="me-3" />
                                    

                                     <h6 className="fs-5 mb-0 ">{`Item ${index + 1}`}</h6>

                              </div>

                              <div className="  mt-2 ms-4">
                                  <button
                                  type="button"
                                    className="btn  ms-1"
                                    onClick={() => remove(index)}
                                  >
                                    <span>
                                      <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                  </button>
                                  <p>Remove</p>
                                 
                                </div>

                              </div>
                              
                                <div className="right-container w-75">
                                  <div className="d-flex">
                                    <div className="col-md-5 mb-2">
                                      <label className="form-label">
                                        Categories:
                                      </label>
                                      <Field
                                        as="select"
                                        className="form-select bg-white "
                                        name={`items.${index}.category`}
                                        value={values.items[index]?.category || ''}
                                        required
                                        onChange={(e) => {
                                            handleFeaturedCategoryChange(e, setFieldValue, index);
                                           
                                          }}
                                      >
                                        <option value="">Select Categories</option>
                                        {categories?.map((cat, catIndex) => (
                                          <option
                                            key={catIndex}
                                            value={cat.id}
                                          >
                                            {cat.name}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                    <div className="col-md-5 mb-2 ms-4">
                                      <label className="form-label">
                                        Product:
                                      </label>
                                      <MultiSelectDropdown
                                        name={`items.${index}.products`}
                                        options={featuredCategoryProducts}
                                        
                                      />
                                    </div>
                                   
                                  </div>
                                  <div className="d-flex">
                                    <div className="col-md-5 mb-2">
                                      <label className="form-label">Tag:</label>
                                      <Field
                                        type="text"
                                        className="form-control bg-white"
                                        name={`items.${index}.tag`}
                                      />
                                    </div>
                                    {/* <div className="mt-2">
                                      {values?.items?.[index]?.tag &&
                                        typeof values.items[index].tag ===
                                          "string" &&
                                        values.items[index].tag
                                          .split(", ")
                                          .map((keyword, index) => (
                                            <span
                                              key={index}
                                              className="badge bg-secondary me-1"
                                            >
                                              {keyword.trim()}
                                            </span>
                                          ))}
                                    </div> */}
                                    <div className="col-md-5 mb-2 ms-4">
                                      <label className="form-label">
                                        Description:
                                      </label>
                                      <Field
                                        as="textarea"
                                        type="text"
                                        className="form-control bg-white "
                                        name={`items.${index}.description`}
                                      />
                                    </div>
                                   
                                  </div>
                                </div>
                               
                             </div>
                            
                            </div>
                          </div>
                        </div>
                        // </DraggableItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                 
                </div>
              )}
            </FieldArray>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FeaturedCategories;
