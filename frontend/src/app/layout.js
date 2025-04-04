
import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <title>Welcome to my project</title>
      </head>
      <body>
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to My Project</h1>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>© 2023 My Project</p>
      </footer>
    </div>
  </body>
  </html>
  );
}