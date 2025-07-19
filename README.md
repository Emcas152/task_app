# 📋 Task Manager App

Una aplicación moderna de gestión de tareas construida con React, Vite, Supabase y Bootstrap 5.

## ✨ Características

- 🔐 **Autenticación completa** - Login y registro de usuarios
- ✅ **Gestión de tareas** - Crear, editar, completar y eliminar tareas
- 🎯 **Sistema de prioridades** - Alta, Media, Baja
- 📅 **Fechas límite** - Control de vencimientos
- 🔍 **Filtros avanzados** - Todas, Pendientes, Completadas, Vencidas
- 📱 **Diseño responsivo** - Funciona en móviles y escritorio
- 🎨 **UI moderna** - Bootstrap 5 con tema oscuro

## 🚀 Tecnologías

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **Estilos**: Bootstrap 5 + CSS personalizado
- **Iconos**: Bootstrap Icons
- **Autenticación**: Supabase Auth

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Emcas152/task_app.git
   cd task_app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Supabase**
   - Crea una cuenta en [Supabase](https://supabase.com)
   - Crea un nuevo proyecto
   - Actualiza las credenciales en `src/supabase/client.js`

4. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🗄️ Base de datos

La aplicación requiere una tabla `tasks` en Supabase. Ejecuta este SQL en el SQL Editor:

```sql
-- Crear la tabla de tareas
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

-- Activar Row Level Security
alter table tasks enable row level security;

-- Política para que cada usuario vea solo sus tareas
create policy "Usuarios acceden solo a sus tareas"
on tasks for all 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 📝 Uso

1. **Registro/Login** - Crea una cuenta o inicia sesión
2. **Crear tareas** - Usa el formulario para agregar nuevas tareas
3. **Gestionar tareas** - Marca como completadas, elimina o modifica
4. **Filtrar** - Usa el sidebar para filtrar por estado
5. **Prioridades** - Asigna prioridades con colores visuales

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👤 Autor

**Tu Nombre** - [Emcas152](https://github.com/Emcas152)

---

⭐ ¡Dale una estrella al repo si te gustó el proyecto!