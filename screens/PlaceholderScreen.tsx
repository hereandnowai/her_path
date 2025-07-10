
import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/common/Card';
import { useLanguage } from '../contexts/LanguageContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { APP_ROUTES } from '../constants'; 
import { Link } from 'react-router-dom';
import { CustomEmergencyContact } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';


interface PlaceholderScreenProps {
  titleKey: string;
  defaultTitle: string;
  children?: React.ReactNode;
  showSearch?: boolean;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ titleKey, defaultTitle, children, showSearch = false }) => {
  const { translate } = useLanguage();

  return (
    <div>
      <SectionTitle title={translate(titleKey, defaultTitle)} />
      {showSearch && (
        <div className="mb-6 max-w-lg">
          <Input 
            type="search" 
            placeholder={translate('searchPlaceholder', 'Type to search...')} 
            aria-label={translate('search')}
          />
        </div>
      )}
      <Card>
        {children || (
          <div className="text-center py-12">
            <i className="fas fa-tools text-5xl text-gray-400 mb-4"></i>
            <p className="text-xl text-gray-600">
              {translate(titleKey, defaultTitle)} {translate('featureComingSoon', 'feature is under development.')}
            </p>
            <p className="text-gray-500 mt-2">
              {translate('checkBackLater', 'Please check back later for updates.')}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

const EmergencyContactsScreen: React.FC = () => {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [personalContacts, setPersonalContacts] = useState<CustomEmergencyContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phoneNumber: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const contactsRef = ref(db, `users/${user.id}/personalContacts`);
    
    const unsubscribe = onValue(contactsRef, (snapshot) => {
      const data = snapshot.val();
      const contactsArray: CustomEmergencyContact[] = [];
      if (data) {
        Object.keys(data).forEach(key => {
          contactsArray.push({ id: key, ...data[key] });
        });
      }
      setPersonalContacts(contactsArray);
      setIsLoading(false);
    }, (error) => {
        console.error("Firebase read failed: " + error.message);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddContact = async () => {
    if (newContact.name && newContact.phoneNumber && newContact.relationship && user) {
      try {
        const contactsRef = ref(db, `users/${user.id}/personalContacts`);
        const newContactRef = push(contactsRef);
        await set(newContactRef, {
            name: newContact.name,
            relationship: newContact.relationship,
            phoneNumber: newContact.phoneNumber,
        });

        setNewContact({ name: '', relationship: '', phoneNumber: '' });
        setIsAdding(false);
      } catch (error) {
          console.error("Error adding contact to Firebase: ", error);
          alert("Failed to add contact. Please try again.");
      }
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm(translate('confirmDeleteContact')) && user) {
      try {
          const contactRef = ref(db, `users/${user.id}/personalContacts/${id}`);
          await remove(contactRef);
      } catch(error) {
          console.error("Error deleting contact from Firebase: ", error);
          alert("Failed to delete contact. Please try again.");
      }
    }
  };

  const fixedContacts = [
    { name: 'Women Helpline', number: '1091', icon: 'fa-female' },
    { name: 'Police', number: '100', icon: 'fa-shield-alt' },
    { name: 'Ambulance', number: '102', icon: 'fa-ambulance' },
    { name: 'Child Helpline', number: '1098', icon: 'fa-child' },
  ];

  return (
    <PlaceholderScreen titleKey="emergencyContacts" defaultTitle="Emergency Support Contacts">
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{translate('personalContacts')}</h3>
          {isLoading && <p className="text-gray-500">Loading your contacts...</p>}

          {!isLoading && user && personalContacts.length > 0 && (
            <div className="space-y-4">
              {personalContacts.map(contact => (
                <Card key={contact.id} className="bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-semibold text-blue-700 flex items-center">
                        <i className="fas fa-user-circle mr-3 text-2xl"></i>{contact.name}
                      </h4>
                      <p className="text-gray-600 ml-9">{contact.relationship}</p>
                      <p className="text-2xl text-gray-800 font-bold mt-1 ml-9">{contact.phoneNumber}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <Button onClick={() => alert(`Calling ${contact.name}... (simulation)`)} size="md" className="bg-blue-500 hover:bg-blue-600">
                        <i className="fas fa-phone mr-2"></i> Call
                      </Button>
                      <Button onClick={() => handleDeleteContact(contact.id)} size="sm" variant="danger" className="!bg-transparent !text-red-500 hover:!bg-red-100">
                         <i className="fas fa-trash-alt mr-1"></i> {translate('deleteContact')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {!isLoading && user && personalContacts.length === 0 && !isAdding && (
            <p className="text-gray-500">{translate('noPersonalContacts')}</p>
          )}

          {!isLoading && !user && (
            <p className="text-gray-500">Please log in to manage personal contacts.</p>
          )}

          {isAdding ? (
            <Card className="mt-4 p-4 bg-gray-50">
              <div className="space-y-4">
                <Input label={translate('name')} value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} placeholder="e.g., Mother" />
                <Input label={translate('relationship')} value={newContact.relationship} onChange={e => setNewContact({ ...newContact, relationship: e.target.value })} placeholder="e.g., Family" />
                <Input label={translate('phoneNumber')} type="tel" value={newContact.phoneNumber} onChange={e => setNewContact({ ...newContact, phoneNumber: e.target.value })} placeholder="e.g., 9876543210" />
                <div className="flex gap-4">
                  <Button onClick={handleAddContact}>{translate('save')}</Button>
                  <Button variant="secondary" onClick={() => setIsAdding(false)}>{translate('cancel')}</Button>
                </div>
              </div>
            </Card>
          ) : (
            user && <Button onClick={() => setIsAdding(true)} className="mt-4" leftIcon={<i className="fas fa-plus"></i>}>
              {translate('addContact')}
            </Button>
          )}
        </div>

        <div>
           <h3 className="text-2xl font-semibold text-gray-800 mb-4">{translate('nationalHelplines')}</h3>
            <div className="space-y-4">
            {fixedContacts.map(contact => (
              <Card key={contact.name} className="bg-red-50 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-red-700 flex items-center">
                      <i className={`fas ${contact.icon} mr-3 text-2xl`}></i>{contact.name}
                    </h3>
                    <p className="text-2xl text-gray-800 font-bold mt-1 ml-9">{contact.number}</p>
                  </div>
                  <Button 
                    onClick={() => alert(`Calling ${contact.name} at ${contact.number} (simulation)`)}
                    size="lg"
                    variant="danger"
                  >
                    <i className="fas fa-phone mr-2"></i> Call
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PlaceholderScreen>
  );
}


const HelpScreen: React.FC = () => {
  const { translate } = useLanguage();

  const faqItems = [
    { qKey: 'faqQ1Title', aKeys: ['faqQ1Answer1', 'faqQ1Answer2', 'faqQ1Answer3'] },
    { qKey: 'faqQ2Title', aKeys: ['faqQ2Answer1', 'faqQ2Answer2', 'faqQ2Answer3', 'faqQ2Answer4'] },
    { qKey: 'faqQ3Title', aKeys: ['faqQ3Answer'] },
    { qKey: 'faqQ4Title', aKeys: ['faqQ4Answer'] },
    { qKey: 'faqQ5Title', aKeys: ['faqQ5AnswerSahana', 'faqQ5AnswerMentor', 'faqQ5AnswerAppAssistant', 'faqQ5AnswerGeneral'] },
    { qKey: 'faqQ6Title', aKeys: ['faqQ6Answer'] },
  ];

  return (
    <PlaceholderScreen titleKey="helpSupport" defaultTitle="Help & Support">
      <div className="space-y-6">
        <Card title={translate('howToUseHerPathTitle', "How to Use HerPath App")}>
          <p className="text-gray-600 mb-4">
            {translate('howToUseHerPathIntro', "Here's a simple guide to help you get started with the HerPath app and make the most of its features:")}
          </p>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <strong>{translate('navigationSidebarTitle', "Finding Your Way (Sidebar Menu)")}:</strong>
              <ul className="list-disc list-inside pl-5 mt-1 text-sm">
                <li>{translate('navigationSidebarDesc1', "The app has a main menu, usually on the left side. On smaller phone screens, you might need to tap a button with three lines (☰) to open it.")}</li>
                <li>{translate('navigationSidebarDesc2', "This menu has links to all parts of the app, like 'Home', 'Smart Pathway', 'Settings', and more.")}</li>
              </ul>
            </li>
            <li>
              <strong>{translate('homeScreenTitle', "Home Screen")}:</strong>
              <ul className="list-disc list-inside pl-5 mt-1 text-sm">
                <li>{translate('homeScreenDesc', `Your starting point is the '${translate('home')}' screen. It shows quick links to important features and helpful information.`)}</li>
              </ul>
            </li>
            <li>
              <strong>{translate('usingKeyFeaturesTitle', "Using Key Features")}:</strong>
              <ul className="list-disc list-inside pl-5 mt-1 text-sm space-y-1">
                <li><Link to={APP_ROUTES.SMART_PATHWAY} className="text-teal-600 hover:underline">{translate('smartPathway')}</Link>: {translate('featureSmartPathwayDesc', "Tap here to get personalized guidance for your education and career. Fill in the form and tap 'Generate Pathway'. You can then chat with an AI mentor about your plan.")}</li>
                <li><Link to={APP_ROUTES.WOMEN_AWARENESS} className="text-teal-600 hover:underline">{translate('womenAwareness')}</Link>: {translate('featureWomenAwarenessDesc', "Get awareness tips based on your age. Enter your age, tap 'Get Awareness Tips', and then you can chat with your Caring Partner, our caring AI guide, about health or personal matters.")}</li>
                <li><Link to={APP_ROUTES.WOMEN_LAW_AWARENESS} className="text-teal-600 hover:underline">{translate('womenLawAwarenessTitle')}</Link>: {translate('featureWomenLawDesc', "Learn about important laws for women in India. Tap to expand and read details in different languages.")}</li>
                <li><Link to={APP_ROUTES.LEARN_TO_USE_APPS} className="text-teal-600 hover:underline">{translate('learnToUseApps')}</Link>: {translate('featureLearnAppsDesc', "Discover helpful apps and websites. Type your goal (like 'learn cooking') and get suggestions. A chat assistant is also available to help you understand the suggestions.")}</li>
                <li><Link to={APP_ROUTES.BRAIN_QUIZZES} className="text-teal-600 hover:underline">{translate('brainQuizzes')}</Link>: {translate('featureBrainQuizzesDesc', "Challenge yourself with fun quizzes and test your knowledge on various topics.")}</li>
                <li><Link to={APP_ROUTES.EMERGENCY_CONTACTS} className="text-teal-600 hover:underline">{translate('emergencyContacts')}</Link>: {translate('featureEmergencyDesc', "Find important phone numbers like Police (100) or Women Helpline (1091).")}</li>
              </ul>
            </li>
            <li>
              <strong>{translate('settingsTitle', "Settings & Language")}:</strong>
              <ul className="list-disc list-inside pl-5 mt-1 text-sm">
                <li>{translate('settingsLanguageDesc', `You can change the app's language to English, Hindi, or Tamil. Go to '${translate('settings')}' from the menu, or find the language selector directly in the sidebar menu.`)}</li>
                <li>{translate('settingsNotificationsDesc', `In '${translate('settings')}', you can also manage notification preferences (coming soon).`)}</li>
              </ul>
            </li>
            <li>
              <strong>{translate('loggingOutTitle', "Logging Out")}:</strong>
              <ul className="list-disc list-inside pl-5 mt-1 text-sm">
                <li>{translate('loggingOutDesc', `To sign out of the app, find the '${translate('logout')}' button, usually at the bottom of the sidebar menu.`)}</li>
              </ul>
            </li>
            <li>
              <strong>{translate('generalTipTitle', "Explore and Ask")}:</strong>
              <ul className="list-disc list-inside pl-5 mt-1 text-sm">
                <li>{translate('generalTipDesc', "Don't be afraid to tap on different sections to see what they offer. If you need more help, you can always come back to this 'Help & Support' section or use the chat features within specific modules.")}</li>
              </ul>
            </li>
          </ol>
        </Card>

        <Card title={translate('faqTitle', "Frequently Asked Questions (FAQ)")}>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={index} className="group border-b border-gray-200 pb-2 last:border-b-0">
                <summary className="font-semibold text-teal-700 cursor-pointer list-none flex justify-between items-center group-open:text-teal-800 hover:text-teal-600 py-2">
                  <span>{translate(item.qKey)}</span>
                  <i className="fas fa-chevron-down group-open:rotate-180 transition-transform duration-300"></i>
                </summary>
                <div className="pl-4 pt-2 text-gray-700 text-sm space-y-1">
                  {item.aKeys.map((aKey, aIndex) => {
                    const answerText = translate(aKey);
                    // Check if answer is a list item by checking if it starts with a number and a dot.
                    if (/^\d+\.\s/.test(answerText)) {
                      return <p key={aIndex} className="ml-4">{answerText}</p>;
                    }
                    return <p key={aIndex}>{answerText}</p>;
                  })}
                </div>
              </details>
            ))}
          </div>
        </Card>
        
        <Card title={translate('contactSupportTitle', "Contact Support")}>
          <p className="text-gray-600 mb-2">{translate('contactSupportDesc', "If you need further assistance or have specific issues, please contact us:")}</p>
          <p className="text-gray-700">
            <i className="fas fa-envelope mr-2 text-teal-600"></i> 
            <a href={`mailto:${translate('contactSupportEmail')}`} className="hover:underline">{translate('contactSupportEmail')}</a>
          </p>
          <p className="text-gray-700">
            <i className="fas fa-phone mr-2 text-teal-600"></i>
            <a href={`tel:${translate('contactSupportPhone').replace(/-/g, '')}`} className="hover:underline">{translate('contactSupportPhone')}</a>
          </p>
        </Card>
      </div>
    </PlaceholderScreen>
  );
}

export { 
    EmergencyContactsScreen,
    HelpScreen
};
  