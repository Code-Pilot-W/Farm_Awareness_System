import React from 'react';
import { Box, Typography } from '@mui/material';
import { Image } from '@mui/icons-material';

const PlaceholderImage = ({ width = 200, height = 200, text = 'Image' }) => {
  return (
    <Box
      sx={{
        width,
        height,
        bgcolor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed',
        borderColor: 'grey.400'
      }}
    >
      <Image sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
      <Typography variant="body2" color="grey.500">
        {text}
      </Typography>
    </Box>
  );
};

export default PlaceholderImage;
