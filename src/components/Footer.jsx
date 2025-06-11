import styles from './Footer.module.css';

function Footer({ children }) {
  return <footer className={styles.footer}>{children}</footer>;
}

export default Footer;
