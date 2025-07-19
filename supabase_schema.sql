-- Tabla de tareas
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  due_date date,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  completed boolean default false,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Función para actualizar updated_at automáticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger para actualizar updated_at
create trigger update_tasks_updated_at
  before update on tasks
  for each row
  execute procedure update_updated_at_column();

-- Activar RLS
alter table tasks enable row level security;

-- Política para que cada usuario vea solo sus tareas
create policy "Usuarios acceden solo a sus tareas"
on tasks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
