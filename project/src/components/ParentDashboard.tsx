import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Bus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MovingMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return (
    <Marker position={position}>
      <Popup>
        🚌 Bus #123 <br />
        Last updated: {new Date().toLocaleTimeString()}
      </Popup>
    </Marker>
  );
};

const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [busLocation, setBusLocation] = useState<[number, number]>([40.7128, -74.006]);
  const [status, setStatus] = useState('On Route');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setBusLocation((prev) => {
        const lat = prev[0] + (Math.random() - 0.5) * 0.001;
        const lng = prev[1] + (Math.random() - 0.5) * 0.001;
        return [lat, lng];
      });

      setLastUpdate(new Date());

      const statuses = ['On Route', 'At Stop', 'Arriving Soon', 'Delayed'];
      if (Math.random() < 0.1) {
        setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 p-4 font-sans">
      <nav className="bg-white/20 backdrop-blur-lg shadow-xl rounded-xl px-6 py-4 flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Bus className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white font-orbitron">SchoolBus Tracker</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/40">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white font-orbitron">Live Bus Location</h2>
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full animate-ping ${
                  status === 'On Route' ? 'bg-green-400' : 'bg-yellow-400'
                }`}
              ></span>
              <span className="text-white text-sm">{status}</span>
            </div>
          </div>

          <div className="h-[500px] rounded-xl overflow-hidden shadow-lg ring-1 ring-white/40">
            <MapContainer center={busLocation} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <MovingMarker position={busLocation} />
            </MapContainer>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white font-orbitron mb-3">Bus Information</h3>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 text-white border border-white/30">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>🚌 Bus Number: <strong>#123</strong></p>
                  <p>👨‍✈️ Driver: <strong>John Doe</strong></p>
                </div>
                <div>
                  <p>🗺️ Route: <strong>Morning Route A</strong></p>
                  <p>⏱️ Last Updated: <strong>{lastUpdate.toLocaleTimeString()}</strong></p>
                </div>
              </div>
              <div className="mt-4 bg-blue-900/20 p-3 rounded-md">
                📍 Current Location: <strong>{busLocation[0].toFixed(4)}, {busLocation[1].toFixed(4)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
