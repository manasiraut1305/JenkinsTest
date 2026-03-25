const API_URL = import.meta.env.VITE_DOTNET_API_URL;

export default async function toggleAnnualReportVisible(id) {
  try {
    const res = await fetch(`${API_URL}/annualReport/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error deleting annualReport: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result; 
  } catch (error) {
    console.error("Error deleting annualReport:", error);
    return null;
  }
}