export const validateBody = (validator) => (req, res, next) => {
  try {
    const validatedBody = validator(req.body);
    req.body = validatedBody;
    next();
  } catch (error) {
    // res.userErrorResponse(error.message);
    throw error.messsage;
  }
};
export const validateParams = (validator) => (req, res, next) => {
  try {
    const validatedParams = validator(req.params);
    req.params = validatedParams;
    next();
  } catch (error) {
    // res.userErrorResponse(error.message);
    throw error.messsage;
  }
};
export const validateQuery = (validator) => (req, res, next) => {
  try {
    const validatedQuery = validator(req.query);
    req.query = validatedQuery;
    next();
  } catch (error) {
    // res.userErrorResponse(error.message);
    throw error.messsage;
  }
};
