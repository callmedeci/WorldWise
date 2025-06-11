import styles from './Sidebar.module.css';
import AppNav from './AppNav';
import Logo from './Logo';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />

      <Footer>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by Wolrdwise Inc.
        </p>
      </Footer>
    </div>
  );
}

export default Sidebar;
