
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

const BuyerAppointment = (
    { property, onClose }: BuyerAppointmentProps
) => {

    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();


    const [slots, setSlots] = useState<
        { baseDate: Date; date: Date | null; time: string | null }[]
    >([
        { baseDate: new Date(), date: null, time: null }
    ]);


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
    const [selectedDate, setSelectedDate] = useState<Date | null>(addDays(new Date(), 1));


    const handlePrev = (index: number) => {
        const newSlots = [...slots];
        newSlots[index].baseDate = addDays(newSlots[index].baseDate, -3);
        newSlots[index].date = null;
        setSlots(newSlots);
    };
    const handleNext = (index: number) => {
        const newSlots = [...slots];
        newSlots[index].baseDate = addDays(newSlots[index].baseDate, +3);
        newSlots[index].date = null;
        setSlots(newSlots);
    };


    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden p-4">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-center flex-1">
                    Request a tour
                </h2>

                <button className="p-2" onClick={onClose}>
                    <CloseOutlinedIcon />
                </button>
            </div>

            <hr className="my-4" />

            {/* IMAGE + INFO */}
            <div className="flex gap-4 mb-6">
                <img
                    src={property.images[0] || "/defaultHome.png"}
                    className="w-32 h-24 rounded-lg object-cover"
                />

                <div className="text-sm my-auto leading-tight">
                    <p className="font-semibold">{property.title.vi}</p>
                    <p>{property.address.vi}</p>
                    <p>
                        {property.area} | {property.floors} | {property.price}
                    </p>
                </div>
            </div>

            {/* TIP SECTION */}
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
                            <h4 className="font-bold  mb-6">
                                Select up to 3 times
                            </h4>
                        ) : (
                            <div className="flex justify-between items-center mb-6 px-1">
                                <span className="font-semibold text-gray-800 text-lg">
                                    Alternative time
                                </span>

                                <button
                                    onClick={() => {
                                        const s = [...slots];
                                        s.splice(index, 1);
                                        setSlots(s);
                                    }}
                                    className="text-blue-600 hover:text-red-600 text-sm"
                                >
                                    <DeleteOutlinedIcon />
                                </button>
                            </div>
                        )}
                        {/* DAY SELECTOR */}
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <ArrowBackIosNewOutlinedIcon
                                className="cursor-pointer"
                                onClick={() => {
                                    const updated = [...slots];
                                    updated[index].baseDate = addDays(updated[index].baseDate, -3);
                                    updated[index].date = null;
                                    setSlots(updated);
                                }}
                            />

                            <div className="grid grid-cols-3 gap-3 w-full max-w-xs text-center">
                                {days.map((d, dIndex) => (
                                    <div
                                        key={dIndex}
                                        className={`cursor-pointer border-2 rounded-xl py-3 text-sm
                                            ${slot.date?.toDateString() === d.toDateString()
                                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                                : "border-gray-300"
                                            }`}
                                        onClick={() => {
                                            const updated = [...slots];
                                            updated[index].date = d;
                                            updated[index].time = null;
                                            setSlots(updated);
                                        }}
                                    >
                                        {formatDate(d)}
                                    </div>
                                ))}
                            </div>

                            <ArrowForwardIosOutlinedIcon
                                className="cursor-pointer"
                                onClick={() => {
                                    const updated = [...slots];
                                    updated[index].baseDate = addDays(updated[index].baseDate, 3);
                                    updated[index].date = null;
                                    setSlots(updated);
                                }}
                            />
                        </div>

                        {/* TIME DROPDOWN */}
                        <div className="w-full max-w-xs mx-auto">
                            <select
                                className="w-full border rounded-lg p-3 text-sm"
                                disabled={!slot.date}
                                value={slot.time ?? ""}
                                onChange={(e) => {
                                    const updated = [...slots];
                                    updated[index].time = e.target.value;
                                    setSlots(updated);
                                }}
                            >
                                <option value="">Select a time</option>
                                {timeSlots.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>

                            {/* DELETE BUTTON */}
                            {index > 0 && (
                                <div className="flex justify-end mt-3">
                                    <button
                                        onClick={() => {
                                            const updated = [...slots];
                                            updated.splice(index, 1);
                                            setSlots(updated);
                                        }}
                                        className="text-blue-600 hover:text-red-600 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* ADD TIME */}
            {slots.length < 3 && (
                <button
                    onClick={() =>
                        setSlots([...slots, { baseDate: new Date(), date: null, time: null }])
                    }
                    className="flex items-center gap-2 text-blue-600 mt-2 text-sm"
                >
                    <span className="text-xl">＋</span> Add a time
                </button>
            )}
        </div>
    )
}
export default BuyerAppointment