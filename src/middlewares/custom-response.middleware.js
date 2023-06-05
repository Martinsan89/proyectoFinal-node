export default (req, res, next) => {
  res.okResponse = (data) => {
    res.status(200).send({
      status: "success",
      payload: data,
    });
  };
  res.userErrorResponse = (message, code) => {
    res.status(400).send({
      status: "error",
      error: message,
      code: code,
    });
  };
  res.serverErrorResponse = (message, code) => {
    res.status(500).send({
      status: "error",
      error: message,
      code: code,
    });
  };
  next();
};
