-- Quick Reference Queries for Lab Tests

-- 1. View all tests by category with count
SELECT test_category, COUNT(*) as test_count
FROM lab_tests
GROUP BY test_category
ORDER BY test_category;

-- 2. View all tests with basic details
SELECT test_code, test_name, test_category, price, sample_required, result_type, turnaround_time
FROM lab_tests
ORDER BY test_category, test_code;

-- 3. View only Pathology tests
SELECT test_code, test_name, price, sample_type, turnaround_time
FROM lab_tests
WHERE test_category = 'PATHOLOGY'
ORDER BY test_name;

-- 4. View only Biochemistry tests
SELECT test_code, test_name, price, requires_fasting, sample_type
FROM lab_tests
WHERE test_category = 'BIOCHEMISTRY'
ORDER BY test_name;

-- 5. View only Hematology tests
SELECT test_code, test_name, price, normal_range, critical_low, critical_high
FROM lab_tests
WHERE test_category = 'HEMATOLOGY'
ORDER BY test_name;

-- 6. View only Microbiology tests
SELECT test_code, test_name, price, sample_type, turnaround_time, method
FROM lab_tests
WHERE test_category = 'MICROBIOLOGY'
ORDER BY test_name;

-- 7. View only Radiology tests (imaging)
SELECT test_code, test_name, price, result_type, turnaround_time
FROM lab_tests
WHERE test_category = 'RADIOLOGY'
ORDER BY price;

-- 8. View only Cath Lab procedures
SELECT test_code, test_name, price, result_type, preparation_instructions
FROM lab_tests
WHERE test_category = 'CATH_LAB'
ORDER BY price;

-- 9. View tests that require fasting
SELECT test_name, test_category, preparation_instructions
FROM lab_tests
WHERE requires_fasting = true
ORDER BY test_category, test_name;

-- 10. View tests that don't require samples (imaging/procedures)
SELECT test_name, test_category, result_type, price
FROM lab_tests
WHERE sample_required = false
ORDER BY test_category, price;

-- 11. View tests with critical values defined
SELECT test_name, test_category, normal_range, critical_low, critical_high
FROM lab_tests
WHERE critical_low IS NOT NULL OR critical_high IS NOT NULL
ORDER BY test_category;

-- 12. View most expensive tests
SELECT test_code, test_name, test_category, price
FROM lab_tests
ORDER BY price DESC
LIMIT 10;

-- 13. View quickest tests (lowest turnaround time)
SELECT test_name, test_category, turnaround_time, price
FROM lab_tests
WHERE turnaround_time IS NOT NULL
ORDER BY turnaround_time, price
LIMIT 10;

-- 14. View tests by result type
SELECT result_type, COUNT(*) as count, STRING_AGG(test_name, ', ' ORDER BY test_name) as tests
FROM lab_tests
GROUP BY result_type
ORDER BY result_type;

-- 15. Search for specific test
-- Replace 'CBC' with your search term
SELECT test_code, test_name, test_category, price, sample_type, turnaround_time
FROM lab_tests
WHERE test_name ILIKE '%CBC%' OR test_code ILIKE '%CBC%'
ORDER BY test_name;

-- 16. View complete details of a specific test
-- Replace 'LAB-20250207-0001' with desired test code
SELECT *
FROM lab_tests
WHERE test_code = 'LAB-20250207-0001';

-- 17. View tests by department
SELECT department, COUNT(*) as test_count, STRING_AGG(test_name, ', ' ORDER BY test_name) as tests
FROM lab_tests
WHERE department IS NOT NULL
GROUP BY department
ORDER BY department;

-- 18. View tests by sample type
SELECT sample_type, COUNT(*) as count
FROM lab_tests
WHERE sample_type IS NOT NULL
GROUP BY sample_type
ORDER BY count DESC;

-- 19. Price range by category
SELECT test_category, 
       MIN(price) as min_price, 
       MAX(price) as max_price, 
       AVG(price)::DECIMAL(10,2) as avg_price,
       COUNT(*) as test_count
FROM lab_tests
GROUP BY test_category
ORDER BY avg_price DESC;

-- 20. Complete summary statistics
SELECT 
    COUNT(*) as total_tests,
    COUNT(DISTINCT test_category) as total_categories,
    MIN(price) as lowest_price,
    MAX(price) as highest_price,
    AVG(price)::DECIMAL(10,2) as average_price,
    COUNT(CASE WHEN sample_required = true THEN 1 END) as tests_requiring_sample,
    COUNT(CASE WHEN sample_required = false THEN 1 END) as tests_not_requiring_sample,
    COUNT(CASE WHEN requires_fasting = true THEN 1 END) as tests_requiring_fasting
FROM lab_tests;
