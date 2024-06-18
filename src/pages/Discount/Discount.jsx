import React, { useEffect, useState } from 'react';
import Layout from '../../components/layouts/Layout';
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { deleteDiscount, fetchAllDiscount } from "../../features/discount/discountSlice";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Typography } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid white',
  borderRadius: "10px",
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 5,
};

const Discount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchDiscount = async () => {
    const res = await dispatch(fetchAllDiscount()).unwrap();
    setDiscounts(res);
    setFilteredDiscounts(res);
  };

  useEffect(() => {
    fetchDiscount();
  }, [dispatch]);

  useEffect(() => {
    const result = discounts.filter((discount) => {
      const searchTerm = search.toLowerCase();
      return (
        discount.code.toLowerCase().includes(searchTerm) ||
        discount.discountType.toLowerCase().replace("_", " ").includes(searchTerm)
      );
    });
    setFilteredDiscounts(result);
  }, [search, discounts]);

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleDelete = (id) => {
    dispatch(deleteDiscount({ id }))
      .unwrap()
      .then(() => {
        fetchDiscount();
        toast.success('Discount deleted successfully!');
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const columns = [
    {
      name: "Code",
      selector: (row) => row.code,
      cell: (row) => <div style={{ fontWeight: "bold" }}>{row.code}</div>,
      sortable: true,
      grow: 1,
    },
    {
      name: "Type",
      selector: (row) => row.discountType.replace("_", " "),
      sortable: true,
      grow: 1,
    },
    {
      name: "Discount",
      selector: (row) => `${row.discountValueType === "AMOUNT" ? `AED ${row.discountValue}` : `${row.discountValue}%`}`,
      sortable: true,
      grow: 1,
    },
    {
      name: "Minimum",
      selector: (row) => row.minimumPurchaseAmount && `AED ${row.minimumPurchaseAmount}`,
      sortable: true,
      grow: 1,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      grow: 1,
    },
    {
      name: "Used",
      selector: (row) => row.used,
      sortable: true,
      grow: 1,
    },
    {
      name: "Action",
      right: true,
      grow: 1,
      cell: (row) => (
        <div>
          <span onClick={() => handleOpen(row._id)} style={{ marginLeft: "20px", cursor: "pointer", color: '#D93D6E' }}>
            Delete
          </span>
          <Link
            to={`/editDiscount/${row._id}`}
            style={{ marginLeft: "20px", cursor: "pointer", color: '#D93D6E' }}
          >
            <span>Edit</span>
          </Link>
        </div>
      ),
    },
  ];

  const handleRowClick = (row) => {
    navigate(`/editDiscount/${row._id}`);
  };

  return (
    <Layout>
      <h2 className="heading ms-3">Discounts</h2>
      <div className="col-12 stretch-card container-fluid">
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: "10px" }}>
          <Link
            to={`/addDiscount`}
            className="btn ms-1"
            style={{ backgroundColor: '#D93D6E', color: "white", width: "200px" }}
          >
            Add Discount
          </Link>
          <input
            type="text"
            className="w-25 form-control"
            placeholder="Search Discounts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="table-responsive">
          <DataTable
            columns={columns}
            data={filteredDiscounts}
            fixedHeader
            pagination
            highlightOnHover
            subHeader
            onRowClicked={handleRowClick}
          />
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2 id="child-modal-title">Do you want to delete?</h2>
          <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
            <button
              type="button"
              className="btn btn-sm mt-4"
              style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E", width: "100px" }}
              onClick={() => handleDelete(deleteId)}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-sm mt-4"
              onClick={handleClose}
              style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E", width: "100px", marginLeft: "20px" }}
            >
              No
            </button>
          </Typography>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Discount;
