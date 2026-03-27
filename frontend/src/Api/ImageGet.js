
const API_URL = import.meta.env.VITE_DOTNET_API_URL;

export default async function allImageFunction() {
  try {
    const res = await fetch(`${API_URL}/images/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Error fetching images: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();


      console.log("Fetched images:", result);
      return result;
    
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}
