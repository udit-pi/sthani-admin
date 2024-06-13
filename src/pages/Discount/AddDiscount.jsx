import React, { useState } from 'react'
import Layout from '../../components/layouts/Layout'
import { FaArrowLeft } from "react-icons/fa";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { addDiscount } from '../../features/discount/discountSlice';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { Navigate, useNavigate } from 'react-router-dom';
import { AddDiscountValidation } from '../../validations/addDiscountValidation';

const AddDiscount = () => {
  const [loading, setLoading] = useState(false);
  const initialValues = {
    code: "",

  };
  const [showMinimumPurchaseDefault, setshowMinimumPurchaseDefault] = useState('No minimum requirement');
  const [discountType, setDiscountType] = useState('');
  const [showMinimumPurchaseInput, setShowMinimumPurchaseInput] = useState(false);
  const [limitToOneUse, setLimitToOneUse] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const generateRandomCode = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.toUpperCase();
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    // console.log(values);
    const res = await dispatch(addDiscount(values)).unwrap();
    console.log(res)
    if (res) {
      toast.success("Discount created successfully!");
      navigate("/discount");
    }
  };

  const goBack = () => {
    window.history.back();
  };
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer" onClick={goBack} />
          <h2 className="heading">Add discount</h2>
        </div>


        <Formik
          initialValues={initialValues}
          validationSchema={AddDiscountValidation}
          onSubmit={(values) => {
            console.log(values);
            handleSubmit(values);
          }}
        >
          {({ values, errors, setFieldValue }) => (
            <Form>
              <div className="card">
                <div className="card-body">

                  <div className="mb-3">
                    <label className="form-label">Discount Type</label>
                    <div className="d-flex">
                      <div className="form-check me-3">
                        <Field
                          type="radio"
                          className="form-check-input"
                          id="order_discount"
                          name="discountType"
                          value="ORDER_DISCOUNT"
                          onChange={() => {
                            setFieldValue('discountType', 'ORDER_DISCOUNT')
                            // values.minimumPurchaseRequirement="No minimum requirement"
                            setFieldValue('No minimum requirement', "No minimum requirement")




                          }}
                        />
                        <label className="form-check-label ms-1" htmlFor="order_discount">
                          ORDER DISCOUNT
                        </label>
                      </div>
                      <div className="form-check">
                        <Field
                          type="radio"
                          className="form-check-input"
                          id="free_shipping"
                          name="discountType"
                          value="FREE_SHIPPING"
                          onChange={() => {

                            setFieldValue('discountType', 'FREE_SHIPPING')




                          }

                          }
                        />
                        <label className="form-check-label ms-1" htmlFor="free_shipping">
                          FREE SHIPPING
                        </label>
                      </div>
                    </div>
                    {errors.discountType && (
                      <small className="text-danger">
                        {errors.discountType}
                      </small>
                    )}
                  </div>




                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">
                      Code
                    </label>
                    <Field
                      type="code"
                      className="form-control"
                      id="code"
                      name="code"
                      aria-describedby="nameHelp"


                    />
                    <button
                      type="button"
                      className="btn btn-link p-0 ms-2"

                      style={{
                        color: 'blue',
                        textDecoration: 'none',
                        position: 'absolute',
                        right: 40,
                        top: 100
                      }}
                      onClick={() => setFieldValue('code', generateRandomCode())}
                    >
                      GENERATE RANDOM CODE
                    </button>




                    {errors.code && (
                      <small className="text-danger">
                        {errors.code}
                      </small>
                    )}
                  </div>


                  {values.discountType === 'ORDER_DISCOUNT' && (

                  <div className="mb-3">
                    <label className="form-label">Discount Value</label>
                    <div className="d-flex align-items-center">
                      <Field
                        as="select"
                        className="form-select me-3"
                        name="discountValueType"
                        onChange={(e) => {
                          const value = e.target.value;
                          setFieldValue('discountValueType', value);
                          setDiscountType(value);
                        }}
                      >
                        <option value="">Select Type</option>
                        <option value="PERCENTAGE">PERCENTAGE</option>
                        <option value="AMOUNT">AMOUNT</option>
                      </Field>
                      <div className="input-group">
                        {discountType === 'AMOUNT' && (
                          <span className="input-group-text">AED</span>
                        )}
                        <Field
                          type="text"
                          className="form-control"
                          id="discountValue"
                          name="discountValue"
                        />
                        {discountType === 'PERCENTAGE' && (
                          <span className="input-group-text">%</span>
                        )}
                      </div>
                    </div>
                    {errors.discountValue && (
                      <small className="text-danger">
                        {errors.discountValue}
                      </small>
                    )}
                  </div>
                  )}

                  {values.discountType === 'ORDER_DISCOUNT' && (
                    <div className="mb-3">
                      <label className="form-label">Minimum Purchase Requirement</label>
                      <div>
                        <div className="form-check">
                          <Field
                            type="radio"
                            className="form-check-input"
                            id="no_minimum_requirement"
                            name="minimumPurchaseRequirement"
                            value="No minimum requirement"
                            onChange={() => {
                              setFieldValue('minimumPurchaseRequirement', 'No minimum requirement');
                              setShowMinimumPurchaseInput(false);
                            }}
                          />
                          <label className="form-check-label ms-1" htmlFor="no_minimum_requirement">
                            No minimum requirement
                          </label>
                        </div>
                        <div className="form-check">
                          <Field
                            type="radio"
                            className="form-check-input"
                            id="minimum_purchase_amount"
                            name="minimumPurchaseRequirement"
                            value="Minimum purchase amount"
                            onChange={() => {
                              setFieldValue('minimumPurchaseRequirement', 'Minimum purchase amount');
                              setShowMinimumPurchaseInput(true);
                            }}
                          />
                          <label className="form-check-label ms-1" htmlFor="minimum_purchase_amount">
                            Minimum purchase amount (AED)
                          </label>
                        </div>
                        {showMinimumPurchaseInput && (
                          <Field
                            type="text"
                            className="form-control mt-2"
                            id="minimum_purchase_amount_input"
                            name="minimumPurchaseAmount"
                          />
                        )}
                      </div>
                    </div>
                  )}








                  <div className="mb-3">
                    <label className="form-label">Start Date & Time</label>
                    <div className="d-flex">


                      <Field type="date" className="form-control me-3" name="startDate" />
                      <Field type="time" className="form-control" name="startTime" />
                    </div>
                    {errors.startDate && (
                      <small className="text-danger">
                        {errors.startDate}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <Field
                        type="checkbox"
                        className="form-check-input"
                        id="set_end_date"
                        name="setEndDate"
                        checked={showEndDate}
                        onChange={() => setShowEndDate(!showEndDate)}
                      />
                      <label className="form-check-label ms-1" htmlFor="set_end_date">
                        Set End Date & Time
                      </label>
                    </div>
                  </div>

                  {showEndDate && (
                    <div className="mb-3">
                      <label className="form-label">End Date & Time</label>
                      <div className="d-flex">
                        <Field type="date" className="form-control me-3" name="endDate" />
                        <Field type="time" className="form-control" name="endTime" />
                      </div>
                      {errors.endDate && (
                        <small className="text-danger">
                          {errors.endDate}
                        </small>
                      )}
                    </div>
                  )}

                  <hr />

                  <div className="mb-3">
                    <div className="form-check">
                      <Field
                        type="checkbox"
                        className="form-check-input"
                        id="limit_to_one_use"
                        name="limitToOneUse"
                        checked={limitToOneUse}
                        onChange={() => {
                          setFieldValue('limitToOneUse', !limitToOneUse);
                          setLimitToOneUse(!limitToOneUse);
                        }}
                      />
                      <label className="form-check-label ms-1" htmlFor="limit_to_one_use">
                        Limit to one use per customer
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <Field
                        type="checkbox"
                        className="form-check-input"
                        id="active"
                        name="status"
                        checked={values.status === 'Active'}
                        onChange={() => {
                          setFieldValue('status', values.status === 'Active' ? 'Inactive' : 'Active');
                        }}
                      />
                      <label className="form-check-label ms-1" htmlFor="active">
                        Set as Active
                      </label>
                    </div>
                  </div>
                </div>



              </div>




              <button
                className="btn  w-100 py-8 fs-4 mb-4 rounded-2 mt-4"
                type="submit"
                style={{ backgroundColor: '#D93D6E', color: "white" }}
              >
                {loading ? "Loading..." : "Create Discount"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  )
}

export default AddDiscount