import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/layouts/Layout';
import { fetchShippingRates, addShippingRate, deleteShippingRate } from '../features/shippingrate/shippingrateSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const ShippingRatesManager = () => {
    const dispatch = useDispatch();
    const { items: shippingRates, loading } = useSelector((state) => state.shippingRates);

    useEffect(() => {
        dispatch(fetchShippingRates());
    }, [dispatch]);

    const validationSchema = Yup.object({
        minValue: Yup.number().required('Minimum value is required').min(0, 'Must be at least 0'),
        maxValue: Yup.number().required('Maximum value is required').positive('Must be greater than zero'),
        rate: Yup.number().required('Rate is required').min(0, 'Must be at least 0'),
    });

    const handleAddRate = async (values, { resetForm }) => {
        try {
            await dispatch(addShippingRate(values)).unwrap();
            toast.success('Shipping rate added successfully!');
            resetForm();
        } catch (err) {
            const errorMessage = err.message || 'Failed to add shipping rate';
            toast.error(`Failed to add shipping rate: ${errorMessage}`);
        }
    };

    const handleDeleteRate = async (id) => {
        try {
            await dispatch(deleteShippingRate(id)).unwrap();
            toast.success('Shipping rate deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete shipping rate');
        }
    };

    return (
        <Layout>
            <h2 className="heading ms-3">Shipping Rates Manager</h2>

            <div className="col-12 stretch-card container-fluid">
                <div className="container mt-4">
                    
                    <Formik
                        initialValues={{ minValue: '', maxValue: '', rate: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleAddRate}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="row mb-3">
                                    <div className="col">
                                        <Field type="number" name="minValue" className="form-control" placeholder="Minimum Value" step="0.01" />
                                        <ErrorMessage name="minValue" component="div" className="text-danger" />
                                    </div>
                                    <div className="col">
                                        <Field type="number" name="maxValue" className="form-control" placeholder="Maximum Value" step="0.01" />
                                        <ErrorMessage name="maxValue" component="div" className="text-danger" />
                                    </div>
                                    <div className="col">
                                        <Field type="number" name="rate" className="form-control" placeholder="Rate" step="0.01" />
                                        <ErrorMessage name="rate" component="div" className="text-danger" />
                                    </div>
                                    <div className="col-auto">
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            <FontAwesomeIcon icon={faPlus} /> Add Rate
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    {shippingRates.length >0 ? 
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Min Value</th>
                                <th scope="col">Max Value</th>
                                <th scope="col">Rate</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shippingRates.map((rate) => (
                                <tr key={rate._id}>
                                    <td>{rate.minValue.toFixed(2)}</td>
                                    <td>{rate.maxValue.toFixed(2)}</td>
                                    <td><span className='text-black text-opacity-50'>AED</span> <b>{rate.rate.toFixed(2)}</b></td>
                                    <td>
                                        <button onClick={() => handleDeleteRate(rate._id)} className="btn btn-link">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : <div className='w-100 text-muted text-center m-5' >No Rates added</div>}
                    {loading && <p>Loading...</p>}
                    
                </div>
            </div>
        </Layout>
    );
};

export default ShippingRatesManager;
