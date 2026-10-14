import React, { useState } from 'react';

const SubidaCloudinary = () => {
  const [imagenUrl, setImagenUrl] = useState(null);
  const [cargando, setCargando] = useState(false);

  const subirImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setCargando(true);

    const formData = new FormData();
    formData.append('file', archivo);
    
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); 
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 

    try {
      const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      const datos = await respuesta.json();

      console.log('Respuesta completa de Cloudinary:', datos);
      setImagenUrl(datos.secure_url);
      
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Hubo un error al subir la foto');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Prueba de Subida para la Boda </h2>
      
      <input 
        type="file" 
        accept="image/*, video/*" 
        capture="environment" 
        onChange={subirImagen} 
        disabled={cargando}
        style={{ marginBottom: '20px' }}
      />

      {cargando && <p>Subiendo archivo a la nube... ⏳</p>}

      {imagenUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>¡Subida exitosa! El link público que vas a guardar en SQL es:</p>
          <a href={imagenUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', wordBreak: 'break-all', marginBottom: '15px' }}>
            {imagenUrl}
          </a>
          
          <img 
            src={imagenUrl} 
            alt="Prueba subida" 
            style={{ width: '100%', maxWidth: '350px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} 
          />
        </div>
      )}
    </div>
  );
};

export default SubidaCloudinary;