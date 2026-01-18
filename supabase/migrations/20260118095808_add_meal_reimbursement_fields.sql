/*
  # Add Meal Reimbursement Fields

  ## Overview
  Adds fields to the trips table to support meal reimbursements (lunch and dinner).
  This allows tracking of meal expenses separate from mileage reimbursement.

  ## Changes Made

  ### 1. trips table updates
  - Add `has_meal` (boolean, default false) - Whether this trip includes meal reimbursement
  - Add `meal_type` (text, nullable) - Type of meal: 'pranzo' (lunch) or 'cena' (dinner)

  ## Important Notes
  1. All meal fields are nullable/optional - trips may or may not have meal reimbursements
  2. Meal reimbursement is independent from mileage and toll reimbursements
  3. Backward compatible - existing trips without meal data continue to work
  4. When has_meal is true, meal_type must be specified (either 'pranzo' or 'cena')
*/

-- Add meal reimbursement fields to trips table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'has_meal'
  ) THEN
    ALTER TABLE trips ADD COLUMN has_meal boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'meal_type'
  ) THEN
    ALTER TABLE trips ADD COLUMN meal_type text;
  END IF;
END $$;