class PrimaryErrorHandler extends Error {
    constructor(status, message) {
      super();
      this.status = status;
      this.message = message;
    }
  
    static alreadyExist(message) {
      return new PrimaryErrorHandler(409, message);
    }
  
    static wrongCredentials(message = "username and password are wrong") {
      return new PrimaryErrorHandler(401, message);
    }
  
    static notFound(message = "404 User Not Found") {
      return new PrimaryErrorHandler(404, message);
    }
  
    static unAuthorized(message = "unAuthorized") {
      return new PrimaryErrorHandler(401, message);
    }

    static somethingWentWrong(message = "Something Went Wrong") {
      return new PrimaryErrorHandler(400, message);
    }
  
    static serverError(message = "Internal Server Error") {
      return new PrimaryErrorHandler(505, message);
    }
  }
  
  module.exports = PrimaryErrorHandler;