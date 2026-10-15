import { useState } from 'react';
import styles from './Login.module.css';

const Login = ({ alCompletarLogin }) => {
  const [nombre, setNombre] = useState('');
  const [numeroMesa, setNumeroMesa] = useState('');
  
  const [fotoUrl, setFotoUrl] = useState(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [cargando, setCargando] = useState(false);

  const manejarSubidaFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSubiendoFoto(true);
    try {
      const formData = new FormData();
      formData.append('file', archivo);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const dataCloudinary = await resCloudinary.json();
      setFotoUrl(dataCloudinary.secure_url); 
    } catch (error) {
      alert('Hubo un error al subir la foto. Podés intentar de nuevo o entrar sin foto.');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const manejarIngreso = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim() || !numeroMesa) return;

    setCargando(true);
    
    try {
      const respuesta = await fetch('http://localhost:8080/api/invitados/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: nombre.trim(),
          numeroMesa: parseInt(numeroMesa),
          fotoPerfilUrl: fotoUrl 
        })
      });
      
      if (!respuesta.ok) throw new Error('Error al conectar');

      const datosInvitado = await respuesta.json();
      alCompletarLogin(datosInvitado); 
    } catch (error) {
      console.error('Error al conectarse con el servidor:', error);
      alert('Hubo un error al intentar ingresar. Revisa que el servidor esté corriendo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.contenedor}>
      <form className={styles.tarjeta} onSubmit={manejarIngreso}>
        <h1 className={styles.titulo}>🕵️‍♂️ Juego de Espías</h1>
        <p className={styles.subtitulo}>Identificate para empezar tu misión.</p>

        <div className={styles.fotoContainer}>
          {fotoUrl ? (
            <img src={fotoUrl} alt="Tu selfie" className={styles.fotoPreview} />
          ) : (
            <div className={styles.avatarVacio}>👤</div>
          )}
          
          <label className={styles.botonFoto}>
            {subiendoFoto ? 'Cargando selfie... ⏳' : (fotoUrl ? 'Cambiar Selfie 📷' : 'Sacarse Selfie (Opcional) 📷')}
            <input 
              type="file" 
              accept="image/*" 
              capture="user" 
              style={{ display: 'none' }} 
              onChange={manejarSubidaFoto}
              disabled={subiendoFoto}
            />
          </label>
        </div>

        <input 
          type="text" 
          placeholder="Nombre o Apodo (Ej: Lean Mussi)" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={styles.input}
          required
        />
        <input 
          type="number" 
          placeholder="Número de Mesa (Ej: 5)" 
          value={numeroMesa}
          onChange={(e) => setNumeroMesa(e.target.value)}
          className={styles.input}
          min="1"
          required
        />

        <button 
          type="submit" 
          disabled={cargando || subiendoFoto}
          className={styles.boton}
        >
          {cargando ? 'Registrando agente...' : 'Entrar al Juego'}
        </button>
      </form>
    </div>
  );
};

export default Login;