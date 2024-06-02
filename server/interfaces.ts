interface Employer {
    name: string,
    status: boolean,
    salary: number,
    role: string,
    avatarImage: {
        base64: string | null,
        imgType: string | null
    },
    _id: string
}

interface Sale {
    costumer_name: string,
    products: {
            id: string,
            price: number,
            quantity: number
        }[],
    sellDate: string,
    id: string
}

interface Product {
    name: string,
    price: number,
    quantity: number,
    category: "ROUPA" | "MÓVEIS" | "ELETRÔNICOS",
    sales?: {
        id: string,
        price: number,
        quantity: number
    }[],
    id: string
}

export type { Product, Sale, Employer }