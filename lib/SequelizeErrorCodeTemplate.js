const ErrorCodeTemplate = require('./ErrorCodeTemplate');

class SequelizeErrorCodeTemplate extends ErrorCodeTemplate {

    constructor() {
        super();
    }

    setErrorCode(error) {
        switch (error) {
            case "SequelizeUniqueConstraintError":
                this.parsedCode = 409;
                break;
            case "SequelizeValidationError":
                this.parsedCode = 400;
                break;
            case "SequelizeAssociationError":
                this.parsedCode = 500;
                break;
            case "SequelizeTimeoutError":
                this.parsedCode = 500;
                break;
            default:
                this.parsedCode = 500;
                break;
        }
    }
}

function errorHandler(err) {
    var sequelizeErrorCodeTemplate = new SequelizeErrorCodeTemplate();
    sequelizeErrorCodeTemplate.setErrorCode(err.message);
    code = sequelizeErrorCodeTemplate.getErrorCode();

    const msg = err.message || "Something went wrong";
    const error = {};
    error.code = code;
    error.message = err.message;
    err.cleaned = error;

    // // New format of error
    err.code = code;
    return err;

}

module.exports = { errorHandler }