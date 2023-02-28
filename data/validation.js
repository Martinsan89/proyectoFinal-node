const productKeys = [
  "title",
  "description",
  "code",
  "price",
  "status",
  "stock",
  "category",
];

function validate(product, keys) {
  const dataKeys = Object.keys(...product);
  const removeThumbnails = dataKeys.filter((key) => key !== "thumbnails");
  // console.log(removeThumbnails);
  return (
    keys.every((key) => removeThumbnails.includes(key)) &&
    removeThumbnails.every((key) => keys.includes(key))
  );
}

export function validateProduct(productToValidate) {
  return validate(productToValidate, productKeys);
}
