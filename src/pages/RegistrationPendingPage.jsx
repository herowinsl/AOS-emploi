import { useContext, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LangContext } from '../context/LangContext';
import Button from '../components/common/Button';

const RegistrationPendingPage = () => {
  const { lang } = useContext(LangContext);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const t = {
    fr: {
      title: 'Inscription soumise',
      subtitle: 'Votre demande a été reçue',
      message: 'Votre inscription a été soumise avec succès. Veuillez attendre l\'approbation de l\'administrateur.',
      detail1: 'Vous avez reçu une confirmation à l\'adresse email fournie.',
      detail2: 'Une fois approuvée, vous recevrez votre clé d\'accès unique par email.',
      detail3: 'Vous pourrez alors vous connecter avec votre email et votre clé d\'accès.',
      goHome: 'Retour à l\'accueil',
      goSignIn: 'Aller à la connexion',
    },
    ar: {
      title: 'تم تقديم التسجيل',
      subtitle: 'تم استقبال طلبك',
      message: 'تم تقديم طلب التسجيل بنجاح. يرجى انتظار موافقة المسؤول.',
      detail1: 'تلقيت رسالة تأكيد على عنوان البريد الإلكتروني المقدم.',
      detail2: 'بمجرد الموافقة عليه، ستتلقى مفتاح الوصول الفريد الخاص بك عبر البريد الإلكتروني.',
      detail3: 'بعد ذلك يمكنك تسجيل الدخول ببريدك الإلكتروني ومفتاح الوصول الخاص بك.',
      goHome: 'العودة إلى الصفحة الرئيسية',
      goSignIn: 'انتقل إلى تسجيل الدخول',
    },
  };

  const strings = t[lang] || t.fr;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {strings.title}
        </h1>
        <p className="text-gray-600 mb-6">
          {strings.subtitle}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-gray-700 mb-3">
            {strings.message}
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{strings.detail1}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{strings.detail2}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{strings.detail3}</span>
            </li>
          </ul>
        </div>

        {email && (
          <div className="mb-6 p-3 bg-gray-100 rounded text-sm text-gray-700">
            <p className="text-xs text-gray-600 mb-1">Adresse email :</p>
            <p className="font-mono">{email}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full"
          >
            {strings.goHome}
          </Button>
          <Button
            onClick={() => navigate('/signin')}
            className="w-full"
          >
            {strings.goSignIn}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPendingPage;
