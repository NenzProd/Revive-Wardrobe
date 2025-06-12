
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
            <h4 className="font-medium text-lg mb-3">Women's Sizes (in inches)</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Size</th>
                    <th className="border p-2 text-left">Bust</th>
                    <th className="border p-2 text-left">Waist</th>
                    <th className="border p-2 text-left">Hips</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">XS</td>
                    <td className="border p-2">31-32</td>
                    <td className="border p-2">24-25</td>
                    <td className="border p-2">34-35</td>
                  </tr>
                  <tr>
                    <td className="border p-2">S</td>
                    <td className="border p-2">33-34</td>
                    <td className="border p-2">26-27</td>
                    <td className="border p-2">36-37</td>
                  </tr>
                  <tr>
                    <td className="border p-2">M</td>
                    <td className="border p-2">35-36</td>
                    <td className="border p-2">28-29</td>
                    <td className="border p-2">38-39</td>
                  </tr>
                  <tr>
                    <td className="border p-2">L</td>
                    <td className="border p-2">37-39</td>
                    <td className="border p-2">30-32</td>
                    <td className="border p-2">40-42</td>
                  </tr>
                  <tr>
                    <td className="border p-2">XL</td>
                    <td className="border p-2">40-42</td>
                    <td className="border p-2">33-35</td>
                    <td className="border p-2">43-45</td>
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
