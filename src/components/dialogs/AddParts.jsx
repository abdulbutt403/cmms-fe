import { Dialog, DialogContent, Typography } from '@mui/material';

import Stack from '@mui/material/Stack';
import PartsForm from '../../sections/dashboard/Forms/PartsForm';


// ================================|| JWT - REGISTER ||================================ //

export default function AddPartsDialog({open, onClose, initialValues, isEdit, onPartAdded}) {
  return (
 <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth    sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px', 
          border: '1px dashed #1976d2',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', 
        },
      }}>
      <DialogContent sx={{ p: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: 5, sm: 5 } }}>
            <Typography variant="h4">{isEdit ? 'Edit Part' : 'Add Parts'}</Typography>
            <Typography sx={{cursor: 'pointer',  textDecoration: 'none'}}  onClick={onClose} variant="body1" color="primary">
              Cancel
            </Typography>
          </Stack>
          <PartsForm onClose={onClose} initialValues={initialValues} isEdit={isEdit} onPartAdded={onPartAdded} />
      </DialogContent>
  </Dialog>

  );
}
