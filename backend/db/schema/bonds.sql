create table if not exists public.sureties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);
create table if not exists public.bonds (
  id uuid primary key default gen_random_uuid(),
  bond_number text not null,
  surety_id uuid references public.sureties(id),
  project_name text,
  bond_amount numeric(14,2),
  bond_date date,
  created_at timestamptz default now()
);
