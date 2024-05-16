import React from 'react'
import Layout from '../../components/layouts/Layout'
import DataTable from "react-data-table-component";
import { FaArrowLeft } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
const EditCustomer = () => {

  const dummydata = [
    {
      name: "Udit Aggarwal",
      address: "Some address here",
      state_country: "Mh, India",
      type: "Home",
      default: "No"
    },
    {
      name: "Udit Aggarwal2",
      address: "Some address here",
      state_country: "Mh, India",
      type: "Home",
      default: "No"
    },
    {
      name: "Udit Aggarwal3",
      address: "Some address here",
      state_country: "Mh, India",
      type: "Home",
      default: "No"
    }, {
      name: "Udit Aggarwal4",
      address: "Some address here",
      state_country: "Mh, India",
      type: "Home",
      default: "No"
    }
  ]

  const columns = [

    {
      name: "Name",
      selector: (row) => row.name,
      cell: (row) => <div style={{ fontWeight: "semi-bold" }}>{row.name}</div>,
      sortable: true,
      width: "",
    },

    {
      name: "Address",
      selector: (row) => row.address,
      cell: (row) => <div style={{ fontWeight: "" }}>{row.address}</div>,
      sortable: true,
      width: "",
    },
    {
      name: "City, State",
      selector: (row) => row.state_country,
      cell: (row) => <div style={{ fontWeight: "" }}>{row.state_country}</div>,
      sortable: true,
      width: "",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      cell: (row) => <div style={{ fontWeight: "" }}>{row.type}</div>,
      sortable: true,
      width: "",

    },
    {
      name: "Default",
      selector: (row) => row.default,
      cell: (row) => <div style={{ fontWeight: "" }}>{row.default}</div>,
      sortable: true,
      width: "",

    },



  ];



  return (
    <Layout>
      <div className=''>

      <div style={{ marginBottom: '30px', display: "flex", alignItems: "start", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer"  style={{marginTop:"6px"}} />
          <div>

          <h2 className="heading m-0 p-0"  >Udit Aggarwal</h2>
          <p style={{color:'#333'}}>Register on: 14th jan 2024 | Registered with Email</p>

          </div>
         
        </div>
       
        


        <div className="card">
          <div className="card-body row">
            <div className='col-4'>
              <h5 className="card-title">Email Address</h5>
              <p className="card-text">udit.aggarwal@gmail.com</p>
            </div>
            <div className='col-3'>
              <h5 className="card-title">Mobile</h5>
              <p className="card-text">971-9821327758</p>
            </div>
            <div className='col-3'>
              <h5 className="card-title">Date of birth</h5>
              <p className="card-text">10-01-1995</p>
            </div>
            <div className='col'>
              <h5 className="card-title">Gender</h5>
              <p className="card-text">Male</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h6 className='fs-5 fw-bold mb-3 text-black'>Addresses</h6>
            <div className="table-responsive">
              <DataTable
                // title="Category"
                columns={columns}
                data={dummydata}
                // fixedHeader
                pagination
                highlightOnHover
              // subHeader
              // onRowClicked={handleRowClick}
              // subHeaderComponent={
              //   <input
              //     type="text"
              //     className="w-25 form-control"
              //     placeholder="Search Category"
              //     value={search}
              //     onChange={(e) => setSearch(e.target.value)}
              //   />
              // }
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between" >

          <div className="card " style={{ width: "48%" }} >
            <div className="card-body " >
              <h6 className="fw-bold">Wishlist</h6>
              <ol className="list-group ms-3 gap-1">
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <var></var>
              </ol>
            </div>
          </div>

          <div className="card " style={{ width: "48%" }} >
            <div className="card-body" >
              <h6 className="fw-bold">Brands Following</h6>
              <ol className="list-group ms-3 gap-1">
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <li className="">Product Name</li>
                <var></var>
              </ol>
            </div>
          </div>

        </div>




      </div>
    </Layout>
  )
}

export default EditCustomer