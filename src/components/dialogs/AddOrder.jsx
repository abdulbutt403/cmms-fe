import { Dialog, DialogContent, Typography } from '@mui/material';

import Stack from '@mui/material/Stack';
import FirebaseRegister from 'sections/dashboard/Forms/WorkOrderForm';


// ================================|| JWT - REGISTER ||================================ //

export default function WorkOrderDialog({openAddModal, handleCloseAddModal}) {
  return (
 <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth    sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px', 
          border: '1px dashed #1976d2',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', 
        },
      }}>
      <DialogContent sx={{ p: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: 5, sm: 5 } }}>
            <Typography variant="h4">Work Order Information</Typography>
            <Typography sx={{cursor: 'pointer',  textDecoration: 'none'}}  onClick={handleCloseAddModal} variant="body1" color="primary">
              Cancel
            </Typography>
          </Stack>
          <FirebaseRegister closeModal={handleCloseAddModal} />
      </DialogContent>
  </Dialog>

  );
}
