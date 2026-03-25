const API_URL = import.meta.env.VITE_DOTNET_API_URL;
export async function toggleVisibility(id) {
  try {

    const res = await fetch(`${API_URL}/images/${id}`, {
      method: "DELETE",
    });
    

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Error updating images member");

    return result;
  } catch (error) {
    console.error("Error updating images member:", error);
    return null;
  }
}
