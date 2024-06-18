import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, updateOrderStatus } from '../../features/order/orderSlice';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { formatDateToDubaiTime } from '../../utils/dateHelper';
import { formatDateUAE } from '../../utils/formatDate';
import { orderStatusFormat, paymentStatusFormat } from '../../utils/statusFormat';

const mediaFolder = process.env.REACT_APP_MEDIA_URL;

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.orders.currentOrder);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const debugMode = process.env.REACT_APP_DEBUG || "";
  
  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleStatusUpdate = (status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  return (
    <Layout>
        {/* {debugMode && <div><pre>{JSON.stringify(order, null, 2)}</pre></div>} */}
        <div className="col-12 stretch-card container-fluid">
        
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        {order && (
          <> 
          <button className="btn btn-link" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
            <div className='row align-center'>
                <div className='col-6'>
                <h2 className='heading ms-3'> Order #{order.id}</h2>
               
               <div className='d-flex gap-3 justify-between align-center ms-3 pb-5'> 

                <div className=''>Placed on {formatDateUAE(order.createdAt)} </div> <div className='pe-2'> {orderStatusFormat(order.orderStatus)} {paymentStatusFormat(order.paymentStatus)}</div>
                </div>
                </div>

                <div className='col-6'>
                <div className="d-flex justify-content-end mt-4">
                  {order.orderStatus === 'Unfulfilled' && (
                    <button className="btn btn-primary me-2" onClick={() => handleStatusUpdate('Fulfilled')}>
                      Mark as Fulfilled
                    </button>
                  )}
                  {order.orderStatus === 'Fulfilled' && (
                    <button className="btn btn-success me-2" onClick={() => handleStatusUpdate('Shipped')}>
                      Mark as Shipped
                    </button>
                  )}
                  {order.orderStatus === 'Shipped' && (
                    <button className="btn btn-info me-2" onClick={() => handleStatusUpdate('Delivered')}>
                      Mark as Delivered
                    </button>
                  )}
                  {order.orderStatus !== 'Cancelled' && (
                    <button className="btn btn-dark" onClick={() => handleStatusUpdate('Cancelled')}>
                      Cancel Order
                    </button>
                  )}
                </div>
                </div>
          </div>
          <div className="col-12 stretch-card container-fluid">
                <div className="row">
                <div className="col-md-6">
                    <div className='card' style={{ border:"1px solid #efefef"}}>

                        <div className='card-body'>
                            
                    <h5>Items</h5>
                    <ul className="list-group list-group-flush">
                      {order.items.map((item, index) => (
                        <li className="list-group-item" key={index}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <img src={`${mediaFolder}/${item.image}`} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                              <strong>{item.name}</strong> ({item.variant.name})
                            </div>
                            <div>AED {item.total.toFixed(2)}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                  </div>
                  
                  </div>

                  <div className='card' style={{ border:"1px solid #efefef"}}>
                  <div className="card-body">
                  <h5>Totals</h5>
                  <ul className="list-group list-group-flush mt-4">
                      <li className="list-group-item text-end">
                        <strong>Subtotal:</strong> <span style={{width:"120px", display:"inline-block"}}>AED {order.subtotal.toFixed(2)}</span>
                      </li>
                      <li className="list-group-item text-end">
                        <strong>Shipping:</strong> <span style={{width:"120px", display:"inline-block"}}>AED {order.shipping.toFixed(2)}</span>
                      </li>
                      <li className="list-group-item text-end">
                        <strong>Total:</strong> <span style={{width:"120px", display:"inline-block"}}>AED {order.total.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                  </div>
                    </div>
                  <div className="col-md-6">
                   
                    <div className='card' style={{maxWidth:"400px", border:"1px solid #efefef"}}>
                        <div className='card-body'>
                        <h6 className=' text-dark' style={{fontWeight:"bold"}}>Customer Details</h6>
                        {order.customer.name} <br />
                        {order.customer.email}<br/>
                        {order.customer.mobile ? order.customer.mobile: "No Mobile number"}
                       <br/><br/>
                       <h6 className=' text-dark' style={{fontWeight:"bold"}}>Shipping Address</h6>
                        {order.address.name} <br />
                        {order.address.address_line}, {order.address.city}, {order.address.state}, {order.address.postal_code} <br />
                        {order.address.landmark}
                        </div>
                    </div>


                   

                    <div className='card' style={{maxWidth:"400px", border:"1px solid #efefef"}}>
                    <div className='card-body'>
                        <strong>Shipment Details:</strong> <br />
                        {order.shipmentDetails?.trackingNumber ? (
                          <>
                            <strong>Tracking Number:</strong> {order.shipmentDetails.trackingNumber} <br />
                            <strong>Shipping Company:</strong> {order.shipmentDetails.shippingCompany}
                          </>
                        ) : (
                          <em>No shipment details available</em>
                        )}
                      </div>
                    </div>
                  </div>
                 
                </div>
               
              
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetails;
