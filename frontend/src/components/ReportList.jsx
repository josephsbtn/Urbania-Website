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

      setReportData(response.data[0]);
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
      ) : reportData ? (
        <div className="flex flex-col items-start justify-start p-2 min-h-30">
          <img
            src={`http://127.0.0.1:8000${reportData.image}`}
            alt={reportData.image}
          />
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start p-2">
          <h1>No Data Report</h1>
        </div>
      )}
    </div>
  );
}
