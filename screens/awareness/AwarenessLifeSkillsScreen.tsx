
import React from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { APP_NAME } from '../../constants';

interface TopicItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  sections: Array<{
    title: string;
    type: 'list' | 'buttons' | 'mixed';
    items: Array<{
      text: string;
      icon?: string;
      disabled?: boolean;
      isLink?: boolean;
      note?: string;
    }>;
  }>;
}

const AwarenessLifeSkillsScreen: React.FC = () => {
  const { translate } = useLanguage();

  const topics: TopicItem[] = [
    {
      id: 'mentalWellbeing',
      title: 'Mental Well-being',
      icon: 'fa-brain',
      description: 'Tips for managing stress, building resilience, and seeking emotional support.',
      sections: [
        {
          title: 'Learn & Cope',
          type: 'list',
          items: [
            { text: 'Understanding Stress & Anxiety' },
            { text: 'Building Emotional Resilience' },
            { text: 'Coping with Depression & Burnout (Info)' },
            { text: 'Mindfulness & Relaxation Techniques' },
          ],
        },
        // "Coming Soon" Interactive Tools removed
        {
          title: 'Support',
          type: 'list',
          items: [
            { text: 'Find Peer Support Groups', isLink: true },
            { text: 'Professional Helplines Information', isLink: true },
            // "Connect on HerPath Community (Forum)" removed as it's "Coming Soon"
          ],
        },
      ],
    },
    {
      id: 'physicalHealth',
      title: 'Physical Health & Nutrition',
      icon: 'fa-running',
      description: 'Information on healthy eating, exercise, and hygiene.',
      sections: [
        {
          title: 'Nutrition Guidance',
          type: 'list',
          items: [
            { text: 'Balanced Diet for Women (All Ages)' },
            { text: 'Nutrition during Pregnancy & Postpartum' },
            { text: 'Healthy Recipes & Meal Ideas' },
          ],
        },
        {
          title: 'Fitness & Exercise',
          type: 'list',
          items: [
            { text: 'Exercise Routines for Home' },
            { text: 'Yoga & Flexibility' },
            { text: 'Staying Active with a Busy Schedule' },
          ],
        },
        // "Coming Soon" Interactive Tools removed
      ],
    },
    {
      id: 'menstrualHealth',
      title: 'Menstrual Health Management',
      icon: 'fa-calendar-alt',
      description: 'Understanding and managing menstruation with dignity.',
      sections: [
        {
          title: 'Understanding Your Cycle',
          type: 'list',
          items: [
            { text: 'The Menstrual Cycle Explained' },
            { text: 'Managing PMS & Cramps' },
            { text: 'Hygiene Best Practices' },
          ],
        },
        {
          title: 'Tools & Support',
          type: 'mixed',
          items: [
            // "Period Tracker" and "Symptom Log" removed as "Coming Soon"
            { text: 'Expert Q&A (Content)', isLink: true },
            // "Community Discussions" removed as "Coming Soon"
          ],
        },
      ],
    },
    {
      id: 'safetyRights',
      title: 'Safety & Rights (Good Touch/Bad Touch)',
      icon: 'fa-shield-alt',
      description: 'Guidance on personal safety, consent, and knowing your rights.',
      sections: [
        {
          title: 'Personal Safety',
          type: 'list',
          items: [
            { text: 'Understanding Consent' },
            { text: 'Recognizing Unsafe Situations' },
            { text: 'Good Touch vs. Bad Touch (Age-Appropriate)' },
            { text: 'Online Safety Tips' },
          ],
        },
        {
          title: 'Emergency & Legal',
          type: 'mixed',
          items: [
            // "SOS Feature / Quick Helplines" removed as "Coming Soon"
            { text: 'Know Your Legal Rights (Information)', isLink: true },
            { text: 'Self-Advocacy Guides', isLink: true },
          ],
        },
      ],
    },
    {
      id: 'parentingSkills',
      title: 'Basic Parenting Skills (if applicable)',
      icon: 'fa-baby',
      description: 'Resources for young mothers or those in caregiving roles.',
      sections: [
        {
          title: 'Child Health & Development',
          type: 'list',
          items: [
            { text: 'Newborn Care Basics' },
            { text: 'Child Nutrition & Growth Milestones' },
            { text: 'Positive Parenting Techniques' },
          ],
        },
        {
          title: 'Support for Caregivers',
          type: 'list',
          items: [
            { text: 'Self-Care for Mothers/Caregivers' },
            { text: 'Accessing Local Support Groups', isLink: true },
            { text: 'Expert Advice on Common Challenges', isLink: true },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <SectionTitle title={translate('awarenessLifeSkills')} subtitle="Explore resources for holistic well-being and empowerment." />
      <div className="space-y-6">
        {topics.map((topic) => (
          <Card key={topic.id} className="shadow-lg">
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center justify-between p-4 group-hover:bg-gray-50">
                <div className="flex items-center">
                  <i className={`fas ${topic.icon} text-2xl text-teal-600 mr-4 w-8 text-center`}></i>
                  <div>
                    <h3 className="text-xl font-semibold text-teal-700">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                </div>
                <i className="fas fa-chevron-down text-teal-600 group-open:rotate-180 transition-transform duration-300"></i>
              </summary>
              <div className="p-4 border-t border-gray-200 space-y-4">
                {topic.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">{section.title}</h4>
                    {section.type === 'list' && section.items.filter(item => !(item.note && item.note.toLowerCase().includes('coming soon'))).length > 0 && (
                      <ul className="list-none space-y-1 pl-2">
                        {section.items.filter(item => !(item.note && item.note.toLowerCase().includes('coming soon'))).map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 hover:text-teal-600">
                            {item.isLink ? (
                              <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center">
                                <i className={`fas ${item.icon || 'fa-external-link-alt'} fa-xs mr-2 text-teal-500`}></i>
                                {item.text}
                              </a>
                            ) : (
                              <span className="flex items-center">
                                <i className={`fas ${item.icon || 'fa-angle-right'} fa-xs mr-2 text-teal-500`}></i>
                                {item.text}
                               </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.type === 'buttons' && section.items.filter(item => !(item.disabled && item.note && item.note.toLowerCase().includes('coming soon'))).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {section.items.filter(item => !(item.disabled && item.note && item.note.toLowerCase().includes('coming soon'))).map((item, itemIndex) => (
                          <Button
                            key={itemIndex}
                            size="sm"
                            variant={'primary'}
                            leftIcon={item.icon ? <i className={`fas ${item.icon}`}></i> : null}
                          >
                            {item.text}
                          </Button>
                        ))}
                      </div>
                    )}
                     {section.type === 'mixed' && section.items.filter(item => !(item.disabled && item.note && item.note.toLowerCase().includes('coming soon'))).length > 0 && (
                       <div className="space-y-2">
                        {section.items.filter(item => !(item.disabled && item.note && item.note.toLowerCase().includes('coming soon'))).map((item, itemIndex) => (
                           <div key={itemIndex} className="text-sm text-gray-600 hover:text-teal-600">
                               <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center">
                                <i className={`fas ${item.icon || 'fa-external-link-alt'} fa-xs mr-2 text-teal-500`}></i>
                                {item.text}
                              </a>
                            </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </details>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AwarenessLifeSkillsScreen;