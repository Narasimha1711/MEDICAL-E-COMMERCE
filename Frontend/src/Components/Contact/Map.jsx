import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = () => {
  const position = [13.6239, 79.4111]; // Coordinates for IIIT Sri City, Andhra Pradesh, India

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h2 className="text-xl font-semibold text-white">Our Location</h2>
        <p className="text-blue-100">IIIT Sri City, Andhra Pradesh</p>
      </div>

      {/* Map Container */}
      <div className="h-[400px] w-full">
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          {/* Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Marker */}
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-blue-700">IIIT Sri City</h3>
                <p className="text-sm text-gray-600">
                  Indian Institute of Information Technology<br />
                  Chittoor District, Andhra Pradesh, India
                </p>
                <a 
                  href="https://www.iiits.ac.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline text-sm"
                >
                  Visit Official Website
                </a>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
