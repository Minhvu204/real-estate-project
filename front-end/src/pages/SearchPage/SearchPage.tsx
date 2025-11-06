import { useEffect, useMemo, useState } from 'react';
import type { Property } from '../../types/Property';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAllProperties } from '../../services/propertyService';
import { useSearchParams } from 'react-router-dom';
import PropertyMap from '../../components/Property/PropertyMap';
import PropertyCard from '../../components/Property/PropertyCard';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Map as MapIcon, List as ListIcon } from '@mui/icons-material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { getLanguage, type Lang } from '../../utils/storage';
import { useTranslation } from 'react-i18next';
const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const savedFilters = JSON.parse(localStorage.getItem('propertyFilters') || '{}');
    const [minPrice, setMinPrice] = useState<number | ''>(savedFilters.minPrice ?? '');
    const [maxPrice, setMaxPrice] = useState<number | ''>(savedFilters.maxPrice ?? '');
    const [bedrooms, setBedrooms] = useState<number | ''>(savedFilters.bedrooms ?? '');
    const [bathrooms, setBathrooms] = useState<number | ''>(savedFilters.bathrooms ?? '');
    const [type, setType] = useState<string>(searchParams.get('type') || '');
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
        lat: 21.0285,
        lng: 105.8542,
    });
    const [sortBy, setSortBy] = useState<string>(savedFilters.sortBy ?? '');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const [mapView, setMapView] = useState(false);
    const { t } = useTranslation('propertyPage');
    const currentLanguage: Lang = getLanguage();
    useEffect(() => {
        setType(searchParams.get('type') || '');
    }, [searchParams]);

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
                console.log(data);
            } catch (error: any) {
                setError(error.message || t("propertyPage.errorData"));
            } finally {
                setLoading(false);
            }
        }
        fetchProperties();
    }, [])

    const filteredProperties = useMemo(() => {
        const removeVietnameseTones = (str: string) => {
            if (!str) return '';
            return str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d").replace(/Đ/g, "D")
                .replace(/\s+/g, "")
                .toLowerCase().trim();
        };
        const normalizedQuery = removeVietnameseTones(query);
        let result = properties.filter((p) => {
            const title = removeVietnameseTones(p.title?.[currentLanguage] || '');
            const address = removeVietnameseTones(p.address?.[currentLanguage] || '');
            const matchesQuery =
                title.includes(normalizedQuery) || address.includes(normalizedQuery);
            const matchesPrice = (minPrice === '' || p.price >= minPrice) && (maxPrice === '' || p.price <= maxPrice);
            const matchesBed = bedrooms === '' || p.bedrooms >= bedrooms;
            const matchesBath = bathrooms === '' || p.bathrooms >= bathrooms;
            const matchesStatus = !type || p.type_id?.type_name?.[currentLanguage] && p.type_id?.type_name[currentLanguage].toLowerCase().trim() === type.toLowerCase().trim();
            return matchesPrice && matchesBed && matchesBath && matchesStatus && matchesQuery;
        })
        if (sortBy === 'priceAsc') result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === 'priceDesc') result = [...result].sort((a, b) => b.price - a.price);
        if (sortBy === 'titleAsc') result = [...result].sort((a, b) => (a.title?.[currentLanguage] || '').localeCompare(b.title?.[currentLanguage] || ''));
        if (sortBy === 'titleDesc') result = [...result].sort((a, b) => (b.title?.[currentLanguage] || '').localeCompare(a.title?.[currentLanguage] || ''));
        if (sortBy === 'bedAsc') result = [...result].sort((a, b) => a.bedrooms - b.bedrooms);
        if (sortBy === 'bedDesc') result = [...result].sort((a, b) => b.bedrooms - a.bedrooms);
        if (sortBy === 'bathAsc') result = [...result].sort((a, b) => a.bathrooms - b.bathrooms);
        if (sortBy === 'bathDesc') result = [...result].sort((a, b) => b.bathrooms - a.bathrooms);
        return result;
    }, [query, minPrice, maxPrice, bedrooms, bathrooms, type, properties, sortBy, currentLanguage]);

    const paginatedProperties = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredProperties.slice(start, end);
    }, [filteredProperties, page]);

    useEffect(() => {
        setPage(1);
    }, [filteredProperties]);

    const handleSearch = async (q?: string) => {
        const searchValue = q ?? query;
        if (!searchValue.trim()) return;
        setSearchParams({ q: searchValue.trim() });
        try {
            const openCaseApiKey = import.meta.env.VITE_OPENCASE_API_KEY;
            const res = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchValue)}&key=${openCaseApiKey}&limit=1&countrycode=vn`
            )
            const data = await res.json();
            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                setMapCenter({ lat, lng });
            } else {
                alert(t("propertyPage.errorSearchPosition"));
            }
        } catch (error) {
            console.log(t("propertyPage.errorGeocoding"), error);
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
        setMapCenter({ lat: 21.0285, lng: 105.8542 });
    };

    const handleMinPriceChange = (event: SelectChangeEvent<number | '' | any>) => {
        setMinPrice(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleMaxPriceChange = (event: SelectChangeEvent<number | '' | any>) => {
        setMaxPrice(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBedroomsChange = (event: SelectChangeEvent<number | '' | any>) => {
        setBedrooms(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBathroomsChange = (event: SelectChangeEvent<number | '' | any>) => {
        setBathrooms(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleSortByChange = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value);
    };

    return (
        <>
            <div className="fixed inset-x-0 top-[80px] md:top-[85px] bottom-0 overflow-hidden flex flex-col">
                <div className="w-full flex flex-col md:flex-row md:items-center md:justify-center gap-3 p-3 bg-white shadow-sm sticky top-0 z-10">
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white transition focus-within:ring-2 focus-within:ring-gray-300 w-full md:w-[53%]">
                        <input
                            type="text"
                            placeholder={t("propertyPage.placeholderSearch")}
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

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>{t("propertyPage.minPrice")}</InputLabel>
                            <Select value={minPrice} label={t("propertyPage.minPrice")} onChange={handleMinPriceChange}>
                                <MenuItem value=""><em>{t("propertyPage.minPrice")}</em></MenuItem>
                                <MenuItem value={10000}>$10K</MenuItem>
                                <MenuItem value={20000}>$20K</MenuItem>
                                <MenuItem value={50000}>$50K</MenuItem>
                                <MenuItem value={100000}>$100K</MenuItem>
                                <MenuItem value={200000}>$200K</MenuItem>
                                <MenuItem value={500000}>$500K</MenuItem>
                                <MenuItem value={1000000}>$1M</MenuItem>
                                <MenuItem value={2000000}>$2M</MenuItem>
                                <MenuItem value={5000000}>$5M</MenuItem>
                                <MenuItem value={10000000}>$10M</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>{t("propertyPage.maxPrice")}</InputLabel>
                            <Select value={maxPrice} label={t("propertyPage.maxPrice")} onChange={handleMaxPriceChange}>
                                <MenuItem value=""><em>{t("propertyPage.maxPrice")}</em></MenuItem>
                                <MenuItem value={10000}>$10K</MenuItem>
                                <MenuItem value={20000}>$20K</MenuItem>
                                <MenuItem value={50000}>$50K</MenuItem>
                                <MenuItem value={100000}>$100K</MenuItem>
                                <MenuItem value={200000}>$200K</MenuItem>
                                <MenuItem value={500000}>$500K</MenuItem>
                                <MenuItem value={1000000}>$1M</MenuItem>
                                <MenuItem value={2000000}>$2M</MenuItem>
                                <MenuItem value={5000000}>$5M</MenuItem>
                                <MenuItem value={10000000}>$10M</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>{t("propertyPage.bedrooms")}</InputLabel>
                            <Select value={bedrooms} label={t("propertyPage.bedrooms")} onChange={handleBedroomsChange}>
                                <MenuItem value=""><em>{t("propertyPage.bedrooms")}</em></MenuItem>
                                <MenuItem value={1}>1+</MenuItem>
                                <MenuItem value={2}>2+</MenuItem>
                                <MenuItem value={3}>3+</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>{t("propertyPage.bathrooms")}</InputLabel>
                            <Select value={bathrooms} label={t("propertyPage.bathrooms")} onChange={handleBathroomsChange}>
                                <MenuItem value=""><em>{t("propertyPage.bathrooms")}</em></MenuItem>
                                <MenuItem value={1}>1+</MenuItem>
                                <MenuItem value={2}>2+</MenuItem>
                                <MenuItem value={3}>3+</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0">
                    <div className={`h-full min-h-0 ${mapView ? 'block' : 'hidden'} md:block`}>
                        {loading ? (
                            <div className='flex justify-center items-center h-full' >{t("propertyPage.loadMap")}</div>
                        ) : error ? (
                            <div className='flex justify-center items-center h-full text-red-500'>{error}</div>
                        ) : (
                            <PropertyMap properties={filteredProperties} center={mapCenter} />
                        )}
                    </div>
                    <div className={`h-full flex-col p-3 overflow-y-auto ${mapView ? 'hidden' : 'flex'} md:flex`}>
                        {loading ? (
                            <div className='flex justify-center items-center h-full' >{t("propertyPage.loadProperty")}</div>
                        ) : error ? (
                            <div className='flex justify-center items-center h-full text-red-500'>{error}</div>
                        ) : (
                            <>
                                <h1 className="text-xl font-semibold mb-2">{t("propertyPage.searchResults")}</h1>
                                <div className="flex justify-between items-center mb-3 text-gray-600">
                                    <p>{filteredProperties.length} {t("propertyPage.resultsFound")}</p>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>{t("propertyPage.sortBy")}</InputLabel>
                                        <Select value={sortBy} label={t("propertyPage.sortBy")} onChange={handleSortByChange}>
                                            <MenuItem value=""><em>{t("propertyPage.sortBy")}</em></MenuItem>
                                            <MenuItem value="priceAsc">{t("propertyPage.price")} ↑</MenuItem>
                                            <MenuItem value="priceDesc">{t("propertyPage.price")} ↓</MenuItem>
                                            <MenuItem value="titleAsc">{t("propertyPage.title")} A–Z</MenuItem>
                                            <MenuItem value="titleDesc">{t("propertyPage.title")} Z–A</MenuItem>
                                            <MenuItem value="bedAsc">{t("propertyPage.bedrooms")} ↑</MenuItem>
                                            <MenuItem value="bedDesc">{t("propertyPage.bedrooms")} ↓</MenuItem>
                                            <MenuItem value="bathAsc">{t("propertyPage.bathrooms")} ↑</MenuItem>
                                            <MenuItem value="bathDesc">{t("propertyPage.bathrooms")} ↓</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {paginatedProperties.map((property: Property) => (
                                        <PropertyCard key={property._id} property={property} />
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="mt-auto">
                            <Pagination
                                count={Math.ceil(filteredProperties.length / itemsPerPage)}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                renderItem={(item) => (
                                    <PaginationItem
                                        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                        {...item}
                                    />
                                )}
                                className="flex justify-center mt-4"
                            />
                        </div>
                    </div>
                </div>
                <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
                    <button
                        onClick={() => setMapView(!mapView)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1"
                    >
                        {mapView ? <ListIcon fontSize='small' /> : <MapIcon fontSize='small' />}
                        <span className='text-sm'>{mapView ? 'List' : 'Map'}</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SearchPage;
