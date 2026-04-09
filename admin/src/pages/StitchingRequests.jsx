import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { backendUrl } from "../App";

const StitchingRequests = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/blog/stitching/submissions`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setRequests(response.data.requests || []);
      } else {
        toast.error(response.data.message || "Failed to load stitching requests");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Custom Stitching Requests</h2>
        <button
          onClick={fetchRequests}
          className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="py-10 text-center text-gray-500">No stitching requests yet.</div>
      ) : (
        <div className="space-y-3">
          {requests.map((entry) => (
            <div key={entry._id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{entry.name}</p>
                  <a className="text-sm text-blue-600 hover:underline" href={`tel:${entry.phoneNumber}`}>
                    {entry.phoneNumber}
                  </a>
                </div>
                <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-sm text-gray-700">
                <p><span className="font-medium">Service:</span> {entry.serviceType}</p>
                <p><span className="font-medium">Items:</span> {entry.itemCount}</p>
                <p><span className="font-medium">City:</span> {entry.city}</p>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-medium">Address:</span> {entry.addressType}, {entry.fullAddress}
                {entry.landmark ? `, Landmark: ${entry.landmark}` : ""}
              </p>
              {entry.message ? (
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                  <span className="font-medium">Message:</span> {entry.message}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

StitchingRequests.propTypes = {
  token: PropTypes.string.isRequired,
};

export default StitchingRequests;
