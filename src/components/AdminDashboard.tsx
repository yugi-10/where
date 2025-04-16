import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Bus, LogOut, Phone, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Bus {
  id: number;
  driver: string;
  phone: string;
  location: { lat: number; lng: number };
  status: string;
  route: string;
  lastUpdate: Date;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([
    { 
      id: 1, 
      driver: "John Doe", 
      phone: "555-0123", 
      location: { lat: 40.7128, lng: -74.0060 },
      status: 'On Route',
      route: 'Morning Route A',
      lastUpdate: new Date()
    },
    { 
      id: 2, 
      driver: "Jane Smith", 
      phone: "555-0124", 
      location: { lat: 40.7148, lng: -74.0068 },
      status: 'At Stop',
      route: 'Morning Route B',
      lastUpdate: new Date()
    },
    { 
      id: 3, 
      driver: "Mike Johnson", 
      phone: "555-0125", 
      location: { lat: 40.7138, lng: -74.0050 },
      status: 'On Route',
      route: 'Morning Route C',
      lastUpdate: new Date()
    },
  ]);

  useEffect(() => {
    // Simulate bus movements
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          location: {
            lat: bus.location.lat + (Math.random() - 0.5) * 0.001,
            lng: bus.location.lng + (Math.random() - 0.5) * 0.001
          },
          lastUpdate: new Date(),
          status: Math.random() < 0.1 ? 
            ['On Route', 'At Stop', 'Delayed', 'Arriving Soon'][Math.floor(Math.random() * 4)] : 
            bus.status
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'On Route': return 'bg-green-500';
      case 'At Stop': return 'bg-yellow-500';
      case 'Delayed': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">Admin Dashboard</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Live Fleet Tracking</h2>
              <div className="h-[600px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[40.7128, -74.0060]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {buses.map((bus) => (
                    <Marker key={bus.id} position={[bus.location.lat, bus.location.lng]}>
                      <Popup>
                        <div className="font-semibold">Bus #{bus.id}</div>
                        <div>Driver: {bus.driver}</div>
                        <div>Status: {bus.status}</div>
                        <div>Route: {bus.route}</div>
                        <div className="text-sm text-gray-500">
                          Last updated: {bus.lastUpdate.toLocaleTimeString()}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Fleet Status</h2>
              <div className="space-y-6">
                {buses.map((bus) => (
                  <div key={bus.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Bus className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-800">Bus #{bus.id}</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(bus.status)} mr-2`}></div>
                        <span className="text-sm font-medium text-gray-600">{bus.status}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {bus.driver}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {bus.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {bus.route}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Last updated: {bus.lastUpdate.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;