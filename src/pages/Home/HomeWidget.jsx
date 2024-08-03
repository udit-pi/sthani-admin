import { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllwidget, updateWidgetStatus } from "../../features/widget/homeWidgetSlice";
import WidgetCard from "./components/WidgetCard";  // Correct import path

const debugMode = process.env.REACT_APP_DEBUG || "";

const HomeWidget = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [homeWidgets, setHomeWidgets] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchWidget = async () => {
    const res = await dispatch(fetchAllwidget()).unwrap();
    setHomeWidgets(res);
  };

  useEffect(() => {
    fetchWidget();
  }, [dispatch]);

  const handleToggle = (id, isActive) => {
    const confirmMessage = `Are you sure you want to ${isActive ? "activate" : "deactivate"} this widget?`;
    if (window.confirm(confirmMessage)) {
      dispatch(updateWidgetStatus({ id, is_active: isActive }))
        .unwrap()
        .then(() => {
          fetchWidget();
          toast.success(`Widget ${isActive ? "activated" : "deactivated"} successfully!`);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
     
      <h2 className="heading ms-3">Home Widget</h2>
      <div className="col-12 stretch-card container-fluid">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
          <div style={{ color: "gray", fontWeight: "bold" }}>
            <p className="">{homeWidgets?.length} widgets</p>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          {debugMode && <Link
              to={`/addWidget`}
              className="btn"
              style={{ backgroundColor: "#D93D6E", color: "white", width: "200px" }}
            >
              Add Widget
            </Link> }
          </div>
        </div>
        <div className="d-flex flex-wrap">
          {homeWidgets.map(widget => (
            <WidgetCard key={widget.id} widget={widget} onToggle={handleToggle} />
          ))}
        </div>
      </div>
      {debugMode && <div><pre>{JSON.stringify(homeWidgets, null, 2)}</pre></div>}
    </Layout>
  );
};

export default HomeWidget;
