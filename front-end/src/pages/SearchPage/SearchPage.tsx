import { useMemo, useState } from 'react';
import PropertyCard from '../../components/property/PropertyCard';
import PropertyMap from "../../components/property/PropertyMap";
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import type { Property } from '../../types/Property';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [bedrooms, setBedrooms] = useState<number | null>(null);
    const [bathrooms, setBathrooms] = useState<number | null>(null);
    // const [status, setStatus] = useState('');
    const filteredProperties = useMemo(() => {
        return MOCK_PROPERTIES.filter((p) => {
            const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase());
            const matchesPrice = (!minPrice || p.price >= minPrice) && (!maxPrice || p.price <= maxPrice);
            const matchesBed = bedrooms === null || p.bedrooms >= bedrooms;
            const matchesBath = bathrooms === null || p.bathrooms >= bathrooms;
            // const matchesStatus = !status || p.status === status;
            return matchesQuery && matchesPrice && matchesBed && matchesBath;
        })
    }, [query, minPrice, maxPrice, bedrooms, bathrooms])
    return (
        <>
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-center gap-3 p-3 bg-white shadow-sm">
                <div className="flex items-center border rounded-lg px-3 py-2 bg-white transition focus-within:ring-2 focus-within:ring-gray-300 w-full md:w-[53%]">
                    <input
                        type="text"
                        placeholder="Search by city, address..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full outline-none bg-transparent text-gray-700"
                    />
                    <div className="flex items-center gap-1 ml-2 text-gray-500">
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                aria-label="cancel-icon"
                                className="hover:text-red-500 transition"
                            >
                                <CancelIcon fontSize="small" />
                            </button>
                        )}
                        <button
                            aria-label="search-icon"
                            className="hover:text-blue-600 transition"
                        >
                            <SearchOutlinedIcon fontSize="small" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full md:w-auto justify-center">
                    <select aria-label="Select property type" className="border rounded-lg px-2 py-2 text-gray-700 focus:ring-2 focus:ring-gray-300">
                        <option value="">For Sale</option>
                        <option value="">For Rent</option>
                        <option value="">Sold</option>
                    </select>
                    <select aria-label="Select property min price" className="border rounded-lg px-2 py-2 text-gray-700 focus:ring-2 focus:ring-gray-300"
                        value={minPrice !== null ? minPrice / 1_000_000_000 : ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "21") setMinPrice(20_000_000_000);
                            else setMinPrice(Number(val) * 1_000_000_000 || null);
                        }}
                    >
                        <option value="">Min Price</option>
                        <option value="1">1 Tỷ</option>
                        <option value="2">2 Tỷ</option>
                        <option value="3">3 Tỷ</option>
                        <option value="4">4 Tỷ</option>
                        <option value="5">5 Tỷ</option>
                        <option value="10">10 Tỷ</option>
                        <option value="20">20 Tỷ</option>
                        <option value="21">{`> 20 Tỷ`}</option>
                    </select>
                    <select aria-label="Select property max price" className="border rounded-lg px-2 py-2 text-gray-700 focus:ring-2 focus:ring-gray-300"
                        value={maxPrice !== null ? maxPrice / 1_000_000_000 : ''}
                        onChange={(e) => setMaxPrice(Number(e.target.value) * 1_000_000_000 || null)}
                    >
                        <option value="">Max Price</option>
                        <option value="0">{`< 1 Tỷ`}</option>
                        <option value="1">1 Tỷ</option>
                        <option value="2">2 Tỷ</option>
                        <option value="3">3 Tỷ</option>
                        <option value="4">4 Tỷ</option>
                        <option value="5">5 Tỷ</option>
                        <option value="10">10 Tỷ</option>
                        <option value="20">20 Tỷ</option>
                    </select>
                    <select aria-label="Select property bedrooms" className="border rounded-lg px-2 py-2 text-gray-700 focus:ring-2 focus:ring-gray-300"
                        value={bedrooms ?? ''}
                        onChange={(e) => setBedrooms(Number(e.target.value) || null)}
                    >
                        <option value="">Bedrooms</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                    </select>
                    <select aria-label="Select property bathrooms" className="border rounded-lg px-2 py-2 text-gray-700 focus:ring-2 focus:ring-gray-300"
                        value={bathrooms ?? ''}
                        onChange={(e) => setBathrooms(Number(e.target.value) || null)}
                    >
                        <option value="">Bathrooms</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 h-[90vh]">
                <div>
                    <PropertyMap properties={filteredProperties} />
                </div>
                <div className="overflow-y-auto max-h-[90vh] p-3">
                    <h1 className="text-xl font-semibold mb-2">Search Results</h1>
                    <div className="flex justify-between mb-3 text-gray-600">
                        <p>{filteredProperties.length} results found</p>
                        <p>Sort by</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredProperties.map((property: Property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};


export default SearchPage;
