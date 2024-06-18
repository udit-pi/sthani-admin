import React from 'react';

/**
 * Returns a JSX element representing the order status as a Bootstrap pill.
 * @param {string} status - The order status.
 * @returns {JSX.Element} A span element with the appropriate Bootstrap classes.
 */
export const orderStatusFormat = (status) => {
  let colorClass = '';

  switch (status.toLowerCase()) {
    case 'unfulfilled':
      colorClass = 'bg-warning text-dark';  // Yellow for attention
      break;
    case 'fulfilled':
      colorClass = 'bg-primary';            // Blue for in-progress
      break;
    case 'shipped':
      colorClass = 'bg-info text-dark';     // Light blue for in transit
      break;
    case 'delivered':
      colorClass = 'bg-success';            // Green for completed
      break;
    case 'cancelled':
      colorClass = 'bg-dark';             // Red for cancelled
      break;
    default:
      colorClass = 'bg-secondary';          // Grey for undefined status
      break;
  }

  return <span style={{fontSize:"10px" }} className={`badge ${colorClass}`}>{status.toUpperCase()}</span>;
};

export const paymentStatusFormat = (status) => {
    let colorClass = '';
  
    switch (status.toLowerCase()) {
      case 'pending':
        colorClass = 'text-dark';  // Yellow for attention
        break;
      case 'paid':
        colorClass = 'bg-light-success text-white';            // Blue for in-progress
        break;
      case 'failed':
        colorClass = 'text-danger ';     // Light blue for in transit
        break;
     
      default:
        colorClass = 'text-dark';          // Grey for undefined status
        break;
    }
  
    return <span style={{fontSize:"11px", backgroundColor:"#efefef" }} className={ `badge ${colorClass}`}>{status.toUpperCase()}</span>;
  };
  