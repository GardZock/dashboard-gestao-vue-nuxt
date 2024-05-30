interface Sale {
    costumer_name: string,
    products: [
        {
            id: string,
            price: number,
            quantity: number
        }
    ],
    sellDate: string,
    id: string
}

function getTopSoldProducts(sales: Sale[]): { name: string; quantity: number }[] {
  const productQuantities: { [key: string]: number } = {};

  sales.forEach((sale) => {
    sale.products.forEach((product) => {
      if (productQuantities[product.id]) {
        productQuantities[product.id] += product.quantity;
      } else {
        productQuantities[product.id] = product.quantity;
      }
    });
  });

  const sortedProducts = Object.entries(productQuantities)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  return sortedProducts.slice(0, 3);
}

export { getTopSoldProducts }