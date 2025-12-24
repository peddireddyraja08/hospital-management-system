import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, TextField } from '@mui/material';
import { pharmacyBillingAPI } from '../../services/api';

export default function Billing(){
  const [prescriptionId, setPrescriptionId] = useState('');
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const create = () => {
    setLoading(true);
    pharmacyBillingAPI.dispensePrescription(prescriptionId, 'frontend').then(res=>{
      setBill(res.data.data);
      setLoading(false);
    }).catch(err=>{setLoading(false); alert(err.response?.data?.message || 'Failed');});
  };

  return (
    <Box>
      <Typography variant="h5" sx={{mb:2}}>Pharmacy Billing / Dispense</Typography>
      <Paper sx={{p:2}}>
        <Box sx={{display:'flex',gap:2,mb:2}}>
          <TextField label="Prescription ID" value={prescriptionId} onChange={e=>setPrescriptionId(e.target.value)} />
          <Button variant="contained" onClick={create} disabled={loading}>{loading?'Processing...':'Dispense & Bill'}</Button>
        </Box>
        {bill && (
          <Box>
            <Typography>Bill ID: {bill.id}</Typography>
            <Typography>Total: {bill.totalAmount}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
