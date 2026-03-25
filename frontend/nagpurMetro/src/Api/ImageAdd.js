const API_URL = import.meta.env.VITE_DOTNET_API_URL;
export async function addImageFunction(formData) {
    try {
        const res = await fetch(`${API_URL}/images`, {
            method: "POST",
            body: formData,
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result?.message || "Error adding image");

        return result;
    } catch (error) {
        console.error("Error adding image:", error);
        return null;
    }
}
