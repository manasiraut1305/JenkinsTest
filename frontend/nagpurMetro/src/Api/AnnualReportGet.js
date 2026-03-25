
const API_URL = import.meta.env.VITE_DOTNET_API_URL;

export default async function allAnnualreportFunction() {
  try {
    const res = await fetch(`${API_URL}/annualReport/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Error fetching annual report: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();

    if (result.statusCode === 200 && Array.isArray(result.data)) {
      console.log("Fetched annual report:", result.data);
      return result.data;
    } else {
      console.error("Unexpected API format:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching annual report:", error);
    return [];
  }
}
