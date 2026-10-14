import { useState, useEffect } from 'react';
import styles from './Ranking.module.css';

const Ranking = () => {
  const [jugadores, setJugadores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/invitados/ranking')
      .then((res) => res.json())
      .then((datos) => {
        setJugadores(datos);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (cargando) return <p style={{ textAlign: 'center' }}>Calculando puntajes... 🧮</p>;

  const obtenerMedalla = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>🏆 Top Espías</h2>
      
      <div className={styles.contenedor}>
        {jugadores.map((jugador, index) => (
          <div 
            key={index} 
            className={`${styles.fila} ${index < 3 ? styles.filaTop3 : ''}`}
          >
            <div className={styles.posicionInfo}>
              <span className={styles.posicionNumero}>
                {obtenerMedalla(index)}
              </span>
              <span className={styles.nombre}>{jugador.nombre}</span>
            </div>
            
            <span className={styles.puntos}>
              {jugador.puntos} pts
            </span>
          </div>
        ))}
        
        {jugadores.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>Aún no hay espías en el podio. ¡Sé el primero!</p>
        )}
      </div>
    </div>
  );
};

export default Ranking;