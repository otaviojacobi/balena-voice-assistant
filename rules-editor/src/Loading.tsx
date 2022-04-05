import { CircularProgress, Grid, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Grid
      container
      spacing={0}
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <CircularProgress size={40} />
      </Grid>
      <Grid item xs={3}>
        <Typography fontSize={26}>Loading</Typography>
      </Grid>
    </Grid>
  );
}
