const errorResMsg = (res, code, message) =>
  res.status(code).json({
    status: 'error',
    error: message,
  });

const successResMsg = (res, code, data) =>
  res.status(code).json({
    status: 'success',
    data,
  });

  module.exports.errorResMsg = errorResMsg;
  module.exports.successResMsg = successResMsg;