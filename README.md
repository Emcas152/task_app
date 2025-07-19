# Task Manager App (React + Supabase)

Mini aplicación tipo CRUD con autenticación usando Supabase como backend y React como frontend.

## Características

- Autenticación con email y contraseña usando Supabase Auth
- Gestión de tareas (CRUD) para cada usuario autenticado
- Cada tarea está asociada al `user_id` del usuario autenticado
- Indicador de si la tarea está vencida
- Implementado con React + Vite

## Instrucciones

1. Clona el repositorio o descomprime el zip
2. Ejecuta `npm install`
3. Renombra `supabase/client.js` con tus credenciales de Supabase
4. Ejecuta `npm run dev` para levantar el servidor local

## Supabase

Ejecuta el siguiente script SQL en tu proyecto Supabase para crear la tabla `tasks`.


```sql
-- Tabla de tareas
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  due_date date,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp default now()
);

-- Activar RLS
alter table tasks enable row level security;

-- Política para que cada usuario vea solo sus tareas
create policy "Usuarios acceden solo a sus tareas"
on tasks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

```