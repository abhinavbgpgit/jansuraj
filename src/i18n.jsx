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

    // Join page: skill capsules (canonical value stays Hindi, English shown on toggle)
    "शिक्षण एवं प्रशिक्षण": "Teaching & training",
    "कृषि": "Agriculture",
    "पशुपालन": "Animal husbandry",
    "स्वास्थ्य सेवा": "Healthcare",
    "आईटी एवं तकनीक": "IT & technology",
    "कानूनी जानकारी": "Legal knowledge",
    "लेखा एवं वित्त": "Accounting & finance",
    "सामाजिक कार्य": "Social work",
    "जनसंपर्क": "Public relations",
    "भाषण एवं वक्तृत्व": "Public speaking",
    "लेखन": "Writing",
    "फोटोग्राफी": "Photography",
    "वीडियो निर्माण": "Video production",
    "सोशल मीडिया": "Social media",
    "कार्यक्रम प्रबंधन": "Event management",
    "युवा कार्य": "Youth work",
    "महिला एवं सामुदायिक कार्य": "Women & community work",
    "आपदा राहत": "Disaster relief",
    "अनुसंधान एवं डेटा": "Research & data",
    "व्यवसाय एवं उद्यमिता": "Business & entrepreneurship",
    "अन्य": "Other",

    // Join page: step 3 error messages
    "कृपया अपना जिला चुनें": "Please select your district",
    "कृपया ग्रामीण या शहरी क्षेत्र चुनें": "Please select rural or urban area",
    "कृपया ग्राम पंचायत / नगर निकाय चुनें": "Please select a gram panchayat / urban local body",
    "कृपया अपना वार्ड नंबर लिखें": "Please enter your ward number",

    // Join page: step 4 note
    "यह मोबाइल नंबर आपके लॉगिन के लिए उपयोग होगा।": "This mobile number will be used for your login.",
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

    // Join page: LocationPicker
    "Search district": "जिला खोजें",
    "Search gram panchayat...": "ग्राम पंचायत खोजें...",
    "Search urban local body...": "नगर निकाय खोजें...",
    "No results found": "कोई परिणाम नहीं मिला",
    "Please check the spelling and try again.": "नाम दोबारा जाँचकर लिखें।",
    "Type a name to search or choose from the list.": "नाम लिखकर खोजें या सूची में से चुनें।",

    // Join page: WardPicker
    "Enter number": "नंबर लिखें",
    "Enter your ward number": "अपना वार्ड नंबर लिखें",

    // Join page: step 1 (photo)
    "Profile Photo": "प्रोफ़ाइल फोटो",
    "(optional)": "(वैकल्पिक)",
    "Change Photo": "फोटो बदलें",
    "Upload Photo": "फ़ोटो अपलोड करें",
    "JPG, PNG or WEBP · Max 5MB": "JPG, PNG या WEBP · अधिकतम 5MB",
    "Please upload only JPG, PNG or WEBP images.": "सिर्फ़ JPG, PNG या WEBP इमेज अपलोड करें।",
    "Image size is {size} MB. Maximum 5 MB allowed.": "इमेज {size} MB की है। अधिकतम 5 MB स्वीकृत है।",
    "Failed to process image. Please try another one.": "इमेज प्रोसेस नहीं हो पाई। कृपया दूसरी इमेज आज़माएं।",

    // Join page: step 2 (profile)
    "Name": "नाम",
    "First name": "पहला नाम",
    "Middle name": "मध्य नाम",
    "Last name": "अंतिम नाम",
    "First name is required.": "पहला नाम भरना आवश्यक है।",
    "First name is required": "पहला नाम भरना आवश्यक है",
    "Please select education": "कृपया शिक्षा चुनें",
    "Please select profession": "कृपया पेशा चुनें",
    "Select education": "शिक्षा चुनें",
    "Below Matric": "मैट्रिक से कम",
    "Matric Pass": "मैट्रिक पास (10वीं)",
    "12th Pass": "12वीं पास",
    "Diploma / ITI": "डिप्लोमा / आईटीआई",
    "Graduate": "स्नातक",
    "Post Graduate / Masters": "स्नातकोत्तर / मास्टर्स",
    "Profession": "पेशा",
    "Select your profession": "अपना पेशा चुनें",
    "Farmer / Agriculture": "किसान / कृषि",
    "Agricultural Labourer": "कृषि मजदूर",
    "Student": "विद्यार्थी",
    "Teacher / Professor": "शिक्षक / प्रोफेसर",
    "Government Employee": "सरकारी कर्मचारी",
    "Private Employee": "निजी कर्मचारी",
    "Business / Entrepreneur": "व्यवसायी / उद्यमी",
    "Shopkeeper / Trader": "दुकानदार / व्यापारी",
    "Self Employed": "स्वरोजगार",
    "Doctor / Healthcare": "डॉक्टर / स्वास्थ्य सेवा",
    "Engineer / IT Professional": "इंजीनियर / आईटी",
    "Lawyer / Legal Professional": "वकील / कानूनी सेवा",
    "Construction / Skilled Worker": "निर्माण कार्य / कुशल कारीगर",
    "Driver / Transport": "चालक / परिवहन",
    "Homemaker": "गृहिणी / गृहस्थ",
    "Retired": "सेवानिवृत्त",
    "Daily Wage Worker": "दैनिक मजदूर",
    "Social Worker": "सामाजिक कार्यकर्ता",
    "Journalist / Media": "पत्रकारिता / मीडिया",
    "Your skills / expertise": "आपकी विशेषताएँ / कौशल",
    "Choose what you're good at. It increases your value and usefulness within Jansuraaj.":
      "आप जिस चीज़ में बढ़िया हैं, उसे चुनिए। इससे जनसुराज में आपकी महत्ता और आपकी उपयोगिता बढ़ेगी।",

    // Join page: step 3 (location)
    "Select your district first": "सबसे पहले अपना जिला चुनें",
    "The next area will be shown only after you select your district.":
      "अपना जिला चुनने के बाद ही आगे का क्षेत्र दिखाई देगा।",
    "Where do you live?": "आप कहाँ रहते हैं?",
    "Choose your area, then select the local body and ward.":
      "अपना क्षेत्र चुनें, फिर स्थानीय निकाय और वार्ड चुनें।",
    "Village / gram panchayat": "गाँव / ग्राम पंचायत",

    // Join page: navigation buttons
    "Back": "वापस",
    "Next": "अगला",
    "Joining...": "जुड़ रहे हैं...",

    // Profile page
    "Skills": "कौशल",
    "Area type": "क्षेत्र प्रकार",
    "Block": "प्रखंड",
    "Ward number": "वार्ड नंबर",
    "Cannot be changed": "बदला नहीं जा सकता",
    "Save changes": "बदलाव सहेजें",
    "Saving...": "सेव हो रहा है...",
    "e.g. 12": "जैसे 12",
    "Choose": "चुनें",
    "Address": "पता",
    "Verified member": "सत्यापित सदस्य",
    "Member since:": "सदस्य बने:",
    "Profile updated successfully.": "आपकी प्रोफ़ाइल अपडेट हो गई है।",
    "Edit profile": "प्रोफ़ाइल संपादित करें",
    "Report a public issue": "किसी सार्वजनिक समस्या की रिपोर्ट करें",
    "Issues in your area": "अपने क्षेत्र की समस्याएं",
    "View status of reported issues": "दर्ज हुई समस्याओं की स्थिति देखें",
    "Bihar": "बिहार",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "hi" || stored === "en" ? stored : "hi";
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