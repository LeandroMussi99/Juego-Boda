import { useState } from 'react';

const Login = ({ alCompletarLogin }) => {
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarIngreso = async (e) => {
    e.preventDefault();
    
    if (nombre.trim() === '') return;

    setCargando(true);
    
    try {
      const respuesta = await fetch('http://localhost:8080/api/invitados/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim() })
      });
      
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>🕵️‍♂️ Juego de Espías</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Ingresa tu nombre para empezar a cumplir misiones.</p>
      
      <form onSubmit={manejarIngreso} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
        <input 
          type="text" 
          placeholder="Ej: Tía Marta" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
          required
        />
        <button 
          type="submit" 
          disabled={cargando}
          style={{ 
            padding: '12px', 
            borderRadius: '8px', 
            border: 'none', 
            backgroundColor: '#007BFF', 
            color: 'white', 
            fontSize: '16px', 
            fontWeight: 'bold',
            cursor: cargando ? 'not-allowed' : 'pointer'
          }}
        >
          {cargando ? 'Ingresando...' : 'Entrar al Juego'}
        </button>
      </form>
    </div>
  );
};

export default Login;