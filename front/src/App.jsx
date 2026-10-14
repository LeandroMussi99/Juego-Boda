import { useState } from 'react';
import Login from './pages/Login';
import ListaMisiones from './components/ListaMisiones';

function App() {
  const [invitado, setInvitado] = useState(() => {
    const invitadoGuardado = localStorage.getItem('invitadoBoda');
    return invitadoGuardado ? JSON.parse(invitadoGuardado) : null;
  });

  const manejarLogin = (datos) => {
    setInvitado(datos);
    localStorage.setItem('invitadoBoda', JSON.stringify(datos));
  };

  const cerrarSesion = () => {
    setInvitado(null);
    localStorage.removeItem('invitadoBoda');
  };

  // Función que le pasamos a la lista para sumar los puntos en tiempo real
  const sumarPuntos = (puntosGanados) => {
    const invitadoActualizado = { ...invitado, puntosTotales: invitado.puntosTotales + puntosGanados };
    setInvitado(invitadoActualizado);
    localStorage.setItem('invitadoBoda', JSON.stringify(invitadoActualizado));
  };

  return (
    <div>
      {!invitado ? (
        <Login alCompletarLogin={manejarLogin} />
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, color: '#333' }}>👤 {invitado.nombre}</h3>
              <p style={{ margin: 0, color: '#28a745', fontWeight: 'bold' }}>⭐ {invitado.puntosTotales} Puntos</p>
            </div>
            <button 
              onClick={cerrarSesion}
              style={{ background: 'none', border: '1px solid #dc3545', color: '#dc3545', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
            >
              Salir
            </button>
          </div>

          {/* Le pasamos el ID del invitado y la función para sumar puntos */}
          <ListaMisiones invitadoId={invitado.id} onMisionCompletada={sumarPuntos} />
          
        </div>
      )}
    </div>
  );
}

export default App;