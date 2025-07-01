import { WomenLaw, Language } from '../types';

export const womenLawsData: WomenLaw[] = [
  {
    id: 'pocso_act_2012',
    lawNameKey: 'lawNamePocso',
    fullForm: {
      [Language.EN]: "The Protection of Children from Sexual Offences (POCSO) Act, 2012",
      [Language.HI]: "लैंगिक अपराधों से बच्चों का संरक्षण (पॉक्सो) अधिनियम, 2012",
      [Language.TA]: "குழந்தைகள் பாலியல் குற்றங்களிலிருந்து பாதுகாப்பு (போக்சோ) சட்டம், 2012"
    },
    applicability: {
      [Language.EN]: "Applies to all children under the age of 18 years in India. It is gender-neutral, meaning it protects both boys and girls.",
      [Language.HI]: "भारत में 18 वर्ष से कम आयु के सभी बच्चों पर लागू होता है। यह लिंग-तटस्थ है, जिसका अर्थ है कि यह लड़कों और लड़कियों दोनों की सुरक्षा करता है।",
      [Language.TA]: "இந்தியாவில் 18 வயதுக்குட்பட்ட அனைத்து குழந்தைகளுக்கும் பொருந்தும். இது பாலின-நடுநிலையானது, அதாவது இது ஆண் மற்றும் பெண் இருவரையும் பாதுகாக்கிறது."
    },
    crimesCovered: {
      [Language.EN]: "Covers various forms of sexual abuse against children, including penetrative sexual assault, aggravated sexual assault, sexual harassment, and pornography.",
      [Language.HI]: "बच्चों के खिलाफ विभिन्न प्रकार के यौन शोषण को शामिल करता है, जिसमें प्रवेश संबंधी यौन हमला, गंभीर यौन हमला, यौन उत्पीड़न और पोर्नोग्राफी शामिल हैं।",
      [Language.TA]: "ஊடுருவும் பாலியல் தாக்குதல், மோசமான பாலியல் தாக்குதல், பாலியல் துன்புறுத்தல் மற்றும் ஆபாசப் படங்கள் உள்ளிட்ட குழந்தைகளுக்கு எதிரான பல்வேறு வகையான பாலியல் துஷ்பிரயோகங்களை உள்ளடக்கியது."
    },
    victimRights: {
      [Language.EN]: "Right to protection from discrimination, right to privacy, right to be informed, right to legal aid, right to compensation, child-friendly procedures during investigation and trial.",
      [Language.HI]: "भेदभाव से सुरक्षा का अधिकार, गोपनीयता का अधिकार, सूचित किए जाने का अधिकार, कानूनी सहायता का अधिकार, मुआवजे का अधिकार, जांच और मुकदमे के दौरान बाल-सुलभ प्रक्रियाएं।",
      [Language.TA]: "பாகுபாட்டிலிருந்து பாதுகாப்பு உரிமை, தனியுரிமைக்கான உரிமை, தகவல் அறியும் உரிமை, சட்ட உதவிக்கான உரிமை, இழப்பீடு பெறுவதற்கான உரிமை, விசாரணை மற்றும் விசாரணையின் போது குழந்தை நட்பு நடைமுறைகள்."
    },
    punishmentPenalty: {
      [Language.EN]: "Punishments range from rigorous imprisonment for a minimum of 3 years to life imprisonment or even death penalty in aggravated cases, along with fines.",
      [Language.HI]: "सजा कम से कम 3 साल के कठोर कारावास से लेकर आजीवन कारावास या गंभीर मामलों में मृत्युदंड तक हो सकती है, साथ ही जुर्माना भी लगाया जा सकता है।",
      [Language.TA]: "குறைந்தபட்சம் 3 ஆண்டுகள் கடுமையான சிறைத்தண்டனை முதல் ஆயுள் தண்டனை அல்லது மோசமான வழக்குகளில் மரண தண்டனை வரை தண்டனைகள் விதிக்கப்படும், அத்துடன் அபராதமும் விதிக்கப்படும்."
    },
    realLifeExample: {
      [Language.EN]: "If a person touches a child inappropriately or forces them to watch adult content, it is a crime under POCSO. The child's parents or guardians can report this to the police.",
      [Language.HI]: "यदि कोई व्यक्ति किसी बच्चे को अनुचित तरीके से छूता है या उसे वयस्क सामग्री देखने के लिए मजबूर करता है, तो यह पॉक्सो के तहत अपराध है। बच्चे के माता-पिता या अभिभावक इसकी सूचना पुलिस को दे सकते हैं।",
      [Language.TA]: "ஒரு நபர் ஒரு குழந்தையை முறையற்ற முறையில் தொட்டால் அல்லது வயது வந்தோருக்கான உள்ளடக்கத்தைப் பார்க்கும்படி கட்டாயப்படுத்தினால், அது போக்சோவின் கீழ் ஒரு குற்றமாகும். குழந்தையின் பெற்றோர் அல்லது பாதுகாவலர்கள் இது குறித்து காவல்துறையில் புகார் அளிக்கலாம்."
    }
  },
  {
    id: 'domestic_violence_act_2005',
    lawNameKey: 'lawNameDomesticViolence',
    fullForm: {
      [Language.EN]: "The Protection of Women from Domestic Violence Act, 2005",
      [Language.HI]: "घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम, 2005",
      [Language.TA]: "குடும்ப வன்முறையிலிருந்து பெண்களைப் பாதுகாக்கும் சட்டம், 2005"
    },
    applicability: {
      [Language.EN]: "Applies to women who are or have been in a domestic relationship (e.g., wife, live-in partner, sister, mother) with the abuser.",
      [Language.HI]: "उन महिलाओं पर लागू होता है जो दुर्व्यवहार करने वाले के साथ घरेलू संबंध में हैं या रही हैं (जैसे, पत्नी, लिव-इन पार्टनर, बहन, माँ)।",
      [Language.TA]: "துஷ்பிரயோகம் செய்பவருடன் குடும்ப உறவில் (எ.கா., மனைவி, லிவ்-இன் பார்ட்னர், சகோதரி, தாய்) இருக்கும் அல்லது இருந்த பெண்களுக்குப் பொருந்தும்."
    },
    crimesCovered: {
      [Language.EN]: "Covers physical abuse, sexual abuse, verbal and emotional abuse, and economic abuse by family members or partners.",
      [Language.HI]: "परिवार के सदस्यों या भागीदारों द्वारा शारीरिक शोषण, यौन शोषण, मौखिक और भावनात्मक शोषण और आर्थिक शोषण को शामिल करता है।",
      [Language.TA]: "குடும்ப உறுப்பினர்கள் அல்லது கூட்டாளிகளால் உடல் ரீதியான துஷ்பிரயோகம், பாலியல் துஷ்பிரயோகம், வாய்மொழி மற்றும் உணர்ச்சி ரீதியான துஷ்பிரயோகம் மற்றும் பொருளாதார துஷ்பிரயோகம் ஆகியவற்றை உள்ளடக்கியது."
    },
    victimRights: {
      [Language.EN]: "Right to reside in the shared household, right to protection orders, right to monetary relief, right to custody orders for children, right to compensation.",
      [Language.HI]: "साझा घर में रहने का अधिकार, सुरक्षा आदेशों का अधिकार, मौद्रिक राहत का अधिकार, बच्चों के लिए हिरासत आदेशों का अधिकार, मुआवजे का अधिकार।",
      [Language.TA]: "பகிரப்பட்ட வீட்டில் வசிக்கும் உரிமை, பாதுகாப்பு உத்தரவுகளுக்கான உரிமை, பண நிவாரணம் பெறுவதற்கான உரிமை, குழந்தைகளுக்கான காவல் உத்தரவுகளுக்கான உரிமை, இழப்பீடு பெறுவதற்கான உரிமை."
    },
    punishmentPenalty: {
      [Language.EN]: "While the DV Act primarily provides civil remedies (like protection orders, residence orders), breach of a protection order is a criminal offense punishable with imprisonment up to 1 year and/or fine.",
      [Language.HI]: "जबकि डीवी अधिनियम मुख्य रूप से नागरिक उपचार प्रदान करता है (जैसे सुरक्षा आदेश, निवास आदेश), सुरक्षा आदेश का उल्लंघन एक आपराधिक अपराध है जिसमें 1 वर्ष तक की कैद और/या जुर्माना हो सकता है।",
      [Language.TA]: "டி.வி சட்டம் முதன்மையாக சிவில் தீர்வுகளை (பாதுகாப்பு உத்தரவுகள், வசிப்பிட உத்தரவுகள் போன்றவை) வழங்குகிறது என்றாலும், பாதுகாப்பு உத்தரவை மீறுவது 1 ஆண்டு வரை சிறைத்தண்டனை மற்றும்/அல்லது அபராதத்துடன் கூடிய குற்றவியல் குற்றமாகும்."
    },
    realLifeExample: {
      [Language.EN]: "If a husband regularly hits his wife or prevents her from accessing money for household needs, she can seek help under this Act. She can get a court order to stop the abuse and ensure her safety.",
      [Language.HI]: "यदि कोई पति नियमित रूप से अपनी पत्नी को मारता है या उसे घरेलू जरूरतों के लिए पैसे तक पहुंचने से रोकता है, तो वह इस अधिनियम के तहत मदद मांग सकती है। वह दुर्व्यवहार को रोकने और अपनी सुरक्षा सुनिश्चित करने के लिए अदालत का आदेश प्राप्त कर सकती है।",
      [Language.TA]: "ஒரு கணவர் தனது மனைவியை தவறாமல் அடித்தால் அல்லது வீட்டுத் தேவைகளுக்கு பணம் கிடைக்காமல் தடுத்தால், அவர் இந்தச் சட்டத்தின் கீழ் உதவி চাইতেலாம். துஷ்பிரயோகத்தை நிறுத்தவும், தனது பாதுகாப்பை உறுதிப்படுத்தவும் அவர் நீதிமன்ற உத்தரவைப் பெறலாம்."
    }
  },
  // Add more laws here following the same structure
];
