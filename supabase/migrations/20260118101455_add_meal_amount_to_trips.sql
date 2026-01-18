/*
  # Add meal amount field to trips table

  1. Changes
    - Add `meal_amount` column to `trips` table
      - Type: decimal(10,2) for storing currency values
      - Nullable: true (only filled when has_meal is true)
      - Default: null
  
  2. Purpose
    - Store the actual reimbursement amount for meals (lunch or dinner)
    - Will be used in monthly reports to calculate total meal reimbursements
    - Will be displayed separately in reports and PDF exports
  
  3. Notes
    - The amount is stored in euros with 2 decimal places
    - This field should only have a value when has_meal is true
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'meal_amount'
  ) THEN
    ALTER TABLE trips ADD COLUMN meal_amount DECIMAL(10,2) DEFAULT NULL;
  END IF;
END $$;