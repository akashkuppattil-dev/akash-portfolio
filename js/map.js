// Initialize and configure the Leaflet map
function initMap() {
    // Check if map container exists
    const mapContainer = document.getElementById('research-map');
    if (!mapContainer) return;

    // Default center (India)
    const defaultCenter = [20.5937, 78.9629];
    const defaultZoom = 5;
    
    // Initialize map
    const map = L.map('research-map').setView(defaultCenter, defaultZoom);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Research locations data (can be moved to JSON later)
    const researchLocations = [
        {
            name: 'Western Ghats',
            coords: [10.0889, 77.0595],
            description: 'Biodiversity hotspot with high endemism',
            type: 'field_site',
            date: '2023',
            icon: 'leaf',
            iconColor: '#2E8B57'
        },
        {
            name: 'Kerala',
            coords: [10.8505, 76.2711],
            description: 'Tropical rainforest ecosystem studies',
            type: 'field_site',
            date: '2022-2023',
            icon: 'tree',
            iconColor: '#2E8B57'
        },
        {
            name: 'Tamil Nadu',
            coords: [11.1271, 78.6569],
            description: 'Avian diversity research',
            type: 'field_site',
            date: '2021',
            icon: 'dove',
            iconColor: '#2E8B57'
        },
        {
            name: 'Karnataka',
            coords: [15.3173, 75.7139],
            description: 'Bioacoustic monitoring project',
            type: 'field_site',
            date: '2022',
            icon: 'headphones',
            iconColor: '#2E8B57'
        }
    ];

    // Create a custom icon
    function createCustomIcon(iconName, color) {
        return L.divIcon({
            html: `<div style="color: ${color}; font-size: 24px;"><i class="fas fa-${iconName}"></i></div>`,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
    }

    // Add markers for each research location
    researchLocations.forEach(location => {
        const marker = L.marker(location.coords, {
            icon: createCustomIcon(location.icon, location.iconColor)
        }).addTo(map);
        
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${location.name}</h4>
                <p>${location.description}</p>
                <div class="map-popup-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${location.date}</span>
                    <span><i class="fas fa-${location.icon}"></i> ${location.type.replace('_', ' ')}</span>
                </div>
            </div>
        `);
    });

    // Fit map to bounds of all markers
    if (researchLocations.length > 0) {
        const bounds = researchLocations.map(loc => loc.coords);
        map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Add scale control
    L.control.scale({ imperial: false }).addTo(map);
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', initMap);
