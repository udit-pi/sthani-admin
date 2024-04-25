import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../features/auth/authSlice';
import { Formik, Form, Field } from 'formik'
import { loginValidation } from '../validations/loginValidation';

const initialValues = {
    email: '',
    password: ''
}

const Login = () => {


    //redux states 
    const { loading, error,user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = async (values) => {
        console.log(values);

        dispatch(login(values)).then((result) => {
            if (result.payload) {
                navigate('/dashboard');
            }
        })

    }
    if(user) {
        return <Navigate to ="/dashboard" />
    }

    return (
        <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
            <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <Link to="/" className="text-nowrap logo-img text-center d-block py-3 w-100">
                                        <h2>Sthani Ecommerce</h2>
                                    </Link>
                                    <p className="text-center">Log in to your dashboard</p>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={loginValidation}
                                        onSubmit={(values) => {
                                            userLogin(values);
                                        }}

                                    >
                                        {({ errors }) => (

                                            <Form>
                                                <div className="mb-3">
                                                    <label htmlFor="email" className="form-label">Email</label>
                                                    <Field type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp"></Field>
                                                    {errors.email && <small className='text-danger'>{errors.email}</small>}
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="password" className="form-label">Password</label>
                                                    <Field type="password" className="form-control" id="password" name='password'></Field>
                                                    {errors.password && <small className='text-danger'>{errors.password}</small>}
                                                </div>
                                               
                                                <button className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2" type="submit" >{loading ? 'Loading...' : 'Sign In'}</button>
                                                {
                                                    error && (
                                                        <div className='alert alert-danger' role='alert'>{error}</div>
                                                    )
                                                }

                                            </Form>
                                        )}

                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Login