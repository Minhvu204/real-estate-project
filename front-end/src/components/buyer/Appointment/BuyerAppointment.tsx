import { getPropertiesById } from '@/services/propertyService';
import type { Property } from '@/types/Property';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Button } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

interface BuyerAppointmentProps {
    property: Property;
    onClose: () => void;
}

const BuyerAppointment = ({ property, onClose }: BuyerAppointmentProps) => {

    const today = new Date();

    const [slots, setSlots] = useState<
        { baseDate: Date; date: Date | null; time: string | null }[]
    >([
        { baseDate: new Date(), date: null, time: null }
    ]);

    // ---------------- HELPERS ----------------

    const formatDate = (date: Date) => {
        const day = date.toLocaleString('default', { weekday: 'short' });
        const month = date.toLocaleString('default', { month: 'short' });
        return `${day} ${date.getDate()} ${month}`;
    };

    const addDays = (date: Date, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const timeSlots: string[] = [];
    for (let hour = 9; hour <= 19; hour++) {
        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour;
        timeSlots.push(`${displayHour}:00 ${suffix}`);
    }

    // ---------------- HANDLERS ----------------

    const handlePrevDays = (index: number) => {
        setSlots((prev) => {
            const updated = [...prev];
            updated[index].baseDate = addDays(updated[index].baseDate, -3);
            updated[index].date = null;
            return updated;
        });
    };

    const handleNextDays = (index: number) => {
        setSlots((prev) => {
            const updated = [...prev];
            updated[index].baseDate = addDays(updated[index].baseDate, 3);
            updated[index].date = null;
            return updated;
        });
    };
    today.setHours(0, 0, 0, 0);

    const isPastOrToday = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d <= today;
    };

    const canGoBack = (baseDate: Date) => {
        const prev = addDays(baseDate, -3);
        prev.setHours(0, 0, 0, 0);
        return prev > today;
    };

    const handleSelectDate = (index: number, date: Date) => {
        setSlots((prev) => {
            const updated = [...prev];
            updated[index].date = date;
            updated[index].time = null;
            return updated;
        });
    };

    const handleSelectTime = (index: number, time: string) => {
        setSlots((prev) => {
            const updated = [...prev];
            updated[index].time = time;
            return updated;
        });
    };

    const handleDeleteSlot = (index: number) => {
        setSlots((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddSlot = () => {
        setSlots((prev) => [
            ...prev,
            { baseDate: new Date(), date: null, time: null }
        ]);
    };


    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden p-4">

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-center flex-1">
                    Request a tour
                </h2>
                <button className="p-2" onClick={onClose}>
                    <CloseOutlinedIcon />
                </button>
            </div>

            <hr className="my-4" />

            <div className="flex gap-4 sm:gap-5 mb-6">
                <img
                    src={property.images[0] || "/defaultHome.png"}
                    className="w-32 h-24 rounded-lg object-cover"
                />

                <div className="text-sm my-auto leading-tight">
                    <p className="font-semibold">{property.title.vi}</p>
                    <p>{property.address.vi}</p>
                    <p>{property.area} | {property.floors} | {property.price}</p>
                </div>
            </div>

            <div className="flex gap-3 items-start bg-blue-50 p-4 rounded-xl mb-6">
                <TipsAndUpdatesOutlinedIcon className="text-blue-400" />
                <p className="text-sm">
                    Selecting multiple times helps schedule your tour faster
                </p>
            </div>

            <hr className="my-4" />

            {slots.map((slot, index) => {
                const days = [
                    addDays(slot.baseDate, 0),
                    addDays(slot.baseDate, 1),
                    addDays(slot.baseDate, 2),
                ];

                return (
                    <div key={index} className="mb-10">
                        {index > 0 && <hr className='mb-3'></hr>}

                        {index === 0 ? (
                            <h4 className="font-bold mb-6">
                                Select up to 3 times
                            </h4>
                        ) : (
                            <div className="flex justify-between items-center mb-6 px-1">
                                <span className="font-semibold text-gray-800 text-lg">
                                    Alternative time
                                </span>

                                <button
                                    onClick={() => handleDeleteSlot(index)}
                                    className="text-blue-600 hover:text-red-600 text-sm"
                                >
                                    <DeleteOutlinedIcon />
                                </button>
                            </div>
                        )}

                        <div className="flex justify-center items-center gap-4 mb-4">
                            <ArrowBackIosNewOutlinedIcon
                                className={`cursor-pointer ${!canGoBack(slot.baseDate) ? "opacity-30 cursor-not-allowed" : ""}`}
                                onClick={() => {
                                    if (!canGoBack(slot.baseDate)) return;
                                    handlePrevDays(index);
                                }}
                            />

                            <div className="grid grid-cols-3 gap-3 w-full max-w-xs text-center">
                                {days.map((d, dIndex) => (
                                    <div
                                        key={dIndex}
                                        className={`
        border-2 rounded-xl py-3 text-sm text-center
        ${isPastOrToday(d)
                                                ? "opacity-40 cursor-not-allowed"
                                                : "cursor-pointer"}
        ${slot.date?.toDateString() === d.toDateString()
                                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                                : "border-gray-300"}
    `}
                                        onClick={() => {
                                            if (isPastOrToday(d)) return;
                                            handleSelectDate(index, d);
                                        }}
                                    >
                                        {formatDate(d)}
                                    </div>
                                ))}
                            </div>

                            <ArrowForwardIosOutlinedIcon
                                className="cursor-pointer"
                                onClick={() => handleNextDays(index)}
                            />
                        </div>

                        <div className="w-full max-w-xs mx-auto">
                            <select
                                className="w-full border rounded-lg p-3 text-sm"
                                disabled={!slot.date}
                                value={slot.time ?? ""}
                                onChange={(e) => handleSelectTime(index, e.target.value)}
                            >
                                <option value="">Select a time</option>
                                {timeSlots.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                );
            })}

            {slots.length < 3 && (
                <button
                    onClick={handleAddSlot}
                    className="flex items-center gap-2 text-blue-600 mt-2 text-sm"
                >
                    <span className="text-xl">＋</span> Add a time
                </button>
            )}
        </div>
    );
};

export default BuyerAppointment;
