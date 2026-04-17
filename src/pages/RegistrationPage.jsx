import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LangContext } from '../context/LangContext';
import { wpApi } from '../services/api';
import Button from '../components/common/Button';

const RegistrationPage = () => {
  const { lang } = useContext(LangContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    lieu_de_travail: '',
    tel: '',
  });

  const t = {
    fr: {
      title: "S'inscrire à AOS-Emploi",
      subtitle: 'Rejoignez notre communauté de professionnels',
      name: 'Nom complet',
      email: 'Adresse email',
      location: 'Lieu de travail',
      phone: 'Téléphone',
      submit: 'S\'inscrire',
      submitting: 'Inscription en cours...',
      errors: {
        required: 'Ce champ est requis',
        invalidEmail: 'Adresse email invalide',
        invalidPhone: 'Numéro de téléphone invalide',
        emailNotVerified: 'Email non reconnu dans la liste des employés',
        alreadyRegistered: 'Cet email est déjà enregistré',
        unknown: 'Une erreur est survenue',
      },
      success: 'Inscription soumise avec succès!',
    },
    ar: {
      title: 'التسجيل في AOS-Emploi',
      subtitle: 'انضم إلى مجتمعنا من المحترفين',
      name: 'الاسم الكامل',
      email: 'عنوان البريد الإلكتروني',
      location: 'مكان العمل',
      phone: 'رقم الهاتف',
      submit: 'اشتراك',
      submitting: 'جاري التسجيل...',
      errors: {
        required: 'هذا الحقل مطلوب',
        invalidEmail: 'عنوان بريد إلكتروني غير صحيح',
        invalidPhone: 'رقم هاتف غير صحيح',
        emailNotVerified: 'البريد الإلكتروني غير معترف به',
        alreadyRegistered: 'تم تسجيل هذا البريد الإلكتروني بالفعل',
        unknown: 'حدث خطأ ما',
      },
      success: 'تم تقديم التسجيل بنجاح!',
    },
  };

  const strings = t[lang] || t.fr;

  const validateForm = () => {
    if (!formData.nom.trim()) {
      setError(strings.errors.required);
      return false;
    }
    if (!formData.email.trim()) {
      setError(strings.errors.required);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(strings.errors.invalidEmail);
      return false;
    }
    if (!formData.lieu_de_travail.trim()) {
      setError(strings.errors.required);
      return false;
    }
    if (!formData.tel.trim()) {
      setError(strings.errors.required);
      return false;
    }
    if (!/^\d{10,}$/.test(formData.tel.replace(/[^\d]/g, ''))) {
      setError(strings.errors.invalidPhone);
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
      const response = await wpApi.post('/aos/v1/register', formData);
      
      if (response.status === 201) {
        // Redirect to pending page
        navigate('/registration-pending', { 
          state: { email: formData.email } 
        });
      }
    } catch (err) {
      console.error('[v0] Registration error:', err);
      
      if (err.response?.status === 403) {
        setError(strings.errors.emailNotVerified);
      } else if (err.response?.status === 409) {
        setError(strings.errors.alreadyRegistered);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
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
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              {strings.name}
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="John Doe"
            />
          </div>

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
            <label htmlFor="lieu_de_travail" className="block text-sm font-medium text-gray-700 mb-1">
              {strings.location}
            </label>
            <input
              type="text"
              id="lieu_de_travail"
              name="lieu_de_travail"
              value={formData.lieu_de_travail}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Paris"
            />
          </div>

          <div>
            <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">
              {strings.phone}
            </label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="+33 1 23 45 67 89"
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
      </div>
    </div>
  );
};

export default RegistrationPage;
