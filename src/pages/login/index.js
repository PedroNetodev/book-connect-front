import React, { useState } from 'react';
import './login.css';
import { useRouter } from 'next/router';
import { validateLoginCredentials } from '../../utils/loginValidation';

function Login({ Component, pageProps }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateLoginCredentials(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      router.push('/home');
    }
  };

  return (
    <div className="login-container">
      <img src='/images/login.png' alt="logo login" />
      <h5>Faca seu login no BookConnect</h5>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        <button type="submit" href="/pages/index" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
