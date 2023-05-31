export default (error, res, req, next) => {
  switch (Math.floor(error.code / 100)) {
    case 1: //Errores de entrada
      // console.log("case 1 ------", error);
      res.userErrorResponse(JSON.parse(error.message));
      break;
    case 2: //Errores lógicos
      res.userErrorResponse({
        message: "Error  logico",
        error: JSON.parse(error.message),
      });
      break;
    case 3: //Errores irrecuperables
      res.serverErrorResponse("UnhandledError");
      break;
    default:
      res.serverErrorResponse("UnhandledError");
  }
};
