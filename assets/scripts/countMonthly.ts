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

function countProductsByMonth(sales: Sale[]): { [key: string]: number } {
    const productsByMonth: { [key: string]: number } = {};

    sales.forEach(sale => {
        const month = sale.sellDate.substring(0, 7); // Extrai o ano e o mês (YYYY-MM)
        sale.products.forEach(product => {
            if (productsByMonth[month]) {
                productsByMonth[month] += product.quantity;
            } else {
                productsByMonth[month] = product.quantity;
            }
        });
    });

    return productsByMonth;
}

export { countProductsByMonth }