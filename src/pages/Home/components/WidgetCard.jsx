import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const WidgetCard = ({ widget, onToggle }) => {
  const handleToggle = (event) => {
    onToggle(widget.id, event.target.checked);
  };

  return (
    <div className="card" style={{ width: '18rem', margin: '10px' }}>
      <div className="card-body">
        <h5 className="card-title">{widget.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{widget.widget_type.toUpperCase()}</h6>
        <p className="card-text">Position: {widget.placement_id}</p>
        <FormControlLabel
          control={
            <Switch
              checked={widget.is_active !== undefined ? widget.is_active : false} // Default to false if is_active is not present
              onChange={handleToggle}
              color="primary"
            />
          }
          label={widget.is_active ? "Active" : "Inactive"}
        />
        <Link to={`/editWidget/${widget.id}`} className="card-link">
          <FontAwesomeIcon icon={faEdit} style={{ color: '#D93D6E' }} /> Edit
        </Link>
      </div>
    </div>
  );
};

export default WidgetCard;
