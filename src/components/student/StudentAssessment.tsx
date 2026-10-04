import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Award, Compass, RefreshCw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  questionHi: string;
  category: 'practical' | 'tech' | 'creative' | 'people';
  options: {
    text: string;
    textHi: string;
    points: { practical?: number; tech?: number; creative?: number; people?: number };
  }[];
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'When you have free time, what kind of activity do you enjoy most?',
    questionHi: 'जब आपके पास खाली समय होता है, तब आपको क्या करना सबसे ज्यादा पसंद है?',
    category: 'practical',
    options: [
      { text: 'Opening up and fixing broken items or gadgets at home', textHi: 'घर के खराब बिजली या मशीनरी के सामान को खोलकर ठीक करना', points: { practical: 3, tech: 1 } },
      { text: 'Browsing tech apps, computer shortcuts or gaming settings', textHi: 'कंप्यूटर, इंटरनेट ऐप्स या डिजिटल ट्रिक्स सीखना', points: { tech: 3 } },
      { text: 'Drawing sketches, fashion styles, or making crafts', textHi: 'स्केचिंग, पेंटिंग या कपड़े/सजावट का रचनात्मक काम', points: { creative: 3 } },
      { text: 'Helping family, friends or caring for elders/sick people', textHi: 'दोस्तों या बुजुर्गों की मदद करना और लोगों से बातचीत', points: { people: 3 } }
    ]
  },
  {
    id: 2,
    question: 'What kind of work environment feels comfortable to you?',
    questionHi: 'आपको कैसा कार्यस्थल सबसे आरामदायक लगता है?',
    category: 'practical',
    options: [
      { text: 'A busy workshop, plant floor or construction site', textHi: 'वर्कशॉप, प्लांट या नई मशीनों से भरी कार्यशाला', points: { practical: 3 } },
      { text: 'An air-conditioned computer desk or control room', textHi: 'वातानुकूलित कंप्यूटर रूम या कंट्रोल सेंटर', points: { tech: 3 } },
      { text: 'A hospital ward, clinic, or community wellness center', textHi: 'अस्पताल वार्ड, क्लिनिक या वेलनेस सेंटर', points: { people: 3 } },
      { text: 'A design studio, boutique, or salon', textHi: 'डिजाइन स्टूडियो, फैशन बुटीक या ब्यूटी सैलून', points: { creative: 3 } }
    ]
  },
  {
    id: 3,
    question: 'How do you prefer to solve a difficult problem?',
    questionHi: 'किसी कठिन समस्या को सुलझाने के लिए आप क्या तरीका अपनाते हैं?',
    category: 'tech',
    options: [
      { text: 'Experiment with tools and practical trials until it works', textHi: 'हाथों से औजारों के जरिए खुद प्रयोग करके देखना', points: { practical: 3 } },
      { text: 'Search the internet, check technical manuals or codes', textHi: 'इंटरनेट पर सर्च करना, कोड या मैन्युअल पढ़ना', points: { tech: 3 } },
      { text: 'Think of an original, out-of-the-box creative idea', textHi: 'कोई नया, अनोखा और सुंदर रचनात्मक तरीका सोचना', points: { creative: 3 } },
      { text: 'Discuss it with knowledgeable friends or elders', textHi: 'जानकारों या साथियों से बातचीत करके समाधान निकालना', points: { people: 3 } }
    ]
  },
  {
    id: 4,
    question: 'Which of these school subjects or topics did you find easiest to understand?',
    questionHi: 'इनमें से कौन सा विषय आपको सबसे आसान और रोचक लगता था?',
    category: 'tech',
    options: [
      { text: 'Science, Physics, electricity or circuits', textHi: 'विज्ञान, बिजली, चुंबक और करंट के प्रयोग', points: { tech: 2, practical: 2 } },
      { text: 'Drawing, Arts, crafts or tailoring basics', textHi: 'ड्राइंग, चित्रकला, सिलाई या क्राफ्ट', points: { creative: 3 } },
      { text: 'Biology, human body, first aid or health', textHi: 'जीव विज्ञान, मानव शरीर व प्राथमिक चिकित्सा', points: { people: 3 } },
      { text: 'Maths, logic, or computer fundamentals', textHi: 'गणित, तर्क या कंप्यूटर की बुनियादी बातें', points: { tech: 3 } }
    ]
  },
  {
    id: 5,
    question: 'If you could learn one new skill this month, which would you pick?',
    questionHi: 'अगर आपको इस महीने कोई एक नया हुनर सीखना हो, तो क्या चुनेंगे?',
    category: 'practical',
    options: [
      { text: 'Solar rooftop installation or EV battery wiring', textHi: 'सोलर पैनल लगाना या इलेक्ट्रिक वाहन की बैटरी समझना', points: { practical: 3, tech: 2 } },
      { text: 'Piloting a high-tech camera drone for farms', textHi: 'खेतों के लिए आधुनिक कैमरा ड्रोन उड़ाना', points: { tech: 3 } },
      { text: 'Measuring patient blood pressure and emergency first aid', textHi: 'रक्तचाप नापना और अस्पताल में फर्स्ट-एड देना', points: { people: 3 } },
      { text: 'Operating an industrial sewing machine or makeup styling', textHi: 'इंडस्ट्रियल सिलाई या पेशेवर ब्राइडल मेकअप', points: { creative: 3 } }
    ]
  },
  {
    id: 6,
    question: 'How do you feel about working with heavy machinery or electronic instruments?',
    questionHi: 'भारी मशीनों या इलेक्ट्रॉनिक उपकरणों पर काम करने के बारे में आपकी क्या राय है?',
    category: 'practical',
    options: [
      { text: 'Excited! I love seeing machines cut and shape things', textHi: 'बहुत उत्साहित! मुझे मशीनों का संचालन बेहद पसंद है', points: { practical: 3 } },
      { text: 'I prefer computer screens and micro-circuits over heavy tools', textHi: 'मुझे भारी औजारों के बजाय कंप्यूटर स्क्रीन और सर्किट पसंद हैं', points: { tech: 3 } },
      { text: 'I prefer gentle, interpersonal work helping patients', textHi: 'मुझे इंसानों और मरीजों की देखरेख का काम ज्यादा पसंद है', points: { people: 3 } },
      { text: 'I prefer working on fine aesthetic designs and fabrics', textHi: 'मुझे सुंदर परिधान और सौंदर्य कला अधिक पसंद है', points: { creative: 3 } }
    ]
  },
  {
    id: 7,
    question: 'What gives you the highest satisfaction after finishing a task?',
    questionHi: 'कोई काम पूरा होने पर आपको सबसे ज्यादा खुशी किस बात से मिलती है?',
    category: 'people',
    options: [
      { text: 'Seeing a machine or vehicle run smoothly because I fixed it', textHi: 'मेरी ठीक की हुई मशीन या गाड़ी को चालू हालत में देखना', points: { practical: 3 } },
      { text: 'Seeing a digital system or Wi-Fi network work perfectly', textHi: 'कंप्यूटर या नेटवर्क को बिना रुकावट चलते देखना', points: { tech: 3 } },
      { text: 'Seeing a relieved smile on a patient or customer’s face', textHi: 'मरीज या ग्राहक के चेहरे पर संतुष्टि भरी मुस्कान देखना', points: { people: 3 } },
      { text: 'Seeing a finished dress, artwork or bridal makeover look stunning', textHi: 'तैयार पोशाक या मेकअप को देखकर लोगों द्वारा तारीफ पाना', points: { creative: 3 } }
    ]
  },
  {
    id: 8,
    question: 'What is your preference regarding teamwork versus independent work?',
    questionHi: 'टीम में काम करने या अकेले काम करने के बारे में आपकी क्या पसंद है?',
    category: 'people',
    options: [
      { text: 'I enjoy being part of a technical crew with clear roles', textHi: 'तकनीकी टीम में मिलकर काम करना', points: { practical: 2, tech: 1 } },
      { text: 'I like focusing quietly on computer diagnostics alone', textHi: 'कंप्यूटर पर अकेले ध्यान लगाकर डायग्नोस्टिक करना', points: { tech: 3 } },
      { text: 'I love constantly talking, guiding and taking care of people', textHi: 'लगातार लोगों से मिलना, बात करना और सेवा देना', points: { people: 3 } },
      { text: 'I want to run my own small studio or boutique independently', textHi: 'अपनी खुद की दुकान या बुटीक स्वतंत्र रूप से चलाना', points: { creative: 2, practical: 1 } }
    ]
  },
  {
    id: 9,
    question: 'How do you feel about safety rules and technical discipline?',
    questionHi: 'सुरक्षा नियमों और तकनीकी अनुशासन के पालन में आपकी क्या सोच है?',
    category: 'tech',
    options: [
      { text: 'I respect safety gear (helmets, gloves, fuses) completely', textHi: 'हेलमेट, दस्ताने और अर्थिंग नियमों का पूरा पालन करता हूँ', points: { practical: 3 } },
      { text: 'I am very careful with computer data backup and antivirus', textHi: 'डेटा सुरक्षा और पासवर्ड में बहुत सावधानी रखता हूँ', points: { tech: 3 } },
      { text: 'Hygiene and cleanliness for patients is my top priority', textHi: 'मरीजों के लिए साफ-सफाई और स्वच्छता मेरी प्राथमिकता है', points: { people: 3 } },
      { text: 'Precision in measurements and fabric cuts matters most', textHi: 'कपड़े और नाप-तौल की सटीकता मेरे लिए सबसे जरूरी है', points: { creative: 3 } }
    ]
  },
  {
    id: 10,
    question: 'In 3 years, what kind of professional would you like to see yourself as?',
    questionHi: '3 साल बाद आप खुद को किस रूप में देखना चाहते हैं?',
    category: 'practical',
    options: [
      { text: 'A certified technical supervisor or solar/electrical contractor', textHi: 'प्रमाणित सोलर/इलेक्ट्रिकल सुपरवाइजर या सरकारी कांट्रैक्टर', points: { practical: 3, tech: 1 } },
      { text: 'A drone pilot, network engineer or CAD designer', textHi: 'ड्रोन पायलट, नेटवर्क इंजीनियर या सीएडी ऑपरेटर', points: { tech: 3 } },
      { text: 'A senior healthcare hospital associate or nursing assistant', textHi: 'अस्पताल में सीनियर हेल्थकेयर असिस्टेंट', points: { people: 3 } },
      { text: 'A successful boutique owner or professional bridal stylist', textHi: 'सफल बुटीक संचालक या ब्राइडल स्टाइलिस्ट', points: { creative: 3 } }
    ]
  }
];

