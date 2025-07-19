// Script para configurar la base de datos de Supabase
import { supabase } from './src/supabase/client.js';

async function setupDatabase() {
  console.log('🔧 Verificando la configuración de la base de datos...');

  // Verificar si la tabla tasks existe intentando hacer una consulta
  console.log('🔍 Verificando si la tabla "tasks" existe...');
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .limit(1);

  if (tasksError) {
    if (tasksError.code === '42P01') {
      console.log('❌ La tabla "tasks" no existe');
      showSQLInstructions();
    } else if (tasksError.code === 'PGRST116') {
      console.log('⚠️ La tabla "tasks" existe pero las políticas RLS pueden estar bloqueando el acceso');
      console.log('� Esto es normal. La tabla existe y funcionará cuando un usuario esté autenticado.');
    } else {
      console.error('❌ Error consultando tabla tasks:', tasksError);
      showSQLInstructions();
    }
  } else {
    console.log('✅ La tabla "tasks" existe y es accesible');
    console.log(`� Número de tareas encontradas: ${tasks ? tasks.length : 0}`);
  }
}

function showSQLInstructions() {
  console.log('💡 Por favor, ejecuta el siguiente SQL en tu panel de Supabase (SQL Editor):');
  console.log(`
═══════════════════════════════════════════════════════════════
-- COPIA Y PEGA ESTE SQL EN EL EDITOR SQL DE SUPABASE --

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

═══════════════════════════════════════════════════════════════
  `);
  console.log('📋 Pasos a seguir:');
  console.log('1. Ve a https://supabase.com/dashboard');
  console.log('2. Selecciona tu proyecto: zjfxthhswxojoivpqidq');
  console.log('3. Ve a SQL Editor en el menú lateral');
  console.log('4. Copia y pega el SQL de arriba');
  console.log('5. Haz clic en "Run" para ejecutar');
  console.log('6. Recarga tu aplicación web');
}

setupDatabase().catch(console.error);
