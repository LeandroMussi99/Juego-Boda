import { useState, useEffect } from 'react';

const ListaMisiones = ({ invitadoId, onMisionCompletada }) => {
  const [misiones, setMisiones] = useState([]);
  const [cargandoMisiones, setCargandoMisiones] = useState(true);
  
  const [misionCargando, setMisionCargando] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/misiones')
      .then((res) => res.json())
      .then((datos) => {
        setMisiones(datos);
        setCargandoMisiones(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const manejarSubida = async (e, misionId, puntosMision) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setMisionCargando(misionId);

    try {
      // 1. Subir foto/video a Cloudinary
      const formData = new FormData();
      formData.append('file', archivo);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      // Usamos "auto" para que acepte tanto fotos como videos
      const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const dataCloudinary = await resCloudinary.json();
      const urlMultimedia = dataCloudinary.secure_url;

      // 2. Avisarle al Backend que se completó la misión
      const resBackend = await fetch('http://localhost:8080/api/capturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitadoId: invitadoId,
          misionId: misionId,
          urlMultimedia: urlMultimedia
        })
      });

      if (!resBackend.ok) {
        const errorText = await resBackend.text();
        throw new Error(errorText); 
      }

      // 3. Éxito: Sumar puntos en la pantalla
      alert('¡Misión completada! Puntos sumados. 🕵️‍♂️✨');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {misiones.map((mision) => (
        <div 
          key={mision.id} 
          style={{ 
            border: '1px solid #e0e0e0', padding: '15px', borderRadius: '12px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: 'white'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <span style={{ fontSize: '28px' }}>{mision.icono}</span>
            <span style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>{mision.descripcion}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span style={{ backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', color: '#555' }}>
              {mision.puntos} pts
            </span>
            
            {/* Botón camuflado que abre la cámara del celular */}
            <label style={{ 
              backgroundColor: misionCargando === mision.id ? '#ccc' : '#007BFF', 
              color: 'white', padding: '6px 12px', borderRadius: '8px', 
              fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
              display: 'inline-block'
            }}>
              {misionCargando === mision.id ? 'Subiendo... ⏳' : '📷 Cumplir'}
              <input 
                type="file" 
                accept="image/*, video/*" 
                capture="environment"
                style={{ display: 'none' }} 
                onChange={(e) => manejarSubida(e, mision.id, mision.puntos)}
                disabled={misionCargando === mision.id}
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaMisiones;