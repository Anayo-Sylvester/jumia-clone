const asyncWrapper = (fn) => {
  return (req, res, next) => {
      fn(req, res, next).catch(next); // Pass errors to Express's error handler
  };
};

module.exports = asyncWrapper;