interface StudentAssessmentProps {
  language: 'en' | 'hi';
  onCompleteAssessment: (scores: {
    practicalWork: 'Low' | 'Medium' | 'High';
    technology: 'Low' | 'Medium' | 'High';
    creativeWork: 'Low' | 'Medium' | 'High';
    peopleOriented: 'Low' | 'Medium' | 'High';
  }) => void;
  onCancel: () => void;
}

export const StudentAssessment: React.FC<StudentAssessmentProps> = ({
  language,
  onCompleteAssessment,
  onCancel
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [accumulatedPoints, setAccumulatedPoints] = useState<{
    practical: number;
    tech: number;
    creative: number;
    people: number;
  }>({
    practical: 0,
    tech: 0,
    creative: 0,
    people: 0
  });

  const [isFinished, setIsFinished] = useState<boolean>(false);

  const q = ASSESSMENT_QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / ASSESSMENT_QUESTIONS.length) * 100);

  const handleSelectOption = (points: { practical?: number; tech?: number; creative?: number; people?: number }) => {
    const updated = {
      practical: accumulatedPoints.practical + (points.practical || 0),
      tech: accumulatedPoints.tech + (points.tech || 0),
      creative: accumulatedPoints.creative + (points.creative || 0),
      people: accumulatedPoints.people + (points.people || 0)
    };

    setAccumulatedPoints(updated);

    if (currentIdx + 1 < ASSESSMENT_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const getLevel = (score: number): 'Low' | 'Medium' | 'High' => {
    if (score >= 12) return 'High';
    if (score >= 6) return 'Medium';
    return 'Low';
  };

  const finalScores = {
    practicalWork: getLevel(accumulatedPoints.practical),
    technology: getLevel(accumulatedPoints.tech),
    creativeWork: getLevel(accumulatedPoints.creative),
    peopleOriented: getLevel(accumulatedPoints.people)
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto p-4 py-8 animate-in fade-in">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {language === 'hi' ? 'आकलन संपन्न' : 'Assessment Completed'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {language === 'hi' ? 'आपकी रुचि प्रोफ़ाइल' : 'Your Interest Profile'}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'hi'
                ? 'आपके जवाबों से पता चलता है कि आपकी प्राकृतिक रुचियां किन क्षेत्रों में सबसे प्रबल हैं। (यह कोई चिकित्सीय निदान नहीं है)'
                : 'Your responses suggest where your natural career strengths lean. (This is a guidance estimate, not a psychological diagnosis)'}
            </p>
          </div>

          {/* Results Summary Cards */}
          <div className="space-y-2.5 text-xs text-left">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{language === 'hi' ? 'व्यावहारिक व मशीनी कार्य (Practical Work)' : 'Practical & Machinery Work'}</span>
                <span className="text-[11px] text-slate-500">{language === 'hi' ? 'औजार, रिपेयर व फील्ड उपकरण' : 'Tools, repair & mechanical operations'}</span>
              </div>
              <span className={`font-black px-3 py-1 rounded-xl text-xs ${
                finalScores.practicalWork === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {finalScores.practicalWork}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{language === 'hi' ? 'डिजिटल व आधुनिक टेक्नोलॉजी (Technology)' : 'Technology & Digital'}</span>
                <span className="text-[11px] text-slate-500">{language === 'hi' ? 'कंप्यूटर, ड्रोन, ईवी व इलेक्ट्रॉनिक्स' : 'Computers, Drones, EV & circuits'}</span>
              </div>
              <span className={`font-black px-3 py-1 rounded-xl text-xs ${
                finalScores.technology === 'High' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {finalScores.technology}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{language === 'hi' ? 'रचनात्मक व डिजाइन कार्य (Creative Work)' : 'Creative & Design Work'}</span>
                <span className="text-[11px] text-slate-500">{language === 'hi' ? 'फैशन, बुटीक, ब्यूटी व सौंदर्यशास्त्र' : 'Apparel, aesthetics & beauty arts'}</span>
              </div>
              <span className={`font-black px-3 py-1 rounded-xl text-xs ${
                finalScores.creativeWork === 'High' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {finalScores.creativeWork}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{language === 'hi' ? 'मानवीय सेवा व स्वास्थ्य (People-oriented)' : 'People-Oriented & Service'}</span>
                <span className="text-[11px] text-slate-500">{language === 'hi' ? 'अस्पताल, मरीज देखभाल व सामाजिक सहायता' : 'Healthcare, patient care & counseling'}</span>
              </div>
              <span className={`font-black px-3 py-1 rounded-xl text-xs ${
                finalScores.peopleOriented === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {finalScores.peopleOriented}
              </span>
            </div>
          </div>

          <button
            onClick={() => onCompleteAssessment(finalScores)}
            className="w-full bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 font-black py-3.5 rounded-2xl text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            <span>{language === 'hi' ? 'अनुकूल करियर मिलान देखें (View Matches)' : 'Apply to My Career Matches'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Progress & Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              {language === 'hi' ? `प्रश्न ${q.id} / ${ASSESSMENT_QUESTIONS.length}` : `Question ${q.id} of ${ASSESSMENT_QUESTIONS.length}`}
            </span>
            <span className="text-amber-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Title */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {language === 'hi' ? q.questionHi : q.question}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'जो विकल्प आपको सबसे स्वाभाविक लगे, उस पर क्लिक करें:' : 'Choose the option that feels most natural to you:'}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectOption(opt.points)}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-left transition font-bold text-xs sm:text-sm text-slate-800 hover:text-slate-950 flex items-center justify-between group shadow-xs"
            >
              <span>{language === 'hi' ? opt.textHi : opt.text}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
            </button>
          ))}
        </div>

        {/* Cancel / Exit */}
        <div className="pt-2 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 font-semibold"
          >
            {language === 'hi' ? 'बाद में पूरा करें' : 'Exit to Dashboard'}
          </button>
          <span className="text-slate-400">1 question at a time</span>
        </div>
      </div>
    </div>
  );
};
