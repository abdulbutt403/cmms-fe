import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard({ view, setView, createdData, completedData, labels }) {
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ p: 2, pb: 0 }}>
        <Grid>
          <Typography variant="h5">Work Orders (Created vs Completed)</Typography>
        </Grid>
        <Grid>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Button
              size="small"
              onClick={() => setView('monthly')}
              color={view === 'monthly' ? 'primary' : 'secondary'}
              variant={view === 'monthly' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setView('weekly')}
              color={view === 'weekly' ? 'primary' : 'secondary'}
              variant={view === 'weekly' ? 'outlined' : 'text'}
            >
              Week
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart view={view} createdData={createdData} completedData={completedData} labels={labels} />
        </Box>
      </MainCard>
    </>
  );
}
