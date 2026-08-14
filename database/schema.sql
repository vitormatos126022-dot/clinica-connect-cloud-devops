CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS supplies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0)
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name VARCHAR(120) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO supplies (code, name, category, quantity) VALUES
  ('GLV-NIT-P', 'Luva nitrilica P', 'EPI', 240),
  ('MASK-N95', 'Mascara N95', 'EPI', 160),
  ('SER-10ML', 'Seringa 10ml', 'Procedimento', 320),
  ('GAUZE-STER', 'Gaze esteril', 'Curativo', 500)
ON CONFLICT (code) DO NOTHING;
