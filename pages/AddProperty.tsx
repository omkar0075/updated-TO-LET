
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
  const [formData, setFormData] = useState({
    propertyType: PropertyType.ROOM,
    roomType: RoomType.SINGLE,
    rent: 5000,
    address: '',
    description: '',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    images: [] as string[]
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Fix: Cast the result of Array.from to File[] to ensure the 'file' variable is correctly typed for reader.readAsDataURL
      const files = Array.from(e.target.files) as File[];
      setImageFiles(prev => [...prev, ...files]);
      
      // Generate previews
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

  const handleSubmit = async () => {
    await api.addProperty({
      ownerId: user.id,
      propertyType: formData.propertyType,
      roomType: formData.roomType,
      rent: formData.rent,
      address: formData.address,
      description: formData.description,
      coordinates: formData.coordinates,
      images: formData.images.length > 0 ? formData.images : ['https://picsum.photos/seed/default/600/400']
    });
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">List Your Property</h2>
            <p className="text-blue-100 opacity-80">Share your space with verified students</p>
          </div>
          <div className="text-4xl font-black opacity-20">Step {step}/2</div>
        </div>

        <div className="p-8">
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-32"
                  placeholder="Describe your property, amenities, house rules..."
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700"
                >
                  Continue <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Exact Location on Map*</label>
                  <div className="h-72 rounded-2xl overflow-hidden border mb-4">
                     <MapPicker onLocationSelect={handleLocationSelect} />
                  </div>
                  <input 
                    type="text"
                    className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                    placeholder="Auto-filled address from map..."
                    value={formData.address}
                    readOnly
                  />
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-4">Upload Photos (Min 1)*</label>
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
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700"
                 >
                  Publish Listing
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
