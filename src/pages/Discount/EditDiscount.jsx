import React, { useEffect, useState } from 'react'
import Layout from '../../components/layouts/Layout'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UpdateDiscountById, fetchAllDiscount, fetchDiscountById } from '../../features/discount/discountSlice';
import { FaArrowLeft } from "react-icons/fa";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { toast } from 'react-toastify';
import { AddDiscountValidation, EditDiscountValidation } from '../../validations/addDiscountValidation';
const EditDiscount = () => {
  const [discountType, setDiscountType] = useState('');
  const [showMinimumPurchaseInput, setShowMinimumPurchaseInput] = useState(false);
  const [showMinimumPurchaseInputShow, setShowMinimumPurchaseInputShow] = useState(false);

  const [limitToOneUse, setLimitToOneUse] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [showEndDate, setShowEndDate] = useState(false);
  const generateRandomCode = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.toUpperCase();
  };
  const [loading, setLoading] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchDiscount = async () => {
    const res = await dispatch(fetchDiscountById({ id })).unwrap();
    console.log(res)
    setFilteredCustomers(res)
    setDiscountType(res.discountValueType)
    if (res.minimumPurchaseAmount) {
      setShowMinimumPurchaseInput(true)
      setShowMinimumPurchaseInputShow('Minimum purchase amount')
    }
    if (res.limitToOneUse) {
      setLimitToOneUse(res.limitToOneUse)
    }
    if (res.endDate) {
      setShowEndDate(true)
    }
  };

  useEffect(() => {
    fetchDiscount();
  }, [dispatch]);

  const initialStartDate = filteredCustomers.startDate ? filteredCustomers.startDate.split('T')[0] : '';
  const initialEndDate = filteredCustomers.endDate ? filteredCustomers.endDate.split('T')[0] : '';

  const goBack = () => {
    window.history.back();
  };
  const handleSubmit = async (values) => {
    //  values.deletedImages = deletedImages
    //  console.log(values);


    const res = await dispatch(UpdateDiscountById({ id, values })).unwrap();
    console.log(res);
    if (res) {
      toast.success("Discount updated successfully!");
      navigate("/discount");
    }
  };


  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div style={{ marginBottom: '30px', display: "flex", alignItems: "center", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer" onClick={goBack} />
          <h2 className="heading">Edit discount</h2>
        </div>


        <Formik
          initialValues={{ ...filteredCustomers, startDate: initialStartDate, endDate: initialEndDate, minimumPurchaseRequirement: showMinimumPurchaseInputShow }}
          validationSchema={EditDiscountValidation}
          enableReinitialize={true}
          onSubmit={(values) => {
            //console.log(values);
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
                      <div className='me-3'><b>{values.discountType?.replace("_", " ")}</b></div>
                    </div>
                  </div>




                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">
                      Code
                    </label>
                    <div className='me-3'><b>{values.code}</b></div>
                    {/* <Field
                      type="code"
                      className="form-control"
                      id="code"
                      name="code"
                      aria-describedby="nameHelp"
                      readOnly

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
                    )} */}
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
                        {discountType == 'PERCENTAGE' && (
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
                              setFieldValue('minimumPurchaseAmount', '');

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






                  <hr />

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
                {loading ? "Loading..." : "Edit Discount"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  )
}

export default EditDiscount