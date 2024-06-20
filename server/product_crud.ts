import type { Product } from "~/server/interfaces";

const headers = new Headers();
headers.append("Content-Type", "application/json")

const api_url = process.env.API_URL || "http://localhost:8080"

async function get(id: string | "ALL") {
    const getReturn: Product[] = await $fetch(`${api_url}/products?id=${id}`, {
        method: 'GET',
        headers
    })
    return getReturn
}

async function del(id: string) {
    console.log(id)
    const delReturn = await $fetch(`${api_url}/products`, {
        method: 'DELETE',
        headers,
        body: {
            id: id
        }
    })
    return delReturn
}

async function create(product: { name: string, normal_price: number, quantity: number, category: string, image: { imgType: string, base64: string } }) {
    const postReturn = await $fetch(`${api_url}/products`, {
        method: 'POST',
        headers,
        body: {
            product
        }
    })

    return postReturn;
}

async function update(id: string, newProduct: { name: string, normal_price: number, quantity: number, category: string, image?: { base64: string, imgType: string } | null }) {
    const postReturn = await $fetch(`${api_url}/products`, {
        method: 'PUT',
        headers,
        body: {
            id,
            newProduct,
        }
    })
    return postReturn;
}

export { get, del, create, update }