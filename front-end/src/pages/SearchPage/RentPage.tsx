import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RentPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/search?type=For Rent', { replace: true });
    }, [navigate]);
    return null;
};

export default RentPage;