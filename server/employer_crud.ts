import type { Employer } from "~/server/interfaces";

const headers = new Headers();
headers.append("Content-Type", "application/json")

const api_url = process.env.API_URL || "http://localhost:8080"

async function get(id: string | "ALL") {
    const getReturn: Employer[] = await $fetch(`${api_url}/employees?id=${id}`, {
        method: 'GET',
        headers
    })
    return getReturn
}

async function del(id: string) {
    console.log(id)
    const delReturn = await $fetch(`${api_url}/employees`, {
        method: 'DELETE',
        headers,
        body: {
            id: id
        }
    })
    return delReturn
}

async function create(employer: { name: string, role: string, salary: number, avatarImage: { base64: string, imgType: string } | null }) {
    const postReturn = await $fetch(`${api_url}/employees`, {
        method: 'POST',
        headers,
        body: {
            employer
        }
    })

    return postReturn;
}

async function update(id: string, newEmployer: { name: string, role: string, salary: number, status: boolean, avatarImage?: { base64: string, imgType: string } | null }) {
    const postReturn = await $fetch(`${api_url}/employees`, {
        method: 'PUT',
        headers,
        body: {
            id,
            newEmployer,
        }
    })
    return postReturn;
}

export { get, del, create, update }