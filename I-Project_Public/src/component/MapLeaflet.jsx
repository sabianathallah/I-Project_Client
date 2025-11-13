import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon with museum emoji
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="font-size: 2.5rem; text-align: center;">🏛️</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Additional point markers
const poiIcon = L.divIcon({
  className: 'poi-marker',
  html: '<div style="font-size: 1.8rem; text-align: center;">📍</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const parkingIcon = L.divIcon({
  className: 'parking-marker',
  html: '<div style="font-size: 1.8rem; text-align: center;">🅿️</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const infoIcon = L.divIcon({
  className: 'info-marker',
  html: '<div style="font-size: 1.8rem; text-align: center;">ℹ️</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

export default function MapLeaflet() {
  // Koordinat Museum Utama
  const museumPosition = [-7.790417626340788, 110.28128801848115];
  
  // Koordinat Poin-Poin Menarik di Sekitar Museum
  const pointsOfInterest = [
    {
      position: [-7.790617626340788, 110.28158801848115],
      icon: parkingIcon,
      name: 'Area Parkir',
      description: 'Parkir kendaraan tersedia untuk pengunjung'
    },
    {
      position: [-7.790217626340788, 110.28098801848115],
      icon: infoIcon,
      name: 'Pusat Informasi',
      description: 'Informasi dan panduan museum'
    },
    {
      position: [-7.790517626340788, 110.28168801848115],
      icon: poiIcon,
      name: 'Pintu Masuk Utama',
      description: 'Akses masuk untuk pengunjung'
    }
  ];
  
  return (
    <MapContainer 
      center={museumPosition} 
      zoom={17} 
      style={{ width: '100%', height: '400px', borderRadius: '8px', zIndex: 1 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Museum Marker - Main Location */}
      <Marker position={museumPosition} icon={customIcon}>
        <Popup>
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <strong style={{ fontSize: '1.1rem', color: '#d4af37' }}>🏛️ Museum Sejarah Soeharto</strong>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
              Lokasi Utama Museum<br />
              Buka: Senin-Minggu 10.00-17.00 WIB
            </p>
            <a 
              href="https://maps.app.goo.gl/X4Ywp8MBW156VP3HA" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#d4af37', 
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Buka di Google Maps →
            </a>
          </div>
        </Popup>
      </Marker>

      {/* Additional Points of Interest */}
      {pointsOfInterest.map((poi, index) => (
        <Marker key={index} position={poi.position} icon={poi.icon}>
          <Popup>
            <div style={{ textAlign: 'center', padding: '0.3rem' }}>
              <strong style={{ fontSize: '1rem', color: '#2c2c2c' }}>{poi.name}</strong>
              <p style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: '#666' }}>
                {poi.description}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
