import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { checkFavoriteType, Favorite } from '@/types/FavoriteType';
import { addPropertyFavorite, checkPropertyFavorite, deletePropertyFavorite } from '@/services/buyerService';
type Props = {
    property_id: string;
};
const FavoriteIconProps = ({ property_id }: Props) => {
    const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
    useEffect(() => {
        const fetchIsFavorite = async () => {
            try {
                const data: checkFavoriteType = await checkPropertyFavorite(property_id);
                setIsFavorite(data.isFavorite);
            } catch (error) {
                console.log(error);
            }
        };
        fetchIsFavorite();
    }, [property_id]);
    const handleFavorite = async () => {
        try {
            if (isFavorite) {
                await deletePropertyFavorite(property_id);
                setIsFavorite(false);
            } else {
                await addPropertyFavorite(property_id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.log(error);
        }
    }
    if (isFavorite === null) {
        return null;
    }
    return (
        <div className='absolute z-10 top-1 right-2 text-white'>
            <button
                title='favorite'
                className='cursor-pointer'
                onClick={handleFavorite}
            >
                <FavoriteIcon
                    className={isFavorite ? 'text-red-500' : 'text-gray-300'}
                />
            </button>
        </div>
    )
}
export default FavoriteIconProps
