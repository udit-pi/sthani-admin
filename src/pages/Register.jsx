import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


// const REGISTER_ENDPOINT = "http://localhost:3500/v1/auth/register"
const REGISTER_ENDPOINT =  "https://64.227.162.145/api/v1/auth/register"
const Login = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();



    const userRegister = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        const resp = await axios.post(REGISTER_ENDPOINT, formData, {
            headers: {
                "content-type": "application/json",
            },
        });
        console.log(resp.data);

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
                                    <p className="text-center">Sign up your account</p>
                                    <form onSubmit={userRegister}>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                                            <input type="name" className="form-control" id="exampleInputName1" aria-describedby="emailHelp" onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-4">

                                            <Link to="/login" className="text-primary fw-bold" >Already have account ? Sign In here</Link>
                                        </div>
                                        <button className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Sign Up</button>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login