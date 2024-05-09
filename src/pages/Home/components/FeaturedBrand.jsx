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
                  <h5>Featured Brand Items:</h5>
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
                              <h4>{`Item ${index + 1}`}</h4>
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
                                        name={`items.${index}.featuredBrand`}
                                        required
                                        onChange={(e) => {
                                            handleFeaturedBrandChange(e);
                                            setFieldValue(
                                              `items.${index}.featuredBrand`,
                                              e.target.value
                                            );
                                          }}
                                      >
                                        <option value="">Select Brand</option>
                                        {brands.map((brand, brandIndex) => (
                                          <option
                                            key={brandIndex}
                                            value={brand.id}
                                          >
                                            {brand.name}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                      <label className="form-label">
                                        Product:
                                      </label>
                                      <MultiSelectDropdown
                                        name={`items.${index}.product`}
                                        options={featuredBrandProducts}
                                      />
                                    </div>
                                   
                                  </div>
                                  <div className="row">
                                    <div className="col-md-6 mb-2">
                                      <label className="form-label">Tag:</label>
                                      <Field
                                        type="text"
                                        className="form-control"
                                        name={`items.${index}.tag`}
                                      />
                                    </div>
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
                                    <div className="col-md-6 mb-2">
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

export default FeaturedBrand;
