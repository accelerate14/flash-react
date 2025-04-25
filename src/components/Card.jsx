// src/components/CardComponent.jsx
import { Card, CardContent, Typography } from '@mui/material';

const CardComponent = ({ title, content }) => {
  return (
    <Card sx={{ maxWidth: 300, margin: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
