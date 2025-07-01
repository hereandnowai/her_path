
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import SectionTitle from '../../components/common/SectionTitle';
import { User } from '../../types';

const ProfileScreen: React.FC = () => {
  const { user, login: updateUserAuth } = useAuth(); // login also updates user in context
  const { translate } = useLanguage();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || 'https://picsum.photos/200'); // Placeholder
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setProfilePictureUrl(user.profilePictureUrl || 'https://picsum.photos/200');
    }
  }, [user]);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePictureUrl(URL.createObjectURL(file)); // Preview image
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Simulate update
    const updatedUserData: User = {
      ...user,
      name,
      email,
      profilePictureUrl: profilePicture ? profilePictureUrl : user.profilePictureUrl // Keep old if no new one
    };
    
    updateUserAuth(updatedUserData); // This will update context and localStorage
    setMessage('Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (!user) {
    return <p>{translate('loading')}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionTitle title={translate('profile')} />
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{message}</div>}
      
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0">
            <img 
              src={profilePictureUrl} 
              alt="Profile" 
              className="w-40 h-40 rounded-full object-cover shadow-lg"
            />
            {isEditing && (
              <div className="mt-4">
                <label htmlFor="profilePictureInput" className="cursor-pointer bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 text-sm block text-center">
                  Change Photo
                </label>
                <input 
                  type="file" 
                  id="profilePictureInput" 
                  accept="image/*" 
                  onChange={handlePictureChange} 
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="flex-grow">
            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">{translate('name')}</label>
                  <p className="text-xl text-gray-800">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">{translate('email')}</label>
                  <p className="text-xl text-gray-800">{user.email}</p>
                </div>
                {/* Add more profile fields here */}
                <Button onClick={() => setIsEditing(true)} className="mt-4">Edit Profile</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="name"
                  label={translate('name')}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  id="email"
                  label={translate('email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {/* Add more editable fields */}
                <div className="flex space-x-4 mt-6">
                  <Button type="submit">{translate('save')}</Button>
                  <Button type="button" variant="secondary" onClick={() => { setIsEditing(false); setMessage(''); }}>
                    {translate('cancel')}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Card>

      {/* Placeholder for Document Upload section removed
      <div className="mt-8">
        <Card title={translate('uploadDocument')}>
            <p className="text-gray-600 mb-4">Upload important documents like certificates, ID proofs, etc. (Max 5MB per file)</p>
            <Input 
              type="file" 
              id="documentUpload" 
              label="Select Document" 
              className="text-lg"
              // Add onChange handler to manage uploaded files
            />
            <Button className="mt-2">Upload</Button>
            <p className="mt-2 text-sm text-gray-500">Supported formats: PDF, JPG, PNG.</p>
        </Card>
      </div>
      */}
    </div>
  );
};

export default ProfileScreen;