import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Retailer Wizard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        />
      </Head>

      <header>
        <nav className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container">
            <a href="/" className="navbar-brand">
              Retailer Wizard
            </a>
          </div>
        </nav>
      </header>

      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to Retailer Wizard!</h1>
          <p className="lead text-muted">
            Smart recommendations to elevate your agency.
          </p>
        </div>
      </section>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-sm mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">Register</h5>
                <p className="card-text">Create an account to get started.</p>
                <Link href="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card shadow-sm mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">Login</h5>
                <p className="card-text">Access your dashboard.</p>
                <Link href="/login" className="btn btn-secondary">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-muted py-4 bg-light">
        <div className="container text-center">
          <p className="mb-0">Retailer Wizard</p>
        </div>
      </footer>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
}
