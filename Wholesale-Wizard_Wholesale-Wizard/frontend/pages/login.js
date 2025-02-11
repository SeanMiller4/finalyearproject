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
		    }else if (data.productCategory === 'Home Goods') {
				router.push('/home/homeDashboard');
			}else if (data.productCategory === 'Food') {
				router.push('/food/foodDashboard');
			}
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
