/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "jansuraaj_language";

const translations = {
  en: {
    "समस्या दर्ज करें": "Report an issue",
    "अपने वार्ड की समस्याएँ देखें": "View issues in your ward",
    "Privacy Principle:": "Privacy principle:",
    "केवल आवश्यक जानकारी ली जाएगी।": "Only necessary information will be collected.",
    "बिहार के हर वार्ड की आवाज़": "The voice of every ward in Bihar",
    "समस्या,": "issue,",
    "अब पूरे बिहार के सामने।": "now visible across Bihar.",
    "सड़क, पानी, नाली, बिजली या किसी भी सार्वजनिक समस्या को दर्ज कीजिए। उसकी स्थिति देखिए, कार्रवाई की टाइमलाइन देखिए और जानिए कि समस्या कहाँ तक पहुँची।": "Report any public issue, from roads and water to drainage and electricity. Track its status and action timeline.",
    "समस्या दर्ज होने से समाधान तक पूरी स्थिति सार्वजनिक": "The full status is public from report to resolution",
    "सभी देखें →": "View all →",
    "कुल समस्याएँ": "Total issues",
    "18 पर कार्रवाई जारी": "18 under action",
    "9 का समाधान": "9 resolved",
    "दर्ज करें": "Report",
    "ट्रैक करें": "Track",
    "समाधान देखें": "See resolution",
    "जनता के सामने": "Publicly visible",
  },
  hi: {
    Dashboard: "डैशबोर्ड",
    Purpose: "उद्देश्य",
    Issues: "समस्याएं",
    Login: "लॉगिन",
    Logout: "लॉगआउट",
    Profile: "प्रोफ़ाइल",
    User: "उपयोगकर्ता",
    "User avatar": "उपयोगकर्ता का अवतार",
    "Admin Dashboard": "एडमिन डैशबोर्ड",
    "Member & issue management tools (placeholder).": "सदस्य और समस्या प्रबंधन उपकरण (डेमो)।",
    "Analytics & Charts": "विश्लेषण और चार्ट",
    "Member Management Table": "सदस्य प्रबंधन तालिका",
    Events: "कार्यक्रम",
    "Community Meeting - Patna": "सामुदायिक बैठक - पटना",
    "Volunteer Drive - Gaya": "स्वयंसेवक अभियान - गया",
    "Membership Card": "सदस्यता कार्ड",
    "Your digital membership card with QR code.": "क्यूआर कोड वाला आपका डिजिटल सदस्यता कार्ड।",
    News: "समाचार",
    "Featured: Launch of Jansuraaj Bihar": "प्रमुख: जनसुराज बिहार का शुभारंभ",
    "Trending: Road Repairs in Patna": "चर्चित: पटना में सड़क मरम्मत",
    "Select category": "श्रेणी चुनें",
    Road: "सड़क",
    Sanitation: "स्वच्छता",
    Health: "स्वास्थ्य",
    Electricity: "बिजली",
    Water: "पानी",
    Education: "शिक्षा",
    Other: "अन्य",
    "Transparency Dashboard": "पारदर्शिता डैशबोर्ड",
    "Funds, budgets and project progress (placeholder).": "फंड, बजट और परियोजना की प्रगति (डेमो)।",
    "Volunteer Dashboard": "स्वयंसेवक डैशबोर्ड",
    "Assigned tasks, events and certificates.": "दिए गए कार्य, कार्यक्रम और प्रमाणपत्र।",
    "Ward Dashboard": "वार्ड डैशबोर्ड",
    "Members, volunteers and issue analytics for a ward.": "वार्ड के सदस्यों, स्वयंसेवकों और समस्याओं का विश्लेषण।",
    "Total Members": "कुल सदस्य",
    Volunteers: "स्वयंसेवक",
    "Pending Issues": "लंबित समस्याएं",
    "A platform for public engagement and civic issues across Bihar.": "बिहार में जनभागीदारी और नागरिक समस्याओं के लिए एक मंच।",
    Explore: "अन्वेषण",
    Contact: "संपर्क",
    Like: "पसंद",
    View: "देखें",
    "Step {step} of {max}": "चरण {step} / {max}",
    "Loading...": "लोड हो रहा है...",
    Close: "बंद करें",
    "Report Another": "एक और समस्या दर्ज करें",
    "Go to Dashboard": "डैशबोर्ड पर जाएं",
    Cancel: "रद्द करें",
    Confirm: "पुष्टि करें",
    Home: "होम",
    Join: "जुड़ें",
    "Please wait...": "कृपया प्रतीक्षा करें...",
    "MLA Fund": "विधायक फंड",
    "MP Fund": "सांसद फंड",
    "Ward Fund": "वार्ड फंड",
    "Assigned Task: Community outreach": "दिया गया कार्य: सामुदायिक संपर्क",
    "Next Event: Orientation • 5 Sep": "अगला कार्यक्रम: परिचय सत्र • 5 सितंबर",
    "Sushila Devi": "सुशीला देवी",
    "Jansuraaj Bihar": "जनसुराज बिहार",
    "Login to Jansuraaj": "जनसुराज में लॉगिन करें",
    "Enter the phone number you used to join.": "वह फ़ोन नंबर दर्ज करें जिससे आपने जुड़ते समय पंजीकरण किया था।",
    "Phone number": "फ़ोन नंबर",
    "Logging in...": "लॉगिन हो रहा है...",
    "New to Jansuraaj?": "जनसुराज पर नए हैं?",
    "Join now": "अभी जुड़ें",
    "Profile not found.": "प्रोफ़ाइल नहीं मिली।",
    "Loading profile...": "प्रोफ़ाइल लोड हो रही है...",
    "Reported Issues": "दर्ज की गई समस्याएं",
    "Volunteer History": "स्वयंसेवक इतिहास",
    "All Issues": "सभी समस्याएं",
    "New Issue": "नई समस्या दर्ज करें",
    "Here you will see all issues in your area.": "यहां आपके क्षेत्र की सभी समस्याएं दिखाई देंगी।",
    "No issues have been reported in your area yet.": "अभी आपके क्षेत्र में कोई समस्या दर्ज नहीं है।",
    "Report your first issue": "पहली समस्या दर्ज करें",
    "Backend URL is not configured.": "बैकएंड URL कॉन्फ़िगर नहीं है।",
    "Failed to load problems.": "समस्याएं लोड नहीं हो सकीं।",
    "Failed to load profile.": "प्रोफ़ाइल लोड नहीं हो सकी।",
    "Please login first.": "कृपया पहले लॉगिन करें।",
    "Please enter a valid 10-digit phone number.": "कृपया 10 अंकों का सही फ़ोन नंबर दर्ज करें।",
    "Login failed": "लॉगिन विफल रहा",
    "Join Jansuraaj": "जनसुराज से जुड़ें",
    "Create your member profile and verify your phone for login.": "अपनी सदस्य प्रोफ़ाइल बनाएं और लॉगिन के लिए फ़ोन सत्यापित करें।",
    "Login to report an issue": "समस्या दर्ज करने के लिए लॉगिन करें",
    "Verify your phone": "अपना फ़ोन सत्यापित करें",
    "Report an Issue": "समस्या दर्ज करें",
    "Upload photos, add video links, and submit your issue.": "फ़ोटो अपलोड करें, वीडियो लिंक जोड़ें और समस्या दर्ज करें।",
    "Upload Images": "फ़ोटो अपलोड करें",
    Category: "श्रेणी",
    Description: "विवरण",
    "Describe the problem...": "समस्या का विवरण दें...",
    "Submitting...": "जमा किया जा रहा है...",
    "YouTube या Facebook वीडियो लिंक डालें": "YouTube or Facebook video link डालें",
    "Your issue has been submitted!": "आपकी समस्या दर्ज हो गई है!",
    "Your issue was recorded successfully.": "आपकी समस्या सफलतापूर्वक दर्ज कर ली गई है।",
    "You can report another issue or go to the dashboard.": "आप एक और समस्या दर्ज कर सकते हैं या डैशबोर्ड पर जा सकते हैं।",
    "Review your address": "अपना पता जाँचें",
    "Please review your information before continuing.": "कृपया आगे बढ़ने से पहले अपनी जानकारी जाँच लें।",
    District: "जिला",
    Area: "क्षेत्र",
    "Rural area": "ग्रामीण क्षेत्र",
    "Urban area": "शहरी क्षेत्र",
    "Gram panchayat": "ग्राम पंचायत",
    "Urban local body": "नगर निकाय",
    Ward: "वार्ड",
    "Is this information correct?": "क्या यह जानकारी सही है?",
    "Go back and edit": "वापस बदलें",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "hi" || stored === "en" ? stored : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, values = {}) => {
    let result = translations[language][key] || key;
    Object.entries(values).forEach(([name, value]) => {
      result = result.replace(`{${name}}`, value);
    });
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}