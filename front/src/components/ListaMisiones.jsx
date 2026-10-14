import { useState, useEffect } from 'react';
import styles from './ListaMisiones.module.css'; 

const ListaMisiones = ({ invitadoId, onMisionCompletada }) => {
  const [misiones, setMisiones] = useState([]);
  const [cargandoMisiones, setCargandoMisiones] = useState(true);
  const [misionCargando, setMisionCargando] = useState(null);
  
  const [misionesCompletadas, setMisionesCompletadas] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/misiones').then(res => res.json()),
      fetch(`http://localhost:8080/api/capturas/completadas/${invitadoId}`).then(res => res.json())
    ])
    .then(([datosMisiones, datosCompletadas]) => {
      setMisiones(datosMisiones);
      setMisionesCompletadas(datosCompletadas);
      setCargandoMisiones(false);
    })
    .catch((err) => {
      console.error('Error al cargar datos:', err);
      setCargandoMisiones(false);
    });
  }, [invitadoId]);

  const manejarSubida = async (e, misionId, puntosMision) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setMisionCargando(misionId);

    try {
      const formData = new FormData();
      formData.append('file', archivo);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const dataCloudinary = await resCloudinary.json();

      const resBackend = await fetch('http://localhost:8080/api/capturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitadoId: invitadoId,
          misionId: misionId,
          urlMultimedia: dataCloudinary.secure_url
        })
      });

      if (!resBackend.ok) {
        const errorText = await resBackend.text();
        throw new Error(errorText);
      }

      setMisionesCompletadas([...misionesCompletadas, misionId]);
      onMisionCompletada(puntosMision);

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setMisionCargando(null);
      e.target.value = null; 
    }
  };

  if (cargandoMisiones) return <p style={{ textAlign: 'center' }}>Cargando misiones secretas... 🕵️‍♂️</p>;

  return (
    <div className={styles.contenedor}>
      {misiones.map((mision) => {
        const estaCargando = misionCargando === mision.id;
        const estaCompletada = misionesCompletadas.includes(mision.id);

        return (
          <div 
            key={mision.id} 
            className={`${styles.tarjeta} ${estaCompletada ? styles.tarjetaCompletada : ''}`}
          >
            <div className={styles.infoMision}>
              <span className={`${styles.descripcion} ${estaCompletada ? styles.descripcionCompletada : ''}`}>
                {mision.descripcion}
              </span>
            </div>

            <div className={styles.acciones}>
              <span className={styles.puntos}>{mision.puntos} pts</span>
              
              {/* Botón dinámico según el estado */}
              {estaCompletada ? (
                <span className={`${styles.botonLabel} ${styles.botonCompletado}`}>
                  ✅ Lista
                </span>
              ) : (
                <label className={`${styles.botonLabel} ${estaCargando ? styles.botonCargando : ''}`}>
                  {estaCargando ? 'Subiendo... ⏳' : '📷 Cumplir'}
                  <input 
                    type="file" 
                    accept="image/*, video/*" 
                    capture="environment" 
                    style={{ display: 'none' }} 
                    onChange={(e) => manejarSubida(e, mision.id, mision.puntos)}
                    disabled={estaCargando}
                  />
                </label>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListaMisiones;