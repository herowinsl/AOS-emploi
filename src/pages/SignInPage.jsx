import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { wpApi, setAuthToken } from '../services/api';
import Button from '../components/common/Button';
import PageWrapper from '../components/layout/PageWrapper';

const SignInPage = () => {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    unique_key: '',
  });

  const t = {
    fr: {
      title: 'Se connecter',
      subtitle: 'Accédez à votre espace adhérent',
      email: 'Adresse email',
      accessKey: 'Clé d\'accès',
      submit: 'Se connecter',
      submitting: 'Connexion en cours...',
      dontHaveKey: 'Vous n\'avez pas reçu votre clé ?',
      register: 'S\'inscrire',
      errors: {
        required: 'Ce champ est requis',
        invalidEmail: 'Adresse email invalide',
        invalidCredentials: 'Email ou clé d\'accès invalide',
        unknown: 'Une erreur est survenue',
      },
    },
    ar: {
      title: 'تسجيل الدخول',
      subtitle: 'الوصول إلى مساحة العضو الخاصة بك',
      email: 'عنوان البريد الإلكتروني',
      accessKey: 'مفتاح الوصول',
      submit: 'تسجيل الدخول',
      submitting: 'جاري تسجيل الدخول...',
      dontHaveKey: 'لم تستقبل مفتاح الوصول؟',
      register: 'اشتراك',
      errors: {
        required: 'هذا الحقل مطلوب',
        invalidEmail: 'عنوان بريد إلكتروني غير صحيح',
        invalidCredentials: 'بريد إلكتروني أو مفتاح وصول غير صحيح',
        unknown: 'حدث خطأ ما',
      },
    },
  };

  const strings = t[lang] || t.fr;

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError(strings.errors.required);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(strings.errors.invalidEmail);
      return false;
    }
    if (!formData.unique_key.trim()) {
      setError(strings.errors.required);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await wpApi.post('/aos/v1/signin', {
        email: formData.email,
        unique_key: formData.unique_key,
      });
      
      if (response.status === 200 && response.data.token) {
        // Store auth token
        setAuthToken(response.data.token);
        
        // Redirect to member area
        navigate('/espace-adherent');
      }
    } catch (err) {
      console.error('[v0] Sign-in error:', err);
      
      if (err.response?.status === 401) {
        setError(strings.errors.invalidCredentials);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(strings.errors.unknown);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {strings.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {strings.subtitle}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {strings.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="unique_key" className="block text-sm font-medium text-gray-700 mb-1">
                {strings.accessKey}
              </label>
              <input
                type="text"
                id="unique_key"
                name="unique_key"
                value={formData.unique_key}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="AOS-XXXX-XXXX"
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? strings.submitting : strings.submit}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              {strings.dontHaveKey}
            </p>
            <button
              onClick={() => navigate('/register')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              {strings.register}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SignInPage;