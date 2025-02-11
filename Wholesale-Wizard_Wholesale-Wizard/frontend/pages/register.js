import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, productCategory }),
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
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
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
        <div>
          <label>Product Category:</label>
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Clothing">Clothing</option>
            <option value="Toys">Toys</option>
            <option value="Electronics">Electronics</option>
            <option value="Home Goods">Home Goods</option>
            <option value="Food">Food</option>
          </select>
        </div>
		<button type="submit">Register</button> 
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Link href="/login">Already have an account? Login here.</Link>
      </form>
      <br />
    </div>
  );
};

export default Register;

