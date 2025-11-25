import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/search', { replace: true });
    }, [navigate]);
    return null;
};

export default BuyPage;