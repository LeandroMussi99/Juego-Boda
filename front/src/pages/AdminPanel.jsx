import { useState, useEffect } from 'react';
import styles from './AdminPanel.module.css';

const AdminPanel = ({ adminActual }) => {
  const [jugadores, setJugadores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/invitados')
      .then(res => res.json())
      .then(data => {
        setJugadores(data);
        setCargando(false);
      })
      .catch(err => console.error("Error al cargar jugadores:", err));
  }, []);

  const hacerAdmin = async (id, nombre) => {
    if (!window.confirm(`¿Ascender a ${nombre} como Administrador?`)) return;

    try {
      const res = await fetch(`http://localhost:8080/api/invitados/${id}/admin`, { method: 'PUT' });
      if (!res.ok) throw new Error('Error al actualizar');

      setJugadores(jugadores.map(jugador => 
        jugador.id === id ? { ...jugador, esAdmin: true } : jugador
      ));
    } catch (error) {
      alert('Hubo un error al dar permisos.');
    }
  };

  const quitarAdmin = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de REVOCAR los permisos de ${nombre}?`)) return;

    try {
      const res = await fetch(`http://localhost:8080/api/invitados/${id}/quitar-admin`, { method: 'PUT' });
      if (!res.ok) throw new Error('Error al actualizar');

      setJugadores(jugadores.map(jugador => 
        jugador.id === id ? { ...jugador, esAdmin: false } : jugador
      ));
    } catch (error) {
      alert('Hubo un error al quitar permisos. Quizás intentaste degradar al Super Admin.');
    }
  };

  if (cargando) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando base de datos... ⏳</p>;

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>⚙️ Centro de Control</h2>
      
      <div className={styles.tarjeta}>
        <h3 className={styles.subtitulo}>Gestión de Agentes</h3>
        
        <div className={styles.listaJugadores}>
          {jugadores.map((jugador) => (
            <div key={jugador.id} className={styles.filaJugador}>
              
              <div className={styles.infoPerfil}>
                {jugador.fotoPerfilUrl ? (
                  <img src={jugador.fotoPerfilUrl} alt={jugador.nombre} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarVacio}>👤</div>
                )}
                <div>
                  <p className={styles.textoNombre}>{jugador.nombre}</p>
                  <p className={styles.textoMesa}>Mesa {jugador.numeroMesa}</p>
                </div>
              </div>

              {/* LÓGICA DE ROLES */}
              {jugador.id === 1 ? (
                <span className={styles.badgeSuperAdmin}>Admin</span>
              ) : jugador.esAdmin ? (
                <button 
                  onClick={() => quitarAdmin(jugador.id, jugador.nombre)}
                  disabled={jugador.id === adminActual.id} 
                  className={jugador.id === adminActual.id ? styles.btnDeshabilitado : styles.btnQuitarAdmin}
                >
                  {jugador.id === adminActual.id ? 'Tú (Admin)' : 'Quitar Admin ❌'}
                </button>
              ) : (
                <button 
                  onClick={() => hacerAdmin(jugador.id, jugador.nombre)}
                  className={styles.btnHacerAdmin}
                >
                  Hacer Admin
                </button>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;