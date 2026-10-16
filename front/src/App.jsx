import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Ranking from './pages/Ranking';
import AdminPanel from './pages/AdminPanel';
import ListaMisiones from './components/ListaMisiones';
import MenuNavegacion from './components/MenuNavegacion';
import './App.css';

function App() {
  const [invitado, setInvitado] = useState(() => {
    const invitadoGuardado = localStorage.getItem('invitadoBoda');
    return invitadoGuardado ? JSON.parse(invitadoGuardado) : null;
  });

  const navigate = useNavigate();

  const manejarLogin = (datos) => {
    setInvitado(datos);
    localStorage.setItem('invitadoBoda', JSON.stringify(datos));
  };

  const cerrarSesion = () => {
    localStorage.removeItem('invitadoBoda');
    setInvitado(null);
    navigate('/'); 
  };

  const sumarPuntos = (puntosGanados) => {
    const invitadoActualizado = { ...invitado, puntosTotales: invitado.puntosTotales + puntosGanados };
    setInvitado(invitadoActualizado);
    localStorage.setItem('invitadoBoda', JSON.stringify(invitadoActualizado));
  };

  if (!invitado) {
    return <Login alCompletarLogin={manejarLogin} />;
  }

  return (
    <div className="app-container">
      
      <header className="app-header">
        <div className="perfil-info">
          {invitado.fotoPerfilUrl ? (
            <img src={invitado.fotoPerfilUrl} alt="Perfil" className="avatar-header" />
          ) : (
            <span className="avatar-placeholder">👤</span>
          )}
          <div>
            <h3 className="nombre-header">{invitado.nombre}</h3>
            <p className="puntos-header">⭐ {invitado.puntosTotales} Puntos</p>
          </div>
        </div>
        
        <button onClick={cerrarSesion} className="btn-salir">Salir</button>
      </header>

      <Routes>
        <Route path="/" element={<ListaMisiones invitadoId={invitado.id} onMisionCompletada={sumarPuntos} />} />
        <Route path="/ranking" element={<Ranking />} />
        {invitado.esAdmin && <Route path="/admin" element={<AdminPanel adminActual={invitado} />} />}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      <MenuNavegacion esAdmin={invitado.esAdmin} />
      
    </div>
  );
}

export default App;