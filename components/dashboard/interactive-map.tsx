"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface ResearchSite {
  name: string
  coordinates: [number, number]
  households: number
  population: number
  type: 'major' | 'secondary' | 'household'
}

const researchSites: ResearchSite[] = [
  // Kenya
  { name: 'Nairobi', coordinates: [-1.2921, 36.8219], households: 2100, population: 4500000, type: 'major' },
  { name: 'Mombasa', coordinates: [-4.0435, 39.6682], households: 800, population: 1200000, type: 'secondary' },
  { name: 'Korogocho', coordinates: [-1.2850, 36.8700], households: 450, population: 150000, type: 'household' },
  { name: 'Kibera', coordinates: [-1.3131, 36.7819], households: 600, population: 200000, type: 'household' },
  
  // Tanzania
  { name: 'Dar es Salaam', coordinates: [-6.8235, 39.2695], households: 1800, population: 6000000, type: 'major' },
  { name: 'Arusha', coordinates: [-3.3731, 36.6823], households: 400, population: 400000, type: 'secondary' },
  
  // Uganda
  { name: 'Kampala', coordinates: [0.3476, 32.5825], households: 1200, population: 1500000, type: 'major' },
  { name: 'Jinja', coordinates: [0.4244, 33.2041], households: 300, population: 300000, type: 'secondary' },
  
  // Burkina Faso
  { name: 'Ouagadougou', coordinates: [12.3714, -1.5197], households: 900, population: 2200000, type: 'major' },
  { name: 'Bobo-Dioulasso', coordinates: [11.1861, -4.2893], households: 250, population: 500000, type: 'secondary' },
]

interface InteractiveMapProps {
  className?: string
}

