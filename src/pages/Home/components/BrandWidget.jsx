import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpDownLeftRight , faBars } from "@fortawesome/free-solid-svg-icons";
import CustomFileInput from "./CustomFileInput";

const BrandWidget = ({
  values,
  setFieldValue,
  onDragEnd,
  showButton,
  handleAddItem,
  brands,

}) => {

  const addNewItemAtTop = (push, values, setFieldValue) => {
    // Create a new blank item
    const newItem = {
    
      brand: '',
     
    };

    
    push(newItem);

   
    const newItemsArray = [newItem].concat(values.items);

  
    setFieldValue('items', newItemsArray);
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
                    <h5>Brand Items:</h5>
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
                      draggableId={`Item ${index + 1}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card" style={{ background: "#F2F2F2" }} >
                            <div className="card-body ">
                            <div className="d-flex justify-content-between " style={{height:"150px"}}>

                              <div className="left-container w-25 d-flex justify-content-between flex-column">

                              <div className="d-flex w-100 align-items-center ">
                                     

                                     <FontAwesomeIcon icon={faBars} style={{ color: "#cc1d54" }} className="me-3" />
                                    

                                     <h6 className="fs-5 mb-0 ">{`Item ${index + 1}`}</h6>

                              </div>

                              <div className="  mt-2 ms-4">
                                  <button
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
                                  <div className="row">
                                    <div className="col-md-6 mb-2"  >
                                      <label className="form-label ms-1">
                                        Brand:
                                      </label>
                                      <Field
                                        as="select"
                                        className="form-select bg-white "
                                        name={`items.${index}.brand`}
                                        required
                                      >
                                        <option value="">
                                          Select Brand
                                        </option>
                                        {brands.map(
                                          (brand, brandIndex) => (
                                            <option
                                              key={brandIndex}
                                              value={brand.id}
                                            >
                                              {brand.name}
                                            </option>
                                          )
                                        )}
                                      </Field>
                                      <ErrorMessage name={`items.${index}.brand`} component="div" /> 
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

export default BrandWidget;
