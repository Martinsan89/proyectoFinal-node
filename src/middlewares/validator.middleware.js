export const validateBody = (validator) => (req, res, next) => {
  const validatedBody = validator(req.body);
  req.body = validatedBody;
  next();
};
export const validateParams = (validator) => (req, res, next) => {
  const validatedParams = validator(req.params);
  req.params = validatedParams;
  next();
};
export const validateQuery = (validator) => (req, res, next) => {
  try {
    const validatedQuery = validator(req.query);
    req.query = validatedQuery;
    next();
  } catch (error) {
    throw error.messsage;
  }
};
