import { NavLink } from 'react-router-dom';
import styles from './MenuNavegacion.module.css';

const MenuNavegacion = () => {
  return (
    <nav className={styles.menu}>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? `${styles.link} ${styles.activo}` : styles.link}
      >
        <span>🎯</span>
        Misiones
      </NavLink>
      
      <NavLink 
        to="/ranking" 
        className={({ isActive }) => isActive ? `${styles.link} ${styles.activo}` : styles.link}
      >
        <span>🏆</span>
        Ranking
      </NavLink>
    </nav>
  );
};

export default MenuNavegacion;