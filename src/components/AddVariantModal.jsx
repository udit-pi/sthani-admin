import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function AddVariantModalComponent(props) {
  const [newSelectedVariants, setNewSelectedVariants] = useState([]);
  const [variant, setVariant] = useState({
    name: "", // Ensure this is initialized to an empty string
    customName: "",
  });

  const customNameRefs = useRef([]);
const customOptionsRefs = useRef([]);

  const handleAddVariant = () => {
    setNewSelectedVariants([...newSelectedVariants, { name: "", options: [] }]);
  };

  // const handleChange = (e, index) => {
  //   console.log(index);
  //   console.log(e.target.value);
  //   const selectedName = e.target.value;
  //   const selectedVariant = props.variants.find(
  //     (variant) => variant.name === selectedName
  //   );

  //   if (selectedVariant) {
  //     const updatedVariants = [...newSelectedVariants];
  //     updatedVariants[index] = {
  //       name: selectedVariant.name,
  //       options: selectedVariant.options,
  //     };
  //     setNewSelectedVariants(updatedVariants);
  //   }
  // };

  const handleChange = (e, index) => {
    console.log("Index:", index);
    console.log("Selected Value:", e.target.value);
    const selectedName = e.target.value;

    // Check if selectedName is "Custom"
    if (selectedName === "Custom") {
      const customNameInput = customNameRefs.current[index];
    const customOptionsInput = customOptionsRefs.current[index];
    console.log("Custom Name Ref:", customNameRefs.current);
    console.log("Custom Options Ref:", customOptionsRefs.current);

    const customName = customNameInput?.value;
    const customOptions = customOptionsInput?.value?.split(',');

    console.log("Custom Name:", customName);
    console.log("Custom Options:", customOptions);

    // if (!customName || !customOptions || customName.trim() === "" || customOptions.some(opt => opt.trim() === "")) {
    //     alert("Custom name or options cannot be empty");
    //     return; // Exit early if custom name or options are empty
    // }
        const customVariant = {
            name: customName,
            options: customOptions?.map(opt => opt.trim())
        };

        const updatedVariants = [...newSelectedVariants];
        updatedVariants[index] = customVariant;
        setNewSelectedVariants(updatedVariants);
        return; // Exit early
    }

    // Handle standard variant selection
    const selectedVariant = props.variants.find(
        (variant) => variant.name === selectedName
    );

    console.log("Selected Variant:", selectedVariant); // Log the selected variant

    if (selectedVariant) {
        const updatedVariants = [...newSelectedVariants];
        updatedVariants[index] = {
            name: selectedVariant.name,
            options: selectedVariant.options,
        };
        setNewSelectedVariants(updatedVariants);
    }
};
  const handleRemoveVariant = (index) => {
    const updatedVariants = [...newSelectedVariants];
    updatedVariants.splice(index, 1);
    setNewSelectedVariants(updatedVariants);
  };

  const handleRemoveOption = (variantIndex, optionIndex) => {
    console.log(
      `Removing option at index ${optionIndex} from variant at index ${variantIndex}`
    );

    if (variantIndex < 0 || variantIndex >= newSelectedVariants.length) {
      console.error(`Invalid variantIndex: ${variantIndex}`);
      return;
    }

    const variant = newSelectedVariants[variantIndex];

    if (
      !variant ||
      !variant.options ||
      optionIndex < 0 ||
      optionIndex >= variant.options.length
    ) {
      console.error(
        `Invalid optionIndex for variantIndex ${variantIndex}: ${optionIndex}`
      );
      return;
    }

    // Create a copy of the selectedVariants array
    const updatedVariants = [...newSelectedVariants];

    // Remove the option from the variant's options array
    updatedVariants[variantIndex] = {
      ...variant,
      options: variant.options
        .slice(0, optionIndex)
        .concat(variant.options.slice(optionIndex + 1)),
    };

    setNewSelectedVariants(updatedVariants);
  };
  const handleSubmit = () => {
    // Simulate saving the selected variants
    console.log("Selected variants:", newSelectedVariants);
    props.onNewVariant(newSelectedVariants);
    // Here you can send the data to your backend or save it in state, etc.
  };
  return (
    <>
      <div className="modal" tabIndex="-1" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content" style={{ zIndex: "1050" }}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Variant</h5>
              <button
                type="button"
                className="btn-close"
                onClick={props.handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="container mt-5">
                {newSelectedVariants?.map((variant, index) => (
                  <div key={index} className="mb-3">
                    <select
                      className="form-select mb-2"
                      value={variant.name}
                      onChange={(e) => {
                        console.log("Selected Value:", e.target.value); // Debug: Check the selected value
                        handleChange(e, index);
                      }}
                    >
                      <option value="">Select Variant</option>
                      <option value="Custom">Custom</option>
                      {props.variants.map((v, i) => (
                        <option key={i} value={v.name}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                    {variant.name === "Custom" && (
                      <div>
                        <input
                          type="text"
                          ref={(el) => (customNameRefs.current[index] = el)}
                          // id={`customName${index}`}
                          placeholder="Enter custom name"
                          className="mb-2"
                        />
                        <input
                          type="text"
                          // id={`customOptions${index}`}
                          ref={(el) => (customOptionsRefs.current[index] = el)}
                          placeholder="Enter options (comma-separated)"
                          className="mb-2"
                        />
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            // Add new input field for custom option
                            const customOptionsInput = document.getElementById(
                              `customOptions${index}`
                            );
                            if (customOptionsInput) {
                              const newOptionInput =
                                document.createElement("input");
                              newOptionInput.type = "text";
                              newOptionInput.placeholder = "Enter option";
                              newOptionInput.className = "mb-2";
                              customOptionsInput.parentNode.insertBefore(
                                newOptionInput,
                                customOptionsInput.nextSibling
                              );
                            }
                          }}
                        >
                          Add Option
                        </button>
                      </div>
                    )}

                    {variant.name && (
                      <>
                        <label className="form-label">Variant Options</label>
                        <div className="d-flex">
                          {variant.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="ms-2">
                              {option}
                              <button
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() =>
                                  handleRemoveOption(index, optionIndex)
                                }
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => handleRemoveVariant(index)}
                    >
                      Remove Variant
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-success mb-3"
                  onClick={handleAddVariant}
                >
                  Add Variant
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={props.handleClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddVariantModalComponent;
