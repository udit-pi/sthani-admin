import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import CustomFileInput from "./CustomFileInput";
import EditFileInput from "./EditFileInput";

const CategoryWidget = ({
  values,
  setFieldValue,
  onDragEnd,
  showButton,
  handleAddItem,
  categories,

}) => {

  // const imageBaseUrl = "http://localhost:3500/api/uploads/";
    
  // const imageBaseUrl = `${process.env.REACT_APP_API_URL}/api/uploads/`;
  

  const imageBaseUrl = `${process.env.REACT_APP_MEDIA_URL}`;
  // console.log(process.env.REACT_APP_MEDIA_URL)
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
                  <h5>Category Items:</h5>
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
                                        Category:
                                      </label>
                                      <Field
                                        as="select"
                                        className="form-select"
                                        name={`items.${index}.category`}
                                        required
                                      >
                                        <option value="">
                                          Select Category
                                        </option>
                                        {categories.map(
                                          (category, categoryIndex) => (
                                            <option
                                              key={categoryIndex}
                                              value={category.id}
                                            >
                                              {category.name}
                                            </option>
                                            
                                          )
                                        )}
                                      </Field>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                      <label className="form-label">Tag:</label>
                                      <Field
                                        type="text"
                                        className="form-control"
                                        name={`items.${index}.tag`}
                                      />
                                      <div className="mt-2">
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
                                    </div>
                                    </div>
                                    
                                   
                                  </div>

                                  <div className="row">
                                  <div className="col-md-12 mb-2">
                                      <label className="form-label">
                                        Image:
                                      </label>
                                      <Field
                                        component={values.items[index].image ? EditFileInput : CustomFileInput}
                                        className="form-control"
                                        name={`items.${index}.image`}
                                      />
                                     {values.items[index].image && <img
                                    src={imageBaseUrl + values.items[index].image}
                                    alt=""
                                    width={80}
                                    height={80}
                                  />}
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

export default CategoryWidget;
