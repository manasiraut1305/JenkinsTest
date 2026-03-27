const API_URL = import.meta.env.VITE_DOTNET_API_URL;
export async function updateAnnualReport(annualReportData, id) {
  try {
    const formData = new FormData();

    formData.append("year", annualReportData.year);
    formData.append("description", annualReportData.description ?? "");


    if (annualReportData.reportPdf instanceof File) {
      formData.append("reportPdf", annualReportData.reportPdf);
    }
    if (annualReportData.returnReport instanceof File) {
      formData.append("returnReport", annualReportData.returnReport);
    }
    if (annualReportData.reportCoverPage instanceof File) {
      formData.append("reportCoverPage", annualReportData.reportCoverPage); // ✅ Correct name
    }

    const res = await fetch(`${API_URL}/annualReport/${id}`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Error adding annual report");

    return result;
  } catch (error) {
    console.error("Error adding annual report:", error);
    return null;
  }
}
