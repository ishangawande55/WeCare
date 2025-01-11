// utils/validate.js

// Email validation function
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regex.test(email);
  };
  
  // Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/; // Minimum 6 characters with at least one letter and one number
    return regex.test(password);
  };
  
  // Date-time validation function
  const validateDateTime = (dateTime) => {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
    return regex.test(dateTime);
  };
  
  module.exports = {
    validateEmail,
    validatePassword,
    validateDateTime,
  };