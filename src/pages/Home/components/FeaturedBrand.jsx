import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import CustomFileInput from "./CustomFileInput";
import MultiSelectDropdown from "../../../components/MultiSelectDropDown";

const FeaturedBrand = ({
  values,
  setFieldValue,
  onDragEnd,
  showButton,
  productOptions,
  handleAddItem,
  handleFeaturedBrandChange,
  featuredBrandProducts,
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
                  <div className="d-flex justify-content-between">
                    <h5>Featured Brand Items:</h5>
                    {showButton && (
                      <button
                        type="button"
                        className="btn  btn-dark"
                        // style={{ width: "65px", height: "65px" }}
                        onClick={() => {
                          push({});
                          handleAddItem(values, setFieldValue);
                        }}
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
                          <div className="card">
                            <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <h4>{`Item ${index + 1}`}</h4>
                             
                                <div className="col-md-10">
                                  <div className="d-flex">
                                    <div className="col-md-5 mb-2">
                                      <label className="form-label">
                                        Brand:
                                      </label>
                                      <Field
                                        as="select"
                                        className="form-select"
                                        name={`items.${index}.brand`}
                                        required={true}
                                        onChange={(e) => {
                                            handleFeaturedBrandChange(e);
                                            setFieldValue(
                                              `items.${index}.brand`,
                                              e.target.value
                                            );
                                          }}
                                      >
                                        <option value="">Select Brand</option>
                                        {brands.map((item, brandIndex) => (
                                          <option
                                            key={brandIndex}
                                            value={item.id}
                                          >
                                            {item.name}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                    <div className="col-md-5 mb-2 ms-3">
                                      <label className="form-label">
                                        Product:
                                      </label>
                                      <MultiSelectDropdown
                                        name={`items.${index}.products`}
                                        options={featuredBrandProducts}
                                        required={true}
                                      />
                                    </div>
                                   
                                  </div>
                                  <div className="d-flex">
                                    <div className="col-md-5 mb-2">
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
                                   
                                    <div className="col-md-5 mb-2 ms-3">
                                      <label className="form-label">
                                        Description:
                                      </label>
                                      <Field
                                        as="textarea"
                                        type="text"
                                        className="form-control"
                                        name={`items.${index}.description`}
                                      />
                                    </div>
                                   
                                  </div>
                                </div>
                              
                              </div>
                                <div className="col-md-4 mt-2">
                                  <button
                                    className="btn btn-sm btn-danger ms-1"
                                    onClick={() => remove(index)}
                                  >
                                    <span>
                                      <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                  </button>
                                 
                                  <p>Remove</p>
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

export default FeaturedBrand;
