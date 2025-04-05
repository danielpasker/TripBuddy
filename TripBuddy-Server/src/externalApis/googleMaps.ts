import { Env } from "@env";
import axios from "axios";

export type DestinatioResult = {
    results: { formatted_address: string }[]
}

export const searchDestinations = async (query: string) => {
    const response = await axios.get<DestinatioResult>(
        `${Env.GOOGLE_API_BASE_URL}?query=${encodeURIComponent(query)}&types=locality&key=${Env.GOOGLE_API_KEY}`
    );

    return response.data.results
}