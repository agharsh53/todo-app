import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const BoardCard = ({ board, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/board/${board._id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px -4px rgb(0 0 0 / 0.1)',
          cursor: 'pointer'
        }
      }}
    >
      <Box
        onClick={handleCardClick}
        sx={{ flexGrow: 1 }}
      >
        <CardContent>
          <Box
            sx={{
              backgroundColor: board.color || '#6366f1',
              height: '4px',
              borderRadius: '2px',
              mb: 2
            }}
          />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {board.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {board.description || 'No description'}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="View Board"
              size="small"
              icon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: `${board.color}20`,
                color: board.color,
                fontWeight: 500
              }}
            />
          </Box>
        </CardContent>
      </Box>
      <CardActions sx={{ justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb' }}>
        <IconButton 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(board);
          }}
          sx={{ color: '#6b7280' }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(board._id);
          }}
          sx={{ color: '#ef4444' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default BoardCard;