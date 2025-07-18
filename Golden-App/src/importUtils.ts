import { storage } from "@forge/api";

export interface ILinks {
    getStatus: string;
    start: string;
    mapping: string;
}


export async function checkToken(id: number): Promise<string | undefined> {
    const token: string = await storage.getSecret('token');
    if (token === undefined) {
        return undefined;
    }

    const json = JSON.parse(token);

    if (json.length <= id) {
        return undefined;
    }

    return json[id];
}

export async function getImportLinks(token: string) {
    const res = await fetch('https://api.atlassian.com/jsm/assets/v1/imports/info', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        console.log('Error while getting import links:', res.status, res.statusText);
        return { error: 'Error while getting import links', success: false };
    }

    return (await res.json()).links as ILinks;
}

export async function getLinks(): Promise<ILinks | { error: string }> {
    let tokenObject = await storage.getSecret('API_TOKEN');
    console.log('Token Object:', tokenObject);

    if (tokenObject === undefined) {
        return { error: 'Token not found' };
    }

    if (tokenObject === undefined) {
        return { error: 'Token not found' };
    }

    const allLinks: ILinks[] = [];

    const res = await fetch('https://api.atlassian.com/jsm/assets/v1/imports/info', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${tokenObject}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const links = (await res.json()).links as ILinks;

    allLinks.push(links);

    return allLinks.length > 0 ? allLinks[0] : { error: 'No links found' };
}

export async function getToken(): Promise<string | undefined> {
    const token = await storage.getSecret('API_TOKEN');
    if (token === undefined) {
        return undefined;
    }
    return token;
}