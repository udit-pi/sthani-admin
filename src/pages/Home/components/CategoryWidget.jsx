import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpDownLeftRight ,faBars} from "@fortawesome/free-solid-svg-icons";
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
                  <div className="d-flex justify-content-between">
                    <h5>Category Items:</h5>
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
                      draggableId={`Item ${index + 1}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card mt-3" style={{ background: "#F2F2F2" }}>
                            <div className="card-body">
                              <div className="">


                                <div className="d-flex justify-content-between">

                                  <div className="left-categoryWidget w-25 d-flex justify-content-between flex-column " >
                                    <div className="d-flex w-100 align-items-center ">
                                     

                                      <FontAwesomeIcon icon={faBars} style={{ color: "#cc1d54" }} className="me-3" />
                                     
                               

                                      <h4 className="fs-5 fw-semibold mb-0 ">{`Item ${index + 1}`}</h4>

                                    </div>


                                    <div className="col-md-4 ms-4 mt-2">
                                      <button
                                        className="btn ms-1 py-0 bg-transparent"
                                        onClick={() => remove(index)}
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </button>
                                      <p>Remove</p>
                                    </div>

                                  </div>

                                  <div className="right-categoryWidget w-75 ">

                                    <div className="col-md-10">
                                      <div className="row">
                                        <div className="col-md-5 mb-2">
                                          <label className="form-label">
                                            Category:
                                          </label>
                                          <Field
                                            as="select"
                                            className="form-select bg-white "
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
                                        <div className="col-md-5 mb-2">
                                          <label className="form-label">Tag:</label>
                                          <Field
                                            type="text"
                                            className="form-control bg-white   "
                                            name={`items.${index}.tag`}
                                          />
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
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-10 mb-2">
                                          <label className="form-label ">
                                            Image:
                                          </label>
                                          <Field
                                            component={
                                              values.items[index].image
                                                ? EditFileInput
                                                : CustomFileInput
                                            }
                                            className="form-control bg-white mb-2"
                                            name={`items.${index}.image`}
                                          />
                                          
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="img-box w-15">
                                  {values.items[index].image && (
                                            <img
                                              src={
                                                imageBaseUrl +
                                                values.items[index].image
                                              }
                                              alt=""
                                              width={150}
                                              height={150}
                                              className="image-cover shadow-sm"
                                            />
                                          )}
                                  </div>

                                  {/* <div className="col-md-4 ms-4 mt-2">
                                <button
                                  className="btn ms-1 py-0 bg-transparent"
                                  onClick={() => remove(index)}
                                >
                                <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <p>Remove</p>
                              </div> */}

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

export default CategoryWidget;
