


const API_URL = import.meta.env.VITE_DOTNET_API_URL;

export async function loginUser(data) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    return result; // always return result
  } catch (error) {
    console.error("Login API error:", error);
    return {
      statusCode: 500,
      message: "Server not reachable",
    };
  }
}
