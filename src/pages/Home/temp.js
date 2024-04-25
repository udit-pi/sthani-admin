 // <div>
                      //   <DragDropContext
                      //     onDragEnd={(result) =>
                      //       onDragEnd(result, values, setFieldValue)
                      //     }
                      //   >
                      //     <Droppable droppableId="items">
                      //       {(provided) => (
                      //         <div
                      //           {...provided.droppableProps}
                      //           ref={provided.innerRef}
                      //         >
                      //           <FieldArray name="items">
                      //             {({ push, remove }) => (
                      //               <div>
                      //                 <h5>Slideshow Items:</h5>
                      //                 {values.items?.map((item, index) => (
                      //                   //    <DraggableItem
                      //                   //    key={index}
                      //                   //    index={index}
                      //                   //    values={values}
                      //                   //    setFieldValue={setFieldValue}
                      //                   //    moveCard={(fromIndex, toIndex) => {
                      //                   //     const updatedItems = moveItem(values, fromIndex, toIndex);
                      //                   //     setFieldValue('items', updatedItems);
                      //                   //     // console.log(values.items)
                      //                   //     return updatedItems;
                      //                   //   }}
                      //                   //    removeItem={() => remove(index)}
                      //                   //  >
                      //                   <Draggable
                      //                     key={index}
                      //                     draggableId={`Item ${index + 1}`}
                      //                     index={index}
                      //                   >
                      //                     {(provided,snapshot) => (
                      //                       <div
                      //                         ref={provided.innerRef}
                      //                         {...provided.draggableProps}
                      //                         {...provided.dragHandleProps}
                      //                       >
                      //                         <div className="card">
                      //                           <div className="card-body">
                      //                             <h4>{`Item ${index + 1}`}</h4>
                      //                             <div className="d-flex">
                      //                               <div className="col-md-8">
                      //                                 <div className="row">
                      //                                   <div className="col-md-6 mb-2">
                      //                                     <label className="form-label">
                      //                                       Image:
                      //                                     </label>
                      //                                     <Field
                      //                                       type="file"
                      //                                       className="form-control"
                      //                                       name={`items.${index}.image`}
                      //                                     />
                      //                                   </div>
                      //                                   <div className="col-md-6 mb-2">
                      //                                     <label className="form-label">
                      //                                       Description:
                      //                                     </label>
                      //                                     <Field
                      //                                       as="textarea"
                      //                                       type="text"
                      //                                       className="form-control"
                      //                                       name={`items.${index}.description`}
                      //                                     />
                      //                                   </div>
                      //                                 </div>
                      //                                 <div className="row">
                      //                                   <div className="col-md-6 mb-2">
                      //                                     <label className="form-label">
                      //                                       Tag:
                      //                                     </label>
                      //                                     <Field
                      //                                       type="text"
                      //                                       className="form-control"
                      //                                       name={`items.${index}.tag`}
                      //                                     />
                      //                                   </div>
                      //                                   <div className="col-md-6 mb-2">
                      //                                     <label className="form-label">
                      //                                       Brand:
                      //                                     </label>
                      //                                     <Field
                      //                                       as="select"
                      //                                       className="form-select"
                      //                                       name={`items.${index}.brand`}
                      //                                     >
                      //                                       {brands.map(
                      //                                         (
                      //                                           brand,
                      //                                           brandIndex
                      //                                         ) => (
                      //                                           <option
                      //                                             key={
                      //                                               brandIndex
                      //                                             }
                      //                                             value={
                      //                                               brand.id
                      //                                             }
                      //                                           >
                      //                                             {brand.name}
                      //                                           </option>
                      //                                         )
                      //                                       )}
                      //                                     </Field>
                      //                                   </div>
                      //                                 </div>

                      //                                 <div className="mt-2">
                      //                                   <label className="form-label">
                      //                                     Link:
                      //                                   </label>
                      //                                   {/* <Field type="text" name={`slideshowItems.${index}.link`} /> */}
                      //                                 </div>
                      //                                 <div className="d-flex">
                      //                                   <div className="col-md-6 mb-2">
                      //                                     <label className="form-label">
                      //                                       Destination:
                      //                                     </label>
                      //                                     <Field
                      //                                       as="select"
                      //                                       className="form-select"
                      //                                       name={`items.${index}.destination`}
                      //                                       onChange={(e) => {
                      //                                         handleDestinationChange(
                      //                                           e
                      //                                         );
                      //                                         setFieldValue(
                      //                                           `items.${index}.destination`,
                      //                                           e.target.value
                      //                                         );
                      //                                       }}
                      //                                     >
                      //                                       <option value="">
                      //                                         Select Destination
                      //                                       </option>
                      //                                       <option value="product">
                      //                                         Product
                      //                                       </option>
                      //                                       <option value="brand">
                      //                                         Brand
                      //                                       </option>
                      //                                       <option value="category">
                      //                                         Category
                      //                                       </option>
                      //                                     </Field>
                      //                                   </div>
                      //                                   <div className="col-md-6 mb-2 ms-4">
                      //                                     <label className="form-label">
                      //                                       ID:
                      //                                     </label>
                      //                                     <Select
                      //                                       options={
                      //                                         destinationOptions
                      //                                       }
                      //                                       value={ snapshot.isDragging ? destinationOptions.find(option => option.value === values.items[index]?.id) : values.id}
                      //                                       onChange={(
                      //                                         selectedOption
                      //                                       ) =>
                      //                                         handleSelectIdChange(
                      //                                           `items.${index}.id`,
                      //                                           selectedOption,
                      //                                           setFieldValue
                      //                                         )
                      //                                       }
                      //                                       isSearchable={true}
                      //                                       placeholder="Select ID"
                      //                                     />
                                                          
                      //                                   </div>
                      //                                 </div>
                      //                               </div>
                      //                               <div className="col-md-4 ms-4 mt-2">
                      //                                 <button
                      //                                   className="btn btn-sm btn-danger ms-1"
                      //                                   onClick={() =>
                      //                                     remove(index)
                      //                                   }
                      //                                 >
                      //                                   <span>
                      //                                     <FontAwesomeIcon
                      //                                       icon={faTrash}
                      //                                     />
                      //                                   </span>
                      //                                 </button>
                      //                                 <button className="btn btn-sm btn-warning ms-4">
                      //                                   <span>
                      //                                     <FontAwesomeIcon
                      //                                       icon={
                      //                                         faUpDownLeftRight
                      //                                       }
                      //                                     />
                      //                                   </span>
                      //                                 </button>
                      //                               </div>
                      //                             </div>
                      //                           </div>
                      //                         </div>
                      //                       </div>
                      //                       // </DraggableItem>
                      //                     )}
                      //                   </Draggable>
                      //                 ))}
                      //                 {provided.placeholder}
                      //                 {showButton && (
                      //                   <button
                      //                     type="button"
                      //                     className="btn btn-circle btn-success rounded-circle mt-1"
                      //                     style={{
                      //                       width: "65px",
                      //                       height: "65px",
                      //                     }}
                      //                     onClick={() => {
                      //                       push({});
                      //                       handleAddItem(
                      //                         values,
                      //                         setFieldValue
                      //                       );
                      //                     }}
                      //                   >
                      //                     Add Item
                      //                   </button>
                      //                 )}
                      //               </div>
                      //             )}
                      //           </FieldArray>
                      //         </div>
                      //       )}
                      //     </Droppable>
                      //   </DragDropContext>
                      // </div>