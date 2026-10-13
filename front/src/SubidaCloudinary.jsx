import React, { useState } from 'react';

const SubidaCloudinary = () => {
  const [imagenUrl, setImagenUrl] = useState(null);
  const [cargando, setCargando] = useState(false);

  const subirImagen = async (e) => {
    // Agarramos el archivo que eligió el usuario
    const archivo = e.target.files[0];
    if (!archivo) return;

    setCargando(true);

    // Preparamos los datos tal como los pide Cloudinary
    const formData = new FormData();
    formData.append('file', archivo);
    
    // ACÁ REEMPLAZÁ CON EL NOMBRE DEL PRESET QUE CREASTE (ej: 'boda_amigos_preset')
    formData.append('upload_preset', 'boda_amigos_preset'); 
    
    // ACÁ REEMPLAZÁ CON TU CLOUD NAME
    const cloudName = 'cghbx28l'; 

    try {
      // Hacemos el POST directo a la URL pública de Cloudinary
      const respuesta = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const datos = await respuesta.json();

      // ¡Acá está la magia! Cloudinary nos devuelve la URL segura
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
      <h2>Prueba de Subida para la Boda 📸</h2>
      
      {/* El atributo capture="environment" hace que en celulares se abra la cámara trasera por defecto */}
      <input 
        type="file" 
        accept="image/*, video/*" 
        capture="environment" 
        onChange={subirImagen} 
        disabled={cargando}
        style={{ marginBottom: '20px' }}
      />

      {cargando && <p>Subiendo archivo a la nube... ☁️⏳</p>}

      {/* Si ya tenemos la URL, la mostramos en pantalla */}
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