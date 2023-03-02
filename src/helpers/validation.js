function validate(product) {
  const productValues = { ...product };
  const prodStatus = productValues.status === "true";
  const prodPrice = +productValues.price;

  if (
    productValues.title &&
    productValues.description &&
    productValues.code &&
    productValues.price &&
    productValues.status &&
    productValues.category
  ) {
    if (
      typeof productValues.title === "string" &&
      typeof productValues.description === "string" &&
      typeof productValues.code === "string" &&
      typeof prodPrice === "number" &&
      typeof prodStatus === "boolean" &&
      typeof productValues.category === "string" &&
      productValues.thumbnails
        ? typeof productValues.thumbnails === "string"
        : []
    ) {
      return true;
    }
  } else {
    return false;
  }
}

export function validateProduct(productToValidate) {
  return validate(productToValidate);
}
