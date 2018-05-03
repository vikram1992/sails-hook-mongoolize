class ErrorCodeTemplate {

    constructor() {
        this.parsedCode = 500;
    };

    setErrorCode(error) {
        throw new Error('You have to define your own set of error codes');
    }

    getErrorCode() {
        return this.parsedCode;
    }
}

module.exports = ErrorCodeTemplate;