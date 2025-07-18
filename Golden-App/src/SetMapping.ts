import { getImportLinks, getLinks, getToken, ILinks } from "./importUtils";
import  getSchema  from "./Schema";

export async function getMapping(key: string, patch: boolean = false) {
    type Character = {
        id: number;
        name: string;
        ki: string;
        maxKi: string;
        race: string;
        affliliation: string;
    };
    type Planet = {
        id: number;
        name: string;
        isDestroyed: boolean;
        description: string;
    };

    const links = await getLinks();
    const moreLinks = getImportLinks(key);

    if ("error" in links) {
        return;
    }

    const mapping = getSchema();

    if(patch === false) {
    const success = await uploadMapping(links, mapping);
    }
    else {
        const success = await patchMapping(links, mapping);
    }
}

async function uploadMapping(links: ILinks, mapping: any): Promise<boolean> {
    try {
        const token = await getToken();
        console.log("mapping:", mapping);
        const res = await fetch(links.mapping, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(mapping)
        });
        console.log("Links:", links);
        if (!res.ok) {
            console.log(await res.json())
            console.error("Fehler beim Hochladen des Mappings:", res.status, res.statusText);
            return false;
        }
        return res.ok;
    } catch (error) {
        console.error("Fehler beim Hochladen:", error);
        return false;
    }
}

async function patchMapping(links: ILinks, mapping: any): Promise<boolean> {
    try {
        const token = await getToken();
        console.log("mapping:", mapping);
        const res = await fetch(links.mapping, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(mapping)
        });
        console.log("Links:", links);
        if (!res.ok) {
            console.log(await res.json())
            console.error("Fehler beim Hochladen des Mappings:", res.status, res.statusText);
            return false;
        }
        return res.ok;
    } catch (error) {
        console.error("Fehler beim Hochladen:", error);
        return false;
    }
}