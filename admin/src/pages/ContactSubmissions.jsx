import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { backendUrl } from "../App";

const ContactSubmissions = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/blog/contact/submissions`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setSubmissions(response.data.submissions || []);
      } else {
        toast.error(response.data.message || "Failed to load contact submissions");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Contact Submissions</h2>
        <button
          onClick={fetchSubmissions}
          className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="py-10 text-center text-gray-500">No contact submissions yet.</div>
      ) : (
        <div className="space-y-3">
          {submissions.map((entry) => (
            <div key={entry._id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{entry.name}</p>
                  <a className="text-sm text-blue-600 hover:underline" href={`mailto:${entry.email}`}>
                    {entry.email}
                  </a>
                </div>
                <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleString()}</p>
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-700">{entry.subject}</p>
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{entry.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ContactSubmissions.propTypes = {
  token: PropTypes.string.isRequired,
};

export default ContactSubmissions;
