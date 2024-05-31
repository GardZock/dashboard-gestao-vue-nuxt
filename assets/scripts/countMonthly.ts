import type { Sale } from '~/assets/scripts/interfaces';

function countProductsByMonth(sales: Sale[]): { [key: string]: number } {
    const salesByMonth: { [key: string]: number } = {};
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    
    for (const sale of sales) {
        const month = monthNames[new Date(sale.sellDate).getMonth()]
        for (const product of sale.products) {
            salesByMonth[month] ? salesByMonth[month] += product.quantity : salesByMonth[month] = product.quantity 
        }
    }

    return salesByMonth
}

export { countProductsByMonth }