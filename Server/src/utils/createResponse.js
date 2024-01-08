export const sendHttpResponse = (res, message, data = {}, status = 200, success = true) => {
    return res.status(status).json({
      success,
      message,
      data,
    });
  };
  