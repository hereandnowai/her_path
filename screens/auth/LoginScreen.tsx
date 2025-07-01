
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { APP_ROUTES } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import CreedLogo from '../../components/common/CreedLogo';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = ReactRouterDOM.useNavigate();
  const { login } = useAuth();
  const { translate } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Simulate login
    if (email === 'user@example.com' && password === 'password') {
      login({ id: '1', name: 'Demo User', email: 'user@example.com' });
      navigate(APP_ROUTES.HOME);
    } else {
      setError('Invalid email or password. (Hint: user@example.com / password)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
           <CreedLogo size={80} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-teal-700">{translate('login')}</h2>
        </div>
        {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            label={translate('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your.email@example.com"
          />
          <Input
            id="password"
            label={translate('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Your password"
          />
          <Button type="submit" fullWidth size="lg">
            {translate('login')}
          </Button>
        </form>
        <p className="mt-8 text-center text-gray-600 text-lg">
          {translate('dontHaveAccount')}{' '}
          <ReactRouterDOM.Link to={APP_ROUTES.REGISTER} className="font-semibold text-teal-600 hover:text-teal-700">
            {translate('register')}
          </ReactRouterDOM.Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;