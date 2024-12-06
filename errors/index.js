const CustomError = require('./customError');
const { StatusCodes } = require('http-status-codes'); // Destructure StatusCodes for easier use

class Errors {
  /**
   * @param {string} msg - Error message
   * @param {number} statusCode - HTTP status code
   */
  badRequestError(msg) {
    throw new CustomError(msg, StatusCodes.BAD_REQUEST);
  }
  notFoundError(msg) {
    throw new CustomError(msg, StatusCodes.NOT_FOUND);
  }
  unAuthorized(msg){
    throw new CustomError(msg,StatusCodes.UNAUTHORIZED);
  }
  conflict(msg){
    throw new CustomError(msg,StatusCodes.CONFLICT);
  }
}

module.exports = new Errors();
