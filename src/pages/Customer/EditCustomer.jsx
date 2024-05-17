import React, { useEffect, useState } from 'react'
import Layout from '../../components/layouts/Layout'
import DataTable from "react-data-table-component";
import { FaArrowLeft } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomersById } from '../../features/customer/customerSlice';

const EditCustomer = () => {
  const { id } = useParams();
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
      cell: (row) => <div style={{ fontWeight: "" }}>{row.address_line}</div>,
      sortable: true,
      width: "",
    },
    {
      name: "City, State",
      selector: (row) => row.state_country,
      cell: (row) => <div style={{ fontWeight: "" }}>{`${row.city} , ${row.state}`}</div>,
      sortable: true,
      width: "",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      cell: (row) => <div style={{ fontWeight: "" }}>{row.address_type}</div>,
      sortable: true,
      width: "",

    },
    {
      name: "Default",
      selector: (row) => row.default,
      cell: (row) => <div style={{ fontWeight: "" }}>{`${row.default}`}</div>,
      sortable: true,
      width: "",

    },



  ];

  const [customers, setCustomers] = useState([]);
  const [address, setaddress] = useState([]);
  const [Wishlist, setWishlist] = useState([]);
  const [Brands, setBrands] = useState([]);

// console.log(customers)


  const dispatch = useDispatch();
  const fetchCustomers = async () => {
    const res = await dispatch(fetchAllCustomersById({ id })).unwrap();
      // console.log(res)
      setCustomers(res)
      setaddress(res.addresses)
      setWishlist(res.wishlist)
      setBrands(res.favoriteBrands)

  };

  useEffect(() => {
    fetchCustomers();
  }, [dispatch]);

  return (
    <Layout>
      <div className=''>

      <div style={{ marginBottom: '30px', display: "flex", alignItems: "start", gap: "20px", color: '#D93D6E' }}>
          <FaArrowLeft size={20} cursor="pointer"  style={{marginTop:"6px"}} />
          <div>

          <h2 className="heading m-0 p-0"  >{customers.first_name}</h2>
          <p style={{color:'#333'}}>Register on: 14th jan 2024 | Registered with Email</p>

          </div>
         
        </div>
       
        


        <div className="card">
          <div className="card-body row">
            <div className='col-4'>
              <h5 className="card-title">Email Address</h5>
              <p className="card-text">{customers.email}</p>
            </div>
            <div className='col-3'>
              <h5 className="card-title">Mobile</h5>
              <p className="card-text">{customers.mobile}</p>
            </div>
            <div className='col-3'>
              <h5 className="card-title">Date of birth</h5>
              <p className="card-text">{customers.dob}</p>
            </div>
            <div className='col'>
              <h5 className="card-title">Gender</h5>
              <p className="card-text">{customers.gender}</p>
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
                data={address}
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
              {Wishlist.map(whishlist=>(


            
              <ol className="list-group ms-3 gap-1">
                <li className="">{whishlist.name}</li>
          
                <var></var>
              </ol>
            ))}
            </div>
          </div>

          <div className="card " style={{ width: "48%" }} >
            <div className="card-body" >
              <h6 className="fw-bold">Brands Following</h6>
              {Brands.map(brand=>(

           
              <ol className="list-group ms-3 gap-1">
                <li className="">{brand.name}</li>
             
              
              </ol>
            ))}
            </div>
          </div>

        </div>




      </div>
    </Layout>
  )
}

export default EditCustomer