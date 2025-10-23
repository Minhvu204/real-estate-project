import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import type { Property } from '@/types/Property';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';
import axios from 'axios';


const ITEMS_PER_PAGE = 4;
const HomeList = () => {
    const baseUrl = "http://localhost:3000"
    const [allHome, setAllHome] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        axios.get(`${baseUrl}/properties`)
            .then((res) => {
                setAllHome(res.data);
                setIsLoading(false);
            }).catch((err) => {
                console.log("Cannot fetch properties ", err);
                throw new Error("Cannot fetch");
            })
    }, [])
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentHomes = allHome.slice(startIndex, endIndex);
    if (isLoading === true) return <p>Loading..........</p>
    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-10 pr-35 ">List all home</h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 '>

                {currentHomes.map((h) => (
                    <Card key={h.id} sx={{ maxWidth: 400 }} className="shadow-md hover:shadow-lg transition">

                        <CardMedia
                            sx={{ height: 200 }}
                            image={h.imageUrls[0]}
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {h.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {h.address}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {h.price.toLocaleString()} VND
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' size="small">View Details</Button>
                        </CardActions>
                    </Card>



                ))}
            </div>
            <div className="flex justify-center my-6 pr-35">
                <Pagination
                    count={Math.ceil(allHome.length / ITEMS_PER_PAGE)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                />
            </div>
        </>
    )
}

export default HomeList