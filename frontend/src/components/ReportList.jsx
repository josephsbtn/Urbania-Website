import React, { useState, useEffect } from "react";
import { Smile, Sun, Wind } from "lucide-react";
import { mockAPI } from "../services/api";
import axios from "axios";

export default function ReportList() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`http://127.0.0.1:8000/report/`);
      console.log("Report API Response:", response.data);

      setReportData(response.data.result);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError(error.message || "Failed to fetch report data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="flex flex-col items-start justify-start">
      <h1 className="font-bold text-xl">Newest Citizen Report ❗</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : reportData && reportData.length > 0 ? (
        <div className="overflow-y-scroll p-2 w-full flex flex-col gap-4" style={{ maxHeight: '300px' }}>
          {reportData.slice().reverse().map((report) => (
            <div
              className="bg-white rounded-xl shadow-md flex flex-col items-center p-4 min-h-40 border border-gray-100 hover:shadow-lg transition"
              key={report.id || report.photo}
              style={{ minHeight: '180px' }}
            >
              <img
                src={`http://localhost:8000/${report.photo}`}
                alt={report.description}
                className="w-40 max-h-20 object-fill rounded-lg mb-3 border border-gray-200"
              />
              <div className="w-full flex flex-col items-center justify-center">
                <p className="text-gray-800 font-semibold mb-1 text-center truncate w-full" title={report.description}>
                  {report.description}
                </p>
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-pink-100 text-pink-700 font-bold mt-1">
                  {report.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="flex flex-col items-start justify-start p-2">
          <h1>No Data Report</h1>
        </div>
      )}  
    </div>
  );
}
