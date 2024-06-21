import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useParams } from 'react-router-dom';
import { Customer } from '../../services/customer.service';
import { formatDateUAE } from '../../utils/formatDate';
import { orderStatusFormat, paymentStatusFormat } from '../../utils/statusFormat';
import { useNavigate } from 'react-router-dom';

const CustomerOrders = ({ orders }) => {
    const navigate = useNavigate();

    const columns = [
        {
          name: 'Order ID',
          selector: (row) => <b>{row.id}</b>,
          sortable: true,
          grow:1.75
        },
        {
          name: 'Customer',
          selector: (row) => row.address.name,
          sortable: true,
          grow:1.5
        },
        {
          name: 'Email',
          selector: (row) => row.customer.email,
          sortable: true,
          grow:1.5
        },
        {
          name: 'Items',
          selector: (row) => row.items.length,
          sortable: true,
          grow:0.5
        },
        {
          name: 'Total',
          selector: (row) => "AED " + row.total,
          sortable: true,
          grow:0.5
        },
        {
          name: 'Payment Status',
          selector: (row) => paymentStatusFormat(row.paymentStatus),
          sortable: true,
          grow:1
        },
        {
          name: 'Order Status',
          selector: (row) => orderStatusFormat(row.orderStatus),
          sortable: true,
          grow:1
        },
        {
          name: 'Ordered On',
          selector: (row) => formatDateUAE(row.createdAt),
          sortable: true,
          grow:1.5,
        },
        {
          name: 'Actions',
          
          cell: (row) => (
            <button className="btn btn-link text-primary" onClick={() => navigate(`/orders/${row.id}`)}>
              View
            </button>
          ),
        },
      ];
    return (
      <DataTable
       
        columns={columns}
        data={orders}
        pagination
      />
    );
  };
  
  export default CustomerOrders;