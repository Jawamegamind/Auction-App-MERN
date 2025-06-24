import React from "react";
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Typography from '@mui/joy/Typography';
import { useNavigate } from "react-router-dom";

function AuctionCard({auction}: {auction: any}) {
    const navigate = useNavigate();

    const redirectToAuction = () => {
        navigate(`/auction/${auction._id}`);
    }

    return (
        <Card
      variant="outlined"
      sx={{
        width: 320,
        // to make the card resizable
        overflow: 'auto',
        resize: 'horizontal',
        margin: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      </Box>
      <CardContent>
        <Typography level="title-lg">{auction.title}</Typography>
      </CardContent>
        <CardContent>
            <Typography level="title-md">Description: {auction.description}</Typography>
        </CardContent>
        <CardContent>
            <Typography level="title-md">Starting Price: {auction.startingPrice}</Typography>
        </CardContent>
        <CardContent>
            <Typography level="title-md">Starting Time: {new Date(auction.startingTime).toLocaleString()}</Typography>
        </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" color="neutral" onClick={redirectToAuction}>
              View
          </Button>
      </CardActions>
    </Card>
    );
}

export default AuctionCard;