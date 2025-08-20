import React, { useState } from "react";
import { Camera, Upload, Send, CheckCircle, AlertCircle } from "lucide-react";
import { reportAPI } from "../services/api";

export default function ReportCard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Clean up previous URL
      return () => URL.revokeObjectURL(url);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !description.trim()) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('description', description);

      await reportAPI.submitReport(formData);
      
      setSubmitStatus('success');
      setSelectedFile(null);
      setDescription("");
      setPreviewUrl(null);
      
      // Reset success status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4" onClick={(e) => e.stopPropagation()}>
      <h2 className="font-bold mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5" />
        Submit Citizen Report
      </h2>

      {/* Photo Upload Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Photo
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative overflow-hidden">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
            style={{ zIndex: 50 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          />
          {previewUrl ? (
            <div className="relative pointer-events-none">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm pointer-events-auto"
                style={{ zIndex: 60 }}
              >
                ×
              </button>
            </div>
          ) : (
            <div className="py-4 pointer-events-none">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload an image</p>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedFile || !description.trim()}
        className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
          isSubmitting || !selectedFile || !description.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Report
          </>
        )}
      </button>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-700 text-sm">Report submitted successfully!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 text-sm">Please fill in all fields and try again.</span>
        </div>
      )}
    </div>
  );
}
