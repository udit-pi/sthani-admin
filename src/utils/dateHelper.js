export const formatDateToDubaiTime = (dateString) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric', 
      timeZone: 'Asia/Dubai', 
      timeZoneName: 'short' 
    }).format(new Date(dateString));
  };
  