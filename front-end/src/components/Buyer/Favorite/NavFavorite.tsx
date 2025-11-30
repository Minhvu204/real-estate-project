import { InputLabel, MenuItem } from '@mui/material'
import React from 'react'
import { FaSortAmountUpAlt } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";
import Select from 'react-select'
const NavFavorite = () => {
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]
    return (
        <div className='w-full h-25 border border-amber-500 grid grid-cols-1 md:grid-cols-2'>
            <div className=''>
                <h1>3 Homes</h1>
                <p>1 for sale, 2 for rent</p>
            </div>
            <div className='flex gap-7 items-center justify-end mr-4'>
                <div>
                    <Select options={options} />
                </div>
                <div>
                    <Select options={options} />
                </div>
                <div>
                    <FaSortAmountUpAlt />
                    <FaSortAmountDown />
                </div>
            </div>
        </div>
    )
}

export default NavFavorite
