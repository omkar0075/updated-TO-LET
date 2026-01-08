
import React, { useState } from 'react';
import { User, PropertyType, RoomType, Coordinates } from '../types';
import { api } from '../services/api';
import { MapPicker } from '../components/MapPicker';

interface AddPropertyProps {
  user: User;
  onComplete: () => void;
}

export const AddProperty: React.FC<AddPropertyProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [publishedId, setPublishedId] = useState('');
  const [formData, setFormData] = useState({
    propertyType: PropertyType.ROOM,
    roomType: RoomType.SINGLE,
    rent: 5000,
    address: '',
    description: '',
    coordinates: { lat: 18.5204, lng: 73.8567 }, // Default to Pune
    images: [] as string[]
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleLocationSelect = (coords: Coordinates, address?: string) => {
    setFormData(prev => ({ 
      ...prev, 
      coordinates: coords, 
      address: address || prev.address 
    }));
  };

  const validateStep1 = () => {
    if (!formData.rent || formData.rent <= 0) return 'Please enter a valid rent amount';
    if (!formData.description) return 'Please provide a short description for your advertisement';
    return '';
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.address) {
      setError('Please select the exact location on the map to help seekers find your room');
      return;
    }
    setError('');
    
    try {
      const newProp = await api.addProperty({
        ownerId: user.id,
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        rent: formData.rent,
        address: formData.address,
        description: formData.description,
        coordinates: formData.coordinates,
        images: formData.images.length > 0 ? formData.images : ['https://picsum.photos/seed/default/600/400']
      });
      setPublishedId(newProp.id);
      setIsPublished(true);
    } catch (err) {
      setError('Something went wrong while publishing your ad. Please try again.');
    }
  };

  if (isPublished) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-green-100">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="fa-solid fa-check text-4xl"></i>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Property is Live!</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Congratulations! Your room has been successfully advertised on TO-LET. Seekers can now view your listing and send you enquiries.
          </p>
          <div className="flex flex-col space-y-4">
            <button 
              onClick={onComplete}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg transition"
            >
              Go to Dashboard
            </button>
            <button 
              className="w-full bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-100 transition border border-gray-200"
              onClick={() => {
                // In a real app we'd navigate to the property page. 
                // For this demo, we can just trigger a refresh or show dashboard.
                onComplete();
              }}
            >
              Preview My Listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Advertise Your Room</h2>
            <p className="text-blue-100 opacity-80">List details and reach thousands of students</p>
          </div>
          <div className="text-4xl font-black opacity-20">Step {step}/2</div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold">
              <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Property Category*</label>
                  <select 
                    className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={formData.propertyType}
                    onChange={(e) => setFormData(p => ({ ...p, propertyType: e.target.value as PropertyType }))}
                  >
                    <option value={PropertyType.ROOM}>Individual Room</option>
                    <option value={PropertyType.HOSTEL_PG}>PG / Hostel</option>
                    <option value={PropertyType.APARTMENT}>Full Apartment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Room / Flat Type*</label>
                  <select 
                    className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={formData.roomType}
                    onChange={(e) => setFormData(p => ({ ...p, roomType: e.target.value as RoomType }))}
                  >
                    <option value={RoomType.SINGLE}>Single Sharing</option>
                    <option value={RoomType.DOUBLE}>Double Sharing</option>
                    <option value={RoomType.TRIPLE}>Triple Sharing</option>
                    <option value={RoomType.BHK1}>1 BHK</option>
                    <option value={RoomType.BHK2}>2 BHK</option>
                    <option value={RoomType.FLAT_SHARE}>Flat Share</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Rent (₹)*</label>
                <input 
                  type="number" 
                  className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  value={formData.rent}
                  onChange={(e) => setFormData(p => ({ ...p, rent: Number(e.target.value) }))}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description / Highlights</label>
                <textarea 
                  className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-32"
                  placeholder="Tell students about WiFi, AC, laundry, or any house rules..."
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition"
                >
                  Continue to Map <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Exact Location on Map*</label>
                  <p className="text-xs text-gray-500 mb-4">Drag the marker or search to the precise spot of your property.</p>
                  <div className="h-72 rounded-2xl overflow-hidden border mb-4 shadow-inner">
                     <MapPicker initialCenter={formData.coordinates} onLocationSelect={handleLocationSelect} />
                  </div>
                  <div className="flex items-start bg-blue-50 p-4 rounded-2xl">
                    <i className="fa-solid fa-location-dot text-blue-600 mt-1 mr-3"></i>
                    <p className="text-sm font-medium text-blue-800">{formData.address || 'Select a location on the map above...'}</p>
                  </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-4">Property Photos</label>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative h-32 rounded-xl overflow-hidden border group">
                         <img src={img} className="w-full h-full object-cover" alt="" />
                         <button 
                           onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                           className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                           <i className="fa-solid fa-xmark text-xs"></i>
                         </button>
                      </div>
                    ))}
                    <label className="h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition group">
                       <i className="fa-solid fa-camera text-2xl text-gray-400 group-hover:text-blue-500 mb-2"></i>
                       <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500">Add Photo</span>
                       <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                 </div>
               </div>

               <div className="flex justify-between items-center pt-8 border-t">
                 <button 
                  onClick={() => setStep(1)}
                  className="text-gray-500 font-bold hover:underline"
                 >
                  Back to Details
                 </button>
                 <button 
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition"
                 >
                  Publish Listing Now
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