export function InteractiveMap({ className = "" }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on East Africa
    const map = L.map(mapRef.current, {
      center: [0, 30],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    })

    // Add custom styled map tiles with orange/amber accent colors for water areas
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Custom icon for major cities
    const majorIcon = L.divIcon({
      className: 'custom-marker major',
      html: '<div class="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    })

    // Custom icon for secondary cities
    const secondaryIcon = L.divIcon({
      className: 'custom-marker secondary',
      html: '<div class="w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-md"></div>',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    })

    // Custom icon for households
    const householdIcon = L.divIcon({
      className: 'custom-marker household',
      html: '<div class="w-2 h-2 bg-orange-300 rounded-full border border-white shadow-sm"></div>',
      iconSize: [8, 8],
      iconAnchor: [4, 4]
    })

    // Add markers for each research site
    researchSites.forEach(site => {
      let icon
      switch (site.type) {
        case 'major':
          icon = majorIcon
          break
        case 'secondary':
          icon = secondaryIcon
          break
        case 'household':
          icon = householdIcon
          break
      }

      const marker = L.marker(site.coordinates, { icon }).addTo(map)
      
      // Create popup content
      const popupContent = `
        <div class="p-2">
          <h3 class="font-semibold text-gray-900 mb-1">${site.name}</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <div><span class="font-medium">Households:</span> ${site.households.toLocaleString()}</div>
            <div><span class="font-medium">Population:</span> ${site.population.toLocaleString()}</div>
            <div><span class="font-medium">Type:</span> ${site.type.charAt(0).toUpperCase() + site.type.slice(1)}</div>
          </div>
        </div>
      `
      
      marker.bindPopup(popupContent)
    })

    // Add country boundaries (simplified)
    const countries = [
      {
        name: 'Kenya',
        coordinates: [
          [5.0192, 33.9037], [4.2341, 34.4496], [3.5144, 35.2715], [2.9991, 36.5083],
          [1.6833, 37.9066], [1.1761, 38.6981], [0.4233, 39.6483], [-0.0236, 40.0992],
          [-1.2921, 40.8258], [-2.2151, 41.2703], [-3.2028, 41.8107], [-4.0435, 42.0000],
          [-4.0435, 39.6682], [-3.3731, 39.6823], [-2.2151, 39.2703], [-1.2921, 38.8258],
          [-0.0236, 38.0992], [0.4233, 37.6483], [1.1761, 36.6981], [1.6833, 35.9066],
          [2.9991, 34.5083], [3.5144, 33.2715], [4.2341, 32.4496], [5.0192, 31.9037]
        ]
      },
      {
        name: 'Tanzania',
        coordinates: [
          [-1.2921, 36.8219], [-2.2151, 37.2703], [-3.2028, 37.8107], [-4.0435, 38.0000],
          [-5.0192, 38.9037], [-6.8235, 39.2695], [-7.2028, 39.8107], [-8.0435, 40.0000],
          [-9.0192, 40.9037], [-10.2151, 41.2703], [-11.2028, 41.8107], [-12.0435, 42.0000],
          [-12.0435, 39.0000], [-11.2028, 38.8107], [-10.2151, 38.2703], [-9.0192, 37.9037],
          [-8.0435, 37.0000], [-7.2028, 36.8107], [-6.8235, 36.2695], [-5.0192, 35.9037],
          [-4.0435, 35.0000], [-3.2028, 34.8107], [-2.2151, 34.2703], [-1.2921, 33.8219]
        ]
      },
      {
        name: 'Uganda',
        coordinates: [
          [3.5144, 33.2715], [2.9991, 34.5083], [2.2151, 35.2703], [1.2921, 35.8258],
          [0.4233, 36.6483], [-0.0236, 37.0992], [-0.3476, 37.5825], [-0.3476, 32.5825],
          [0.4233, 31.6483], [1.2921, 30.8258], [2.2151, 30.2703], [2.9991, 29.5083],
          [3.5144, 28.2715], [4.2341, 27.4496], [5.0192, 26.9037], [5.0192, 31.9037],
          [4.2341, 32.4496], [3.5144, 33.2715]
        ]
      },
      {
        name: 'Burkina Faso',
        coordinates: [
          [15.0192, -5.9037], [14.2341, -4.4496], [13.5144, -3.2715], [12.9991, -2.5083],
          [12.3714, -1.5197], [11.1861, -0.2893], [10.4233, 0.6483], [9.9764, 1.0992],
          [9.3476, 2.5825], [8.4233, 3.6483], [7.2921, 4.8258], [6.2151, 5.2703],
          [5.2028, 5.8107], [4.0435, 6.0000], [4.0435, -4.0000], [5.2028, -3.8107],
          [6.2151, -3.2703], [7.2921, -2.8258], [8.4233, -1.6483], [9.3476, -0.5825],
          [9.9764, 0.9008], [10.4233, 1.3517], [11.1861, 2.2893], [12.3714, 3.5197],
          [12.9991, 4.5083], [13.5144, 5.2715], [14.2341, 6.4496], [15.0192, 7.9037]
        ]
      }
    ]

    // Add country labels only (no boundary lines)
    countries.forEach(country => {
      // Calculate center point for country labels
      const bounds = L.latLngBounds(country.coordinates as L.LatLngExpression[])
      const center = bounds.getCenter()
      
      L.marker(center, {
        icon: L.divIcon({
          className: 'country-label',
          html: `<div class="text-sm font-semibold text-gray-900 bg-orange-50 bg-opacity-90 px-2 py-1 rounded border border-orange-200">${country.name}</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        })
      }).addTo(map)
    })

    // Add zoom controls
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map)

    // Add legend
    const legend = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create('div', 'legend bg-white bg-opacity-90 rounded p-2 text-xs shadow-lg border border-orange-200')
        div.innerHTML = `
          <div class="font-medium mb-2 text-gray-900">Legend</div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Major Cities</span>
          </div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span>Secondary Cities</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 bg-orange-300 rounded-full"></div>
            <span>Households</span>
          </div>
        `
        return div
      }
    })
    new legend({ position: 'bottomleft' }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full rounded-b-lg ${className}`}
      style={{ 
        minHeight: '320px',
        position: 'relative'
      }}
    >
      <style jsx>{`
        .leaflet-container {
          background: #fef3c7 !important;
        }
        .leaflet-tile-pane img {
          filter: hue-rotate(60deg) saturate(1.6) brightness(1.3) contrast(0.8);
        }
      `}</style>
    </div>
  )
} 