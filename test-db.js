import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjfxthhswxojoivpqidq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZnh0aGhzd3hvam9pdnBxaWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTM2MzcsImV4cCI6MjA2ODE2OTYzN30.UCsXERDYM0qg6kY9WTxNpF4vF67CVufWOc2Hu65jaB0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTable() {
  console.log('🔍 Probando conexión a la tabla tasks...');
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .limit(1);

  if (error) {
    console.log('❌ Error:', error.code, '-', error.message);
    
    if (error.code === '42P01') {
      console.log('\n🔧 SOLUCIÓN: La tabla no existe. Crea la tabla ejecutando este SQL en Supabase:');
      console.log(`
-- Copia y pega esto en SQL Editor de Supabase:
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

alter table tasks enable row level security;

create policy "Usuarios acceden solo a sus tareas"
on tasks for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);
      `);
    } else if (error.code === 'PGRST116') {
      console.log('✅ La tabla existe (RLS está funcionando correctamente)');
    }
  } else {
    console.log('✅ Tabla accesible, datos:', data);
  }
}

testTable();
