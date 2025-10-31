import type { Property } from '../../types/Property';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import React, { useState } from 'react';
import PropertyCard from './PropertyCard';

type PropertyMapProps = {
    properties: Property[];
}
const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const center = {
    lat: 21.0285,
    lng: 105.8542,
};
const PropertyMap: React.FC<PropertyMapProps> = ({ properties }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY as string,
    });
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    if (loadError) return <div>Không tải được bản đồ</div>;
    if (!isLoaded) return <div>Đang tải bản đồ...</div>;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={center}
        >
            {properties.map((property) => (
                <Marker
                    key={property._id}
                    position={property.coordinates}
                    label={{
                        text:
                            property.price >= 1_000_000_000
                                ? `${(property.price / 1_000_000_000).toFixed(1)} Tỷ`
                                : `${(property.price / 1_000_000).toFixed(0)} Tr`,
                        className:
                            'bg-white text-white font-semibold text-xs px-2 py-1 rounded-md shadow-md',
                    }}
                    onClick={() => setSelectedProperty(property)}
                />
            ))}
            {selectedProperty && (
                <InfoWindow
                    position={selectedProperty.coordinates}
                    onCloseClick={() => setSelectedProperty(null)}
                >
                    <div className="max-w-[320px] rounded-xl overflow-hidden shadow-lg">
                        <PropertyCard property={selectedProperty} />
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}

export default PropertyMap;
