import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching tasks:', error);
        setError('Error al cargar las tareas: ' + error.message);
        setTasks([]);
      } else {
        setTasks(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Error inesperado al cargar las tareas');
      setTasks([]);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!dueDate) {
      setError('La fecha límite es obligatoria');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Creating task with data:', {
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate,
        priority,
        user_id: user.id,
        completed: false
      });

      const { data, error } = await supabase.from('tasks').insert({
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate,
        priority,
        user_id: user.id,
        completed: false
      }).select();

      if (error) {
        console.error('Supabase error:', error);
        setError('Error al crear la tarea: ' + error.message);
      } else {
        console.log('Task created successfully:', data);
        setSuccess('Tarea creada exitosamente');
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('medium');
        fetchTasks();
        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Unexpected error creating task:', err);
      setError('Error inesperado al crear la tarea');
    }
    setLoading(false);
  };

  const handleToggleComplete = async (task) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', task.id);
    
    if (!error) fetchTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (!error) fetchTasks();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'overdue':
        return tasks.filter(task => !task.completed && new Date(task.due_date) < new Date());
      default:
        return tasks;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-vh-100 bg-dark">
      {/* Navbar */}
      <nav className="navbar navbar-custom navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-check-circle-fill me-2"></i>
            Task Manager
          </a>
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle text-white" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-2"></i>
                {user.email}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2">
            <div className="card task-container sidebar-container">
              <div className="card-header task-header">
                <h6 className="mb-0">
                  <i className="bi bi-funnel me-2"></i>
                  Filtros
                </h6>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button 
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-light'} btn-sm text-white`}
                    onClick={() => setFilter('all')}
                  >
                    <i className="bi bi-list-ul me-2"></i>
                    Todas ({tasks.length})
                  </button>
                  <button 
                    className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-light'} btn-sm text-white`}
                    onClick={() => setFilter('pending')}
                  >
                    <i className="bi bi-clock me-2"></i>
                    Pendientes ({tasks.filter(t => !t.completed).length})
                  </button>
                  <button 
                    className={`btn ${filter === 'completed' ? 'btn-success' : 'btn-outline-light'} btn-sm text-white`}
                    onClick={() => setFilter('completed')}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Completadas ({tasks.filter(t => t.completed).length})
                  </button>
                  <button 
                    className={`btn ${filter === 'overdue' ? 'btn-danger' : 'btn-outline-light'} btn-sm text-white`}
                    onClick={() => setFilter('overdue')}
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Vencidas ({tasks.filter(t => !t.completed && isOverdue(t.due_date)).length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10">
            {/* Task Creation Form */}
            <div className="card task-container mb-4">
              <div className="card-header task-header">
                <h5 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Nueva Tarea
                </h5>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {success}
                  </div>
                )}

                <form onSubmit={handleCreate}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Título</label>
                      <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="¿Qué necesitas hacer?"
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label fw-semibold">Fecha límite</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label fw-semibold">Prioridad</label>
                      <select
                        className="form-select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descripción opcional de la tarea"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-custom"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner me-2"></span>
                        Creando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-lg me-2"></i>
                        Crear Tarea
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Tasks List */}
            <div className="card task-container">
              <div className="card-header task-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-list-task me-2"></i>
                  Mis Tareas
                </h5>
                {loading && <span className="loading-spinner"></span>}
              </div>
              <div className="card-body">
                {getFilteredTasks().length === 0 ? (
                  <div className="text-center py-5 text-muted-light">
                    <i className="bi bi-inbox display-1"></i>
                    <p className="mt-3">No hay tareas que mostrar</p>
                  </div>
                ) : (
                  <div className="row">
                    {getFilteredTasks().map((task) => (
                      <div key={task.id} className="col-12 col-lg-6 mb-3">
                        <div className={`task-item p-3 ${task.completed ? 'completed' : ''} task-priority-${task.priority}`}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="flex-grow-1">
                              <h6 className={`task-title mb-1 ${task.completed ? 'text-decoration-line-through' : ''}`}>
                                {task.title}
                              </h6>
                              {task.description && (
                                <p className="text-muted-light small mb-2">{task.description}</p>
                              )}
                              <div className="d-flex flex-wrap gap-2 align-items-center">
                                <span className={`badge ${getPriorityBadgeClass(task.priority)} task-status-badge`}>
                                  {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                                </span>
                                <span className="text-muted-light small">
                                  <i className="bi bi-calendar me-1"></i>
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span>
                                {!task.completed && isOverdue(task.due_date) && (
                                  <span className="badge bg-danger">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    Vencida
                                  </span>
                                )}
                                {task.completed && (
                                  <span className="badge bg-success">
                                    <i className="bi bi-check-circle me-1"></i>
                                    Completada
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              className={`btn btn-sm ${task.completed ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              onClick={() => handleToggleComplete(task)}
                            >
                              <i className={`bi ${task.completed ? 'bi-arrow-counterclockwise' : 'bi-check'} me-1`}></i>
                              {task.completed ? 'Reabrir' : 'Completar'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(task.id)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}