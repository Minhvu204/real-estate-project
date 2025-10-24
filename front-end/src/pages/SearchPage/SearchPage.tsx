import { useEffect, useMemo, useState } from 'react';
import PropertyCard from '../../components/property/PropertyCard';
import PropertyMap from "../../components/property/PropertyMap";
import type { Property } from '../../types/Property';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAllProperties } from '../../services/propertyService';
import { useSearchParams } from 'react-router-dom';
const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const savedFilters = JSON.parse(localStorage.getItem('propertyFilters') || '{}');
    const [minPrice, setMinPrice] = useState<number | null>(savedFilters.minPrice ?? null);
    const [maxPrice, setMaxPrice] = useState<number | null>(savedFilters.maxPrice ?? null);
    const [bedrooms, setBedrooms] = useState<number | null>(savedFilters.bedrooms ?? null);
    const [bathrooms, setBathrooms] = useState<number | null>(savedFilters.bathrooms ?? null);
    const [type, setType] = useState<string | null>(
        savedFilters.type && typeof savedFilters.type === 'string' ? savedFilters.type : null
    );
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
        lat: 21.0285,
        lng: 105.8542,
    });
    const [sortBy, setSortBy] = useState<string>(savedFilters.sortBy ?? null);
    useEffect(() => {
        const filters = { minPrice, maxPrice, bedrooms, bathrooms, type, sortBy };
        localStorage.setItem('propertyFilters', JSON.stringify(filters));
    }, [minPrice, maxPrice, bedrooms, bathrooms, type, sortBy]);
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const data = await getAllProperties();
                setProperties(data);
            } catch (error: any) {
                setError(error.message || "Khong the tai duoc du lieu");
            } finally {
                setLoading(false);
            }
        }
        fetchProperties();
    }, [])

    const filteredProperties = useMemo(() => {
        const removeVietnameseTones = (str: string) => {
            return str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d").replace(/Đ/g, "D")
                .replace(/\s+/g, "")
                .toLowerCase().trim();
        };
        const normalizedQuery = removeVietnameseTones(query);
        let result = properties.filter((p) => {
            const title = removeVietnameseTones(p.title);
            const address = removeVietnameseTones(p.address);
            const matchesQuery =
                title.includes(normalizedQuery) || address.includes(normalizedQuery);
            const matchesPrice = (!minPrice || p.price >= minPrice) && (!maxPrice || p.price <= maxPrice);
            const matchesBed = bedrooms === null || p.bedrooms >= bedrooms;
            const matchesBath = bathrooms === null || p.bathrooms >= bathrooms;
            const matchesStatus = !type || p.type_id?.type_name && p.type_id?.type_name.toLowerCase().trim() === type.toLowerCase().trim();
            return matchesPrice && matchesBed && matchesBath && matchesStatus && matchesQuery;
        })
        if (sortBy === 'priceAsc') result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === 'priceDesc') result = [...result].sort((a, b) => b.price - a.price);
        if (sortBy === 'titleAsc') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === 'titleDesc') result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        if (sortBy === 'bedAsc') result = [...result].sort((a, b) => a.bedrooms - b.bedrooms);
        if (sortBy === 'bedDesc') result = [...result].sort((a, b) => b.bedrooms - a.bedrooms);
        if (sortBy === 'bathAsc') result = [...result].sort((a, b) => a.bathrooms - b.bathrooms);
        if (sortBy === 'bathDesc') result = [...result].sort((a, b) => b.bathrooms - a.bathrooms);
        return result;
    }, [query, minPrice, maxPrice, bedrooms, bathrooms, type, properties, sortBy]);
    const handleSearch = async (q?: string) => {
        const searchValue = q ?? query;
        if (!searchValue.trim()) return;
        setSearchParams({ q: searchValue.trim() });
        try {
            const openCaseApiKey = import.meta.env.VITE_OPEN_API_KEY;
            const res = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchValue)}&key=${openCaseApiKey}&limit=1&countrycode=vn`
            )
            const data = await res.json();
            console.log(data);
            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                setMapCenter({ lat, lng });
            } else {
                alert("Không tìm thấy vị trí, vui lòng nhập lại.");
            }
        } catch (error) {
            console.log("Geocoding error:", error);
        }
    }
    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery);
            handleSearch(initialQuery);
        }
    }, [initialQuery]);
    const clearSearch = () => {
        setQuery('');
        setSearchParams({});
        setMapCenter({ lat: 21.0285, lng: 105.8542 }); // Reset về mặc định
    };
    return (
        <>
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-center gap-3 p-3 bg-white shadow-sm">
                <div className="flex items-center border rounded-lg px-3 py-2 bg-white transition focus-within:ring-2 focus-within:ring-gray-300 w-full md:w-[53%]">
                    <input
                        type="text"
                        placeholder="Search by city, address..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                        className="w-full outline-none bg-transparent text-gray-700"
                    />
                    <div className="flex items-center gap-1 ml-2 text-gray-500">
                        {query && (
                            <button
                                onClick={clearSearch}
                                aria-label="cancel-icon"
                                className="hover:text-red-500 transition"
                            >
                                <CancelIcon fontSize="small" />
                            </button>
                        )}
                        <button
                            aria-label="search-icon"
                            className="hover:text-blue-600 transition"
                            onClick={() => handleSearch()}
                        >
                            <SearchOutlinedIcon fontSize="small" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full md:w-auto justify-center ">
                    <select aria-label="Select property type" className="border rounded-lg px-2 py-2 text-gray-700 focus:ring-2 focus:ring-gray-300"
                        value={type ?? ''}
                        onChange={(e) => setType(e.target.value || null)}
                    >
                        <option value="">All Types</option>
                        <option value="For Sale">For Sale</option>
                        <option value="For Rent">For Rent</option>
                    </select>
                    <select aria-label="Select property min price" className="border rounded-lg px-2 py-2 text-gray-700 focus:ring-2 focus:ring-gray-300"
                        value={minPrice ?? ''}
                        onChange={(e) => setMinPrice(Number(e.target.value) || null)}
                    >
                        <option value="">Min Price</option>
                        <option value="10000">$10K </option>
                        <option value="20000">$20K </option>
                        <option value="50000">$50K </option>
                        <option value="100000">$100K </option>
                        <option value="200000">$200K </option>
                        <option value="500000">$500K </option>
                        <option value="1000000">$1M </option>
                        <option value="2000000">$2M </option>
                        <option value="5000000">$5M </option>
                        <option value="10000000">$10M </option>
                    </select>
                    <select aria-label="Select property max price" className="border rounded-lg px-2 py-2 text-gray-700 focus:ring-2 focus:ring-gray-300"
                        value={maxPrice ?? ""}
                        onChange={(e) => setMaxPrice(Number(e.target.value) || null)}
                    >
                        <option value="">Max Price</option>
                        <option value="10000">$10K </option>
                        <option value="20000">$20K </option>
                        <option value="50000">$50K </option>
                        <option value="100000">$100K </option>
                        <option value="200000">$200K </option>
                        <option value="500000">$500K </option>
                        <option value="1000000">$M </option>
                        <option value="2000000">$2M </option>
                        <option value="5000000">$5M </option>
                        <option value="10000000">$10M </option>
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
                    {loading ? (
                        <div className='flex justify-center items-center h-full' >Loading maps...</div>
                    ) : error ? (
                        <div className='flex justify-center items-center h-full text-red-500'>{error}</div>
                    ) : (
                        <PropertyMap properties={filteredProperties} center={mapCenter} />
                    )}
                </div>
                <div className="overflow-y-auto max-h-[90vh] p-3">
                    {loading ? (
                        <div className='flex justify-center items-center h-full' >Loading properties...</div>
                    ) : error ? (
                        <div className='flex justify-center items-center h-full text-red-500'>{error}</div>
                    ) : (
                        <>
                            <h1 className="text-xl font-semibold mb-2">Search Results</h1>
                            <div className="flex justify-between items-center mb-3 text-gray-600">
                                <p>{filteredProperties.length} results found</p>
                                <select
                                    aria-label='select sort'
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-gray-300"
                                >
                                    <option value="">Sort by</option>
                                    <option value="priceAsc">Price ↑</option>
                                    <option value="priceDesc">Price ↓</option>
                                    <option value="titleAsc">Title A–Z</option>
                                    <option value="titleDesc">Title Z–A</option>
                                    <option value="bedAsc">Bedrooms ↑</option>
                                    <option value="bedDesc">Bedrooms ↓</option>
                                    <option value="bathAsc">Bathrooms ↑</option>
                                    <option value="bathDesc">Bathrooms ↓</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredProperties.map((property: Property) => (
                                    <PropertyCard key={property._id} property={property} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};


export default SearchPage;
