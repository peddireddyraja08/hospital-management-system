import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import { pharmacyAPI } from '../../services/api';

export default function MedicineList(){
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');

  useEffect(()=>{ load(); }, []);

  const load = () => { pharmacyAPI.listMedicines().then(r=>setList(r.data.data)).catch(()=>{}); };

  const filtered = list.filter(m => m.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Box>
      <Typography variant="h5" sx={{mb:2}}>Medicines</Typography>
      <Paper sx={{p:2}}>
        <Box sx={{display:'flex',gap:2,mb:2}}>
          <TextField size="small" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
          <Button variant="contained" onClick={load}>Refresh</Button>
        </Box>
        {filtered.map(m=> (
          <Box key={m.id} sx={{display:'flex',justifyContent:'space-between',py:1}}>
            <div>{m.name} ({m.strength})</div>
            <div>{m.stockQty}</div>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
