import { Dialog, DialogContent, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import AssetsForm from '../../sections/dashboard/Forms/AssetsForm';

// ================================|| JWT - REGISTER ||================================ //

export default function AddAssetDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px', // More rounded corners
          border: '1px dashed #1976d2', // Dashed border with primary color
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          overflow: 'hidden', // Removes scrollbar by hiding overflow
        },
      }}
    >
      <DialogContent sx={{ p: 4, bgcolor: '#f9fafb' }}> {/* Light background for contrast */}
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4, // Consistent margin bottom
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Add Asset
          </Typography>
          <Typography
            sx={{
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 500,
              '&:hover': { color: 'primary.dark', transition: 'color 0.2s' }, // Hover effect
            }}
            onClick={onClose}
            variant="body1"
          >
            Cancel
          </Typography>
        </Stack>
        <AssetsForm />
      </DialogContent>
    </Dialog>
  );
}