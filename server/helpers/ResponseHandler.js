/**
 * @class ResponseHandler
 * @description Helper class for handling response messages
 * @exports ResponseHandler
 */
class ResponseHandler {
  /**
   * @method badRequest
   * @description Returns error response object for bad request
   * @param {object} res - Express response object
   * @returns {object} - Response object returned to user
   */
  static badRequest({ code, message, field }, res) {
    return res.status(400).json({
      error: { status: 400, code, message, field }
    });
  }

  /**
   * @method serverError
   * @description Returns error response object for server error
   * @param {object} payload - Payload object to be returned in response body
   * @param {object} res - Express response object
   * @returns {object} - Response object returned to user
   */
  static success(payload, res) {
    return res.status(200).json(payload);
  }

  /**
   * @method success
   * @description Returns success response object for successful requests
   * @param {object} res - Express response object
   * @returns {object} - Response object returned to user
   */
  static serverError(res) {
    return res.status(500).json({
      status: 500,
      code: 'SRV_01',
      message: 'The server is currently unable to process this request.'
    });
  }
}

export default ResponseHandler;
