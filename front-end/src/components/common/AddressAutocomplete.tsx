import { useEffect, useState } from "react";

interface AddressAutocompleteProps {
    value?: string;
    onSelect: (address: string, lat: number, lon: number) => void;
}
const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
    value: propValue,
    onSelect,
}) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState(propValue || "");

    useEffect(() => {
        setInputValue(propValue || "");
    }, [propValue]);
    useEffect(() => {
        if (!inputValue.trim()) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setSuggestions([]);

        const delayDebounce = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                        inputValue
                    )}&apiKey=${GEOAPIFY_KEY}&lang=vi`
                );
                const data = await res.json();
                setSuggestions(data.features || []);
            } catch (err) {
                console.error("Geoapify fetch error:", err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [inputValue]);
    const handleSelect = (item: any) => {
        const address = `${item.properties.address_line1 || ""}${item.properties.city ? `, ${item.properties.city}` : ""
            }`;
        setInputValue(address);
        setSuggestions([]);
        onSelect(address, item.properties.lat, item.properties.lon);
    };


    return (
        <div className="relative w-full">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập địa chỉ bất động sản..."
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {(loading || suggestions.length > 0) && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {loading && (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                            Đang tải gợi ý...
                        </div>
                    )}
                    {!loading &&
                        suggestions.map((item) => (
                            <div
                                key={item.properties.place_id}
                                onClick={() => handleSelect(item)}
                                className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                            >
                                {item.properties.address_line1}
                                {item.properties.city && `, ${item.properties.city}`}
                            </div>
                        ))}

                    {!loading && !suggestions.length && inputValue.trim() && (
                        <div className="px-3 py-2 text-gray-500 text-sm italic">
                            Không tìm thấy địa chỉ phù hợp
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressAutocomplete;
