import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('Clothing');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password, 
          productCategory: category  
        }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        setError('Registration failed.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        />
      </Head>

      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <strong>Retail Wizard</strong>
          </Link>
        </div>
      </nav>

      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="display-5 fw-bold">Please Register</h1>
          <p className="lead text-muted">
            Create a new account to access the dashboard.
          </p>
        </div>
      </section>

      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Product Category
                    </label>
                    <select
                      id="category"
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>Clothing</option>
                    </select>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-100">
                    Register
                  </button>
                </form>

                <div className="text-center mt-3">
                  <Link href="/login">Login Page</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-muted py-4 bg-light">
        <div className="container text-center">
          <p className="mb-0">&copy; 2017-2018</p>
        </div>
      </footer>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
}
