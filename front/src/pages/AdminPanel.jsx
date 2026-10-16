import { useState, useEffect } from 'react';
import styles from './AdminPanel.module.css';

const AdminPanel = ({ adminActual }) => {
  const [vistaActiva, setVistaActiva] = useState('fotos'); 

  const [jugadores, setJugadores] = useState([]);
  const [capturas, setCapturas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const resJugadores = await fetch('http://localhost:8080/api/invitados');
      const dataJugadores = await resJugadores.json();
      setJugadores(dataJugadores);

      const resCapturas = await fetch('http://localhost:8080/api/capturas/pendientes');
      const dataCapturas = await resCapturas.json();
      setCapturas(dataCapturas);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  };

  const esVideo = (url) => {
    if (!url) return false;
    const extensionesVideo = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
    return extensionesVideo.some(ext => url.toLowerCase().includes(ext)) || url.toLowerCase().includes('/video/upload/');
  };

  // --- LÓGICA DE AGENTES ---
  const hacerAdmin = async (id, nombre) => {
    if (!window.confirm(`¿Ascender a ${nombre} como Administrador?`)) return;
    try {
      await fetch(`http://localhost:8080/api/invitados/${id}/admin`, { method: 'PUT' });
      setJugadores(jugadores.map(j => j.id === id ? { ...j, esAdmin: true } : j));
    } catch (error) { alert('Hubo un error al dar permisos.'); }
  };

  const quitarAdmin = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de REVOCAR los permisos de ${nombre}?`)) return;
    try {
      await fetch(`http://localhost:8080/api/invitados/${id}/quitar-admin`, { method: 'PUT' });
      setJugadores(jugadores.map(j => j.id === id ? { ...j, esAdmin: false } : j));
    } catch (error) { alert('Hubo un error al quitar permisos.'); }
  };

  // --- LÓGICA DE FOTOS ---
  const aprobarFoto = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/capturas/${id}/aprobar`, { method: 'PUT' });
      setCapturas(capturas.filter(c => c.id !== id));
    } catch (error) {
      alert('Error al aprobar la foto');
    }
  };

  const rechazarFoto = async (id, nombreInvitado) => {
    if (!window.confirm(`¿Seguro que querés RECHAZAR la foto de ${nombreInvitado}? Se le restarán los puntos por tramposo.`)) return;
    try {
      await fetch(`http://localhost:8080/api/capturas/${id}/rechazar`, { method: 'DELETE' });
      setCapturas(capturas.filter(c => c.id !== id));
    } catch (error) {
      alert('Error al rechazar la foto');
    }
  };

  if (cargando) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando base de datos... ⏳</p>;

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>⚙️ Centro de Control</h2>
      
      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${vistaActiva === 'fotos' ? styles.tabActivo : ''}`}
          onClick={() => setVistaActiva('fotos')}
        >
          📸 Fotos ({capturas.length})
        </button>
        <button 
          className={`${styles.tab} ${vistaActiva === 'agentes' ? styles.tabActivo : ''}`}
          onClick={() => setVistaActiva('agentes')}
        >
          🕵️ Agentes
        </button>
      </div>

      {/* VISTA 1: GESTIÓN DE AGENTES */}
      {vistaActiva === 'agentes' && (
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

                {jugador.id === 1 ? (
                  <span className={styles.badgeSuperAdmin}>Admin</span>
                ) : jugador.esAdmin ? (
                  <button onClick={() => quitarAdmin(jugador.id, jugador.nombre)} disabled={jugador.id === adminActual.id} className={jugador.id === adminActual.id ? styles.btnDeshabilitado : styles.btnQuitarAdmin}>
                    {jugador.id === adminActual.id ? 'Tú (Admin)' : 'Quitar ❌'}
                  </button>
                ) : (
                  <button onClick={() => hacerAdmin(jugador.id, jugador.nombre)} className={styles.btnHacerAdmin}>Hacer Admin</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 2: VALIDACIÓN DE FOTOS */}
      {vistaActiva === 'fotos' && (
        <div className={styles.gridFotos}>
          {capturas.length === 0 ? (
            <div className={styles.mensajeVacio}>
              <h3 style={{ margin: '0 0 10px 0' }}>¡Todo al día! 🎉</h3>
              <p style={{ margin: 0 }}>No hay misiones pendientes de revisión.</p>
            </div>
          ) : (
            capturas.map(captura => (
              <div key={captura.id} className={styles.tarjetaFoto}>
                {esVideo(captura.urlMultimedia) ? (
                  <video 
                    src={captura.urlMultimedia} 
                    className={styles.imagenCaptura} 
                    controls 
                    preload="metadata"
                  />
                ) : (
                  <img 
                    src={captura.urlMultimedia} 
                    alt="Misión a revisar" 
                    className={styles.imagenCaptura} 
                  />
                )}
                
                <div className={styles.infoCaptura}>
                  <p className={styles.misionTexto}>🎯 {captura.descripcionMision}</p>
                  <p className={styles.invitadoTexto}>
                    📸 Subida por: <strong>{captura.nombreInvitado}</strong>
                  </p>
                  
                  <div className={styles.accionesFoto}>
                    <button onClick={() => aprobarFoto(captura.id)} className={styles.btnAprobar}>
                      Aprobar ✅
                    </button>
                    <button onClick={() => rechazarFoto(captura.id, captura.nombreInvitado)} className={styles.btnRechazar}>
                      Rechazar ❌
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default AdminPanel;