import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import CustomFileInput from "./CustomFileInput";

const BrandWidget = ({
  values,
  setFieldValue,
  onDragEnd,
  showButton,
  handleAddItem,
  brands,

}) => {

    
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
                  <h5>Brand Items:</h5>
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
                          <div className="card">
                            <div className="card-body">
                              <h6>{`Item ${index + 1}`}</h6>
                              <div className="d-flex">
                                <div className="col-md-8">
                                  <div className="row">
                                    <div className="col-md-6 mb-2">
                                      <label className="form-label">
                                        Brand:
                                      </label>
                                      <Field
                                        as="select"
                                        className="form-select"
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
                                <div className="col-md-4 ms-4 mt-2">
                                  <button
                                    className="btn btn-sm btn-danger ms-1"
                                    onClick={() => remove(index)}
                                  >
                                    <span>
                                      <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                  </button>
                                  <button className="btn btn-sm btn-warning ms-4">
                                    <span>
                                      <FontAwesomeIcon
                                        icon={faUpDownLeftRight}
                                      />
                                    </span>
                                  </button>
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
                  {showButton && (
                    <button
                      type="button"
                      className="btn btn-circle btn-success rounded-circle mt-1"
                      style={{ width: "65px", height: "65px" }}
                      onClick={() => {
                        push({});
                        handleAddItem(values, setFieldValue);
                      }}
                    >
                      Add Item
                    </button>
                  )}
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
