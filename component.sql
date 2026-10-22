-- Create the table
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  completed boolean default false,
  created_at timestamptz default now()
);

-- Turn on Row Level Security
alter table items enable row level security;

-- Users can only see their own rows
create policy "Users can view own items"
  on items for select
  using (auth.uid() = user_id);

-- Users can only insert rows they own
create policy "Users can insert own items"
  on items for insert
  with check (auth.uid() = user_id);

-- Users can only update their own rows
create policy "Users can update own items"
  on items for update
  using (auth.uid() = user_id);

-- Users can only delete their own rows
create policy "Users can delete own items"
  on items for delete
  using (auth.uid() = user_id);