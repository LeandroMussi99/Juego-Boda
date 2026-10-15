import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Ranking from './pages/Ranking';
import AdminPanel from './pages/AdminPanel';
import ListaMisiones from './components/ListaMisiones';
import MenuNavegacion from './components/MenuNavegacion';

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

  const sumarPuntos = (puntosGanados) => {
    const invitadoActualizado = { ...invitado, puntosTotales: invitado.puntosTotales + puntosGanados };
    setInvitado(invitadoActualizado);
    localStorage.setItem('invitadoBoda', JSON.stringify(invitadoActualizado));
  };

  return (
    <BrowserRouter>
      {!invitado ? (
        <Login alCompletarLogin={manejarLogin} />
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', padding: '10px', paddingBottom: '80px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              
              {invitado.fotoPerfilUrl ? (
                <img 
                  src={invitado.fotoPerfilUrl} 
                  alt="Perfil" 
                  style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #007BFF' }} 
                />
              ) : (
                <span style={{ fontSize: '30px' }}>👤</span>
              )}

              <div>
                <h3 style={{ margin: 0, color: '#333' }}>{invitado.nombre}</h3>
                <p style={{ margin: 0, color: '#28a745', fontWeight: 'bold' }}>⭐ {invitado.puntosTotales} Puntos</p>
              </div>
            </div>
            
            <button 
              onClick={cerrarSesion}
              style={{ background: 'none', border: '1px solid #dc3545', color: '#dc3545', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
            >
              Salir
            </button>
          </div>

          <Routes>
            <Route path="/" element={<ListaMisiones invitadoId={invitado.id} onMisionCompletada={sumarPuntos} />} />
            <Route path="/ranking" element={<Ranking />} />
            {invitado.esAdmin && <Route path="/admin" element={<AdminPanel adminActual={invitado} />} />}
          </Routes>
          
          <MenuNavegacion esAdmin={invitado.esAdmin} />
          
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;