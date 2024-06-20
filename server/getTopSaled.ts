import type { Sale } from '~/server/interfaces';

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