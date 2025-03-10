import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.productCategory === 'Clothing') {
          router.push('/clothing/clothingDashboard');
        } else if (data.productCategory === 'Toys') {
          router.push('/toy/toyDashboard');
        } else if (data.productCategory === 'Electronics') {
          router.push('/electronics/electronicsDashboard');
        } else if (data.productCategory === 'Home Goods') {
          router.push('/home/homeDashboard');
        } else if (data.productCategory === 'Food') {
          router.push('/food/foodDashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        />
      </Head>

      <header>
        <nav className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container">
            <a href="#" className="navbar-brand">
              Login Page
            </a>
          </div>
        </nav>
      </header>

      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="display-4 fw-bold">Login</h1>
          <p className="lead text-muted">
            Access your dashboard by logging in below.
          </p>
        </div>
      </section>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <form onSubmit={handleLogin}>
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
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-muted py-4 bg-light">
        <div className="container text-center">
          <p className="mb-0">Dashboard Login Page</p>
          <p>
            <a href="#">Back to top</a>
          </p>
        </div>
      </footer>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default Login;
