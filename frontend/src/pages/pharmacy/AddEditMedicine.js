import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, Button, Typography } from '@mui/material';
import { pharmacyAPI } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function AddEditMedicine(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({name:'', category:'', strength:'', unit:'', manufacturer:'', price:0, reorderLevel:0});

  useEffect(()=>{ if(id) pharmacyAPI.getMedicine(id).then(r=>setForm(r.data.data)).catch(()=>{}); }, [id]);

  const save = () => {
    if(id) pharmacyAPI.updateMedicine(id, form).then(()=>navigate('/pharmacy/medicines')).catch(()=>{});
    else pharmacyAPI.createMedicine(form).then(()=>navigate('/pharmacy/medicines')).catch(()=>{});
  };

  return (
    <Box>
      <Typography variant="h5" sx={{mb:2}}>{id? 'Edit' : 'Add'} Medicine</Typography>
      <Paper sx={{p:2}}>
        <Box sx={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2}}>
          <TextField label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <TextField label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
          <TextField label="Strength" value={form.strength} onChange={e=>setForm({...form,strength:e.target.value})} />
          <TextField label="Unit" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} />
          <TextField label="Manufacturer" value={form.manufacturer} onChange={e=>setForm({...form,manufacturer:e.target.value})} />
          <TextField label="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} />
          <TextField label="Reorder Level" type="number" value={form.reorderLevel} onChange={e=>setForm({...form,reorderLevel:parseInt(e.target.value)})} />
        </Box>
        <Box sx={{mt:2}}>
          <Button variant="contained" onClick={save}>Save</Button>
        </Box>
      </Paper>
    </Box>
  );
}
