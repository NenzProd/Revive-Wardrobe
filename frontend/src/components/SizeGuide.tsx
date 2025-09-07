
import { X } from 'lucide-react';

const SizeGuide = () => {
  const closeModal = () => {
    document.getElementById('sizeGuideModal')?.classList.add('hidden');
  };

  return (
    <div id="sizeGuideModal" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-serif">Size Guide</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-revive-red">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-medium text-lg mb-3">How to Measure</h4>
            <p className="text-gray-600 mb-4">
              For the best fit, take measurements directly over your undergarments. Keep the tape measure comfortably loose.
            </p>
          </div>
          
          <div className="mb-8">
            <h4 className="font-medium text-lg mb-3">Abaya Size Guide (Mapped to XS-XL)</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Standard Size</th>
                    <th className="border p-2 text-left">Abaya Size</th>
                    <th className="border p-2 text-left">Height (ft.)</th>
                    <th className="border p-2 text-left">Bust (in)</th>
                    <th className="border p-2 text-left">Waist (in)</th>
                    <th className="border p-2 text-left">Hips (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-medium">XS</td>
                    <td className="border p-2">50</td>
                    <td className="border p-2">4'8 – 4'9</td>
                    <td className="border p-2">38"</td>
                    <td className="border p-2">40"</td>
                    <td className="border p-2">42"</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium">S</td>
                    <td className="border p-2">52</td>
                    <td className="border p-2">5'0 – 5'1</td>
                    <td className="border p-2">40"</td>
                    <td className="border p-2">42"</td>
                    <td className="border p-2">44"</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium">M</td>
                    <td className="border p-2">54</td>
                    <td className="border p-2">5'2 – 5'3</td>
                    <td className="border p-2">42"</td>
                    <td className="border p-2">44"</td>
                    <td className="border p-2">46"</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium">L</td>
                    <td className="border p-2">56</td>
                    <td className="border p-2">5'4 – 5'5</td>
                    <td className="border p-2">46"</td>
                    <td className="border p-2">48"</td>
                    <td className="border p-2">50"</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium">XL</td>
                    <td className="border p-2">58</td>
                    <td className="border p-2">5'6 – 5'7</td>
                    <td className="border p-2">48"</td>
                    <td className="border p-2">48"</td>
                    <td className="border p-2">50"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-lg mb-3">Custom Measurements</h4>
            <p className="text-gray-600">
              For unstitched fabrics, we offer custom tailoring services. Visit our stitching service page to learn more about our custom measurement and tailoring options.
            </p>
          </div>
          
          <div className="text-center">
            <button onClick={closeModal} className="bg-revive-red text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
