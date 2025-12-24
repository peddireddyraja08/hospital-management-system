import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { prescriptionAPI, pharmacyDispenseAPI } from '../../services/api';

export default function Dispensing(){
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPresc, setCurrentPresc] = useState(null);
  const [partialQty, setPartialQty] = useState('');
  const [snackbar, setSnackbar] = useState({ open:false, message:'', severity:'info' });

  useEffect(()=>{ load(); }, []);

  const load = async ()=>{
    setLoading(true);
    try{
      const res = await prescriptionAPI.getAll();
      setPrescriptions(res.data.data.filter(p=>p.status==='PENDING'));
    }catch(e){}
    setLoading(false);
  };

  const openFor = (presc, partial=false)=>{
    setCurrentPresc(presc);
    setPartialQty('');
    setOpenDialog(true);
  };

  const doDispense = async ()=>{
    try{
      if (!currentPresc) return;
      if (partialQty) {
        await pharmacyDispenseAPI.partialDispenseSimple(currentPresc.id, parseInt(partialQty,10),'pharmacist');
      } else {
        await pharmacyDispenseAPI.dispensePrescriptionSimple(currentPresc.id,'pharmacist');
      }
      setSnackbar({ open:true, message:'Dispensed successfully', severity:'success' });
      setOpenDialog(false);
      load();
    }catch(err){
      const msg = err?.response?.data?.message || err?.message || 'Failed to dispense';
      setSnackbar({ open:true, message:msg, severity:'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{mb:2}}>Dispensing</Typography>
      <Paper sx={{p:2}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Medication</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.length===0 ? (
              <TableRow><TableCell colSpan={4} align="center">No pending prescriptions</TableCell></TableRow>
            ) : (
              prescriptions.map(p=> (
                <TableRow key={p.id}>
                  <TableCell>{p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : 'N/A'}</TableCell>
                  <TableCell>{p.medication ? p.medication.medicationName : 'N/A'}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={()=>openFor(p,false)}>Full</Button>
                    <Button size="small" sx={{ml:1}} onClick={()=>openFor(p,true)}>Partial</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={()=>setOpenDialog(false)}>
        <DialogTitle>Dispense</DialogTitle>
        <DialogContent>
          <Typography>Prescription for: {currentPresc?.medication?.medicationName}</Typography>
          <TextField label="Partial Qty (leave empty for full)" value={partialQty} onChange={e=>setPartialQty(e.target.value)} sx={{mt:2}} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={doDispense}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={()=>setSnackbar({...snackbar, open:false})}>
        <Alert severity={snackbar.severity} onClose={()=>setSnackbar({...snackbar, open:false})}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
