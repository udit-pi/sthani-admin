import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpDownLeftRight , faBars } from "@fortawesome/free-solid-svg-icons";
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
  const index = 0
  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h5>Featured Brand Item:</h5>
       
      </div>

      <div className="card" style={{ background: "#F2F2F2" }} >
        <div className="card-body">
          <div className="d-flex justify-content-between">


        

            <div className="col-md-10">
              <div className="d-flex">
                <div className="col-md-5 mb-2">
                  <label className="form-label">Brand:</label>
                  <Field
                    as="select"
                    className="form-select bg-white"
                    name={`items.${index}.brand`}
                    required={true}
                    onChange={(e) =>
                      handleFeaturedBrandChange(e, setFieldValue, index)
                    }
                  >
                    <option value="">Select Brand</option>
                    {brands.map((item, brandIndex) => (
                      <option key={brandIndex} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-5 mb-2 ms-3">
                  <label className="form-label">Product:</label>
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
                    className="form-control bg-white"
                    name={`items.${index}.tag`}
                  />
                
                </div>

                <div className="col-md-5 mb-2 ms-3">
                  <label className="form-label">Description:</label>
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
  );
};

export default FeaturedBrand;
