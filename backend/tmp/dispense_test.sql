DO $$
DECLARE
  med_id bigint;
  pat_id bigint;
  doc_id bigint;
  presc_id bigint;
  qty_needed integer := 5;
  remaining integer;
  unit_price numeric := 10.0;
  total_amount numeric := 0;
  batch_record RECORD;
BEGIN
  INSERT INTO medications (medication_code, medication_name, unit_price, stock_quantity, reorder_level, manufacturer, created_at)
  VALUES ('TEST-MED-001','TestMed',10.0,0,5,'TestPharma',now())
  ON CONFLICT (medication_code) DO NOTHING;
  SELECT id INTO med_id FROM medications WHERE medication_code='TEST-MED-001' LIMIT 1;
  IF NOT EXISTS (SELECT 1 FROM medication_inventory WHERE medication_id=med_id AND batch_number='BATCH-001') THEN
    INSERT INTO medication_inventory (medication_id,batch_number,quantity,manufacturing_date,expiry_date,purchase_date,purchase_price,supplier_name,created_at)
    VALUES (med_id,'BATCH-001',100,now()-interval '1 month',now()+interval '1 year',now()-interval '10 days',5.0,'TestSupplier',now());
  END IF;
  UPDATE medications SET stock_quantity = (SELECT COALESCE(SUM(quantity),0) FROM medication_inventory WHERE medication_id=med_id) WHERE id=med_id;
  INSERT INTO patients (patient_id, first_name, last_name, phone_number, created_at) VALUES ('TEST-PAT-001','Test','Patient','+1000000000',now()) ON CONFLICT (patient_id) DO NOTHING;
  SELECT id INTO pat_id FROM patients WHERE patient_id='TEST-PAT-001' LIMIT 1;
  INSERT INTO doctors (doctor_id, first_name, last_name, email, created_at) VALUES ('TEST-DOC-001','Doc','Tester','doc@test.local',now()) ON CONFLICT (doctor_id) DO NOTHING;
  SELECT id INTO doc_id FROM doctors WHERE doctor_id='TEST-DOC-001' LIMIT 1;
  INSERT INTO prescriptions (patient_id, doctor_id, medication_id, quantity, prescribed_date, status, created_at) VALUES (pat_id, doc_id, med_id, qty_needed, now(), 'PENDING', now()) RETURNING id INTO presc_id;
  remaining := qty_needed;
  FOR batch_record IN SELECT id, quantity FROM medication_inventory WHERE medication_id=med_id AND (expiry_date IS NULL OR expiry_date>now()) AND quantity>0 ORDER BY expiry_date NULLS LAST, id LOOP
    IF remaining <= 0 THEN
      EXIT;
    END IF;
    IF batch_record.quantity >= remaining THEN
      UPDATE medication_inventory SET quantity = quantity - remaining WHERE id = batch_record.id;
      total_amount := total_amount + (remaining * unit_price);
      remaining := 0;
    ELSE
      UPDATE medication_inventory SET quantity = 0 WHERE id = batch_record.id;
      total_amount := total_amount + (batch_record.quantity * unit_price);
      remaining := remaining - batch_record.quantity;
    END IF;
  END LOOP;
  IF remaining > 0 THEN
    RAISE EXCEPTION 'Insufficient stock to dispense: needed % remaining %', qty_needed, remaining;
  END IF;
  UPDATE medications SET stock_quantity = (SELECT COALESCE(SUM(quantity),0) FROM medication_inventory WHERE medication_id=med_id) WHERE id=med_id;
  UPDATE prescriptions SET status='DISPENSED', dispensed_date=now(), dispensed_by='psql-test', updated_at=now() WHERE id=presc_id;
  INSERT INTO pharmacy_bills (patient_id, prescription_id, total_amount, created_at) VALUES (pat_id, presc_id, total_amount, now()) RETURNING id INTO med_id;
  INSERT INTO pharmacy_bill_items (medicine_name, batch_no, quantity, unit_price, line_total, bill_id, created_at) VALUES ((SELECT medication_name FROM medications WHERE id=med_id), 'MIXED', qty_needed, unit_price, total_amount, med_id, now());
  RAISE NOTICE 'Dispense complete, bill id %', med_id;
END$$;
