module.exports.formatArrResponse = (productList, stockList) => {
  return productList?.Items.map((product) => {
    return {
      ...product,
      count: stockList?.Items.find((stock) => stock.product_id === product.id)?.count ?? 0,
    };
  });
};

module.exports.formatObjResponse = (product, stock) => {
  return {
    ...product.Item,
    count: stock.Item?.count ?? 0,
  };
};
