import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpDownLeftRight, faBars } from "@fortawesome/free-solid-svg-icons";
import CustomFileInput from "./CustomFileInput";
import EditFileInput from "./EditFileInput";

const SlideShowWidget = ({
  values,
  setFieldValue,
  onDragEnd,
  showButton,
  destinationOptions,
  handleAddItem,
  handleSelectIdChange,
  handleDestinationChange,
  brands,
  formData,
  fetchedId
}) => {
  // const imageBaseUrl = "http://localhost:3500/api/uploads/";

  const imageBaseUrl = `${process.env.REACT_APP_MEDIA_URL}`;
  // const imageBaseUrl = `${process.env.REACT_APP_API_URL}/api/uploads/`;

  const addNewItemAtTop = (push, values, setFieldValue) => {
    // Create a new blank item
    const newItem = {
      image: '',
      description: '',
      tag: '',
      brand: '',
      destination: '',
      id: '',
    };

    // Use push to add the new item (to trigger Formik state updates)
    push(newItem);

    // Reorder items so the new item is at the top
    const newItemsArray = [newItem].concat(values.items);

    // Set the reordered array back into Formik's state
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
                    <h5>Slideshow Items:</h5>
                    {showButton && (
                      <button
                        type="button"
                        className="btn  btn-dark mb-4 "
                        // style={{ width: "65px", height: "65px" }}
                        // onClick={() => {
                        //   // insert(0, {});
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
                          <div className="card" style={{ backgroundColor: "#F2F2F2" }}  >
                            <div className="card-body">
                              <div className="d-flex justify-content-between">

                                <div className="left-container d-flex justify-content-between flex-column  " style={{width:"20%"}} >

                                  <div className=" d-flex align-items-center ">

                                    <FontAwesomeIcon icon={faBars} style={{ color: "#cc1d54" }} className="me-3" />

                                    <h4 className="fs-5 mb-0">{`Item ${index + 1}`}</h4>


                                  </div>




                                  <div className=" ms-4 mt-2">
                                    <button
                                    typeof="button"
                                      className="btn ms-1"
                                      onClick={() => remove(index)}
                                    >
                                      <span>
                                        <FontAwesomeIcon icon={faTrash} />
                                      </span>

                                    </button>
                                    <p>Remove</p>
                                    {/* <button className="btn btn-sm btn-warning ms-4">
                                              <span>
                                                <FontAwesomeIcon
                                                  icon={faUpDownLeftRight}
                                                />
                                              </span>
                                            </button> */}
                                  </div>

                                </div>

                                <div className="middle-container" style={{width:"70%"}}  >
                                  <div className="row">
                                    <div className="col-md-12 mt-2">
                                      <label className="form-label">
                                        Image:
                                      </label>
                                      <div className="d-flex justify-content-between">
                                        <Field
                                          component={
                                            values.items[index].image
                                              ? EditFileInput
                                              : CustomFileInput
                                          }
                                          className="form-control bg-white "
                                          name={`items.${index}.image`}
                                          style={{
                                            height: "10%",
                                            width: "78%",
                                          }}
                                        />
                                        
                                      </div>
                                    </div>
                                    <div className="col-md-12 mt-2">
                                      <label className="form-label">
                                        Description:
                                      </label>
                                      <Field
                                        as="textarea"
                                        type="text"
                                        className="form-control bg-white  "
                                        name={`items.${index}.description`}
                                        style={{ width: "78%" }}
                                        rows={3}
                                      />
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="col-md-5 mt-2">
                                      <label className="form-label">Tag:</label>
                                      <Field
                                        type="text"
                                        className="form-control bg-white "
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

                                    <div className="col-md-4 mt-2 ms-4">
                                      <label className="form-label">
                                        Brand:
                                      </label>
                                      <Field
                                        as="select"
                                        className="form-select bg-white  "
                                        name={`items.${index}.brand`}
                                      >
                                        <option value="">Select brand</option>
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
                                  </div>

                                  <div className="mt-2 mb-2 ">
                                    <label className="form-label ">Link:</label>
                                    {/* <Field type="text" name={`slideshowItems.${index}.link`} /> */}
                                  </div>
                                  <div className="d-flex">
                                    <div className="col-md-5 mb-2">
                                      <label className="form-label">
                                        Destination:
                                      </label>
                                      <Field
                                        as="select"
                                        className="form-select bg-white "
                                        name={`items.${index}.destination`}
                                        onChange={(e) => handleDestinationChange(e, setFieldValue, index)}
                                      >
                                        <option value="">
                                          Select Destination
                                        </option>
                                        <option value="product">Product</option>
                                        <option value="brand">Brand</option>
                                        <option value="category">
                                          Category
                                        </option>
                                      </Field>
                                    </div>
                                    <div className="col-md-4 mb-2 ms-4">
                                      <label className="form-label">ID:</label>
                                    
                                      <Select
                                        name={`items.${index}.id`}
                                        options={destinationOptions}
                                        // value={destinationOptions.map(
                                        //   (option) => fetchedId.find(id =>option.value === id)
                                            
                                        // )}
                                        onChange={(selectedOption) => {
                                          handleSelectIdChange(
                                            `items.${index}.id`,
                                            selectedOption,
                                            setFieldValue
                                          );
                                          console.log(selectedOption);
                                        }}
                                        isSearchable={true}
                                        placeholder="Select ID"
                                      />
                                    </div>
                                  </div>
                                </div>


                                <div className="right-container" style={{width:"auto"}} >
                                {values.items[index].image && (
                                          <img
                                            src={
                                              imageBaseUrl +
                                              values.items[index].image.name
                                            }
                                            className="ms-2  image-cover bg-white "
                                            alt=""
                                            width={150}
                                            height={150}
                                          />
                                        )}
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

export default SlideShowWidget;
