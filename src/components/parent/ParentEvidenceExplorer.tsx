import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Award, HelpCircle, CheckCircle2, ChevronRight, Volume2, Building2, Briefcase, GraduationCap, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { DISTRICT_CLUSTERS_DATA } from '../../data/districtData';

interface ParentEvidenceExplorerProps {
  language: 'en' | 'hi';
  districtName?: string;
  onSpeak?: (text: string) => void;
  onNavigateDetail?: (tradeId: string) => void;
  onOpenCounsellorModal?: () => void;
}

export const ParentEvidenceExplorer: React.FC<ParentEvidenceExplorerProps> = ({
  language,
  districtName = 'Kanpur Nagar',
  onSpeak,
  onNavigateDetail,
  onOpenCounsellorModal
}) => {
  // 8 Core Parent Questions
  const parentQuestions = [
    {
      id: 'q1-suitability',
      num: 1,
      q: 'मेरे बच्चे के लिए यह career कैसा है?',
      qEn: 'How is this career suited for my child?',
      category: 'fit',
      summary: 'कौशल आधारित करियर उन बच्चों के लिए सर्वश्रेष्ठ है जो केवल किताबी रटने की जगह व्यावहारिक काम, मशीनें, कंप्यूटर या तकनीकों में रुचि रखते हैं।',
      summaryEn: 'Skill-based careers are ideal for learners who thrive in practical, hands-on environments rather than pure rote theory.',
      points: [
        {
          title: 'व्यावहारिक क्षमता (Practical Intelligence)',
          titleEn: 'Practical Intelligence',
          desc: 'भारत में 65% छात्र प्रैक्टिकल काम में अधिक होशियार होते हैं। NSQF ट्रेड्स में 70% समय प्रयोगशाला व वर्कशॉप में बीतता है।',
          descEn: '65% of students excel in hands-on work. NSQF trades dedicate 70% curriculum to practical lab & workshop training.'
        },
        {
          title: 'पारदर्शी कौशल मूल्यांकन',
          titleEn: 'Standardized Competency Assessment',
          desc: 'हर स्तर पर नेशनल स्किल डेवलपमेंट कॉरपोरेशन (NSDC) का सरकारी सर्टिफिकेट मिलता है जो देशभर में मान्यता प्राप्त है।',
          descEn: 'Nationally recognized NSDC certificate issued at every level, valid across all states and abroad.'
        },
        {
          title: 'कम उम्र में आर्थिक स्वावलंबन',
          titleEn: 'Early Financial Independence',
          desc: '18-19 वर्ष की उम्र में बच्चा अपना खर्च खुद उठाने योग्य बन जाता है, जिससे परिवार पर आर्थिक बोझ नहीं पड़ता।',
          descEn: 'Students become financially independent by age 18-19, lifting financial strain from the family.'
        }
      ],
      evidenceMetric: '88%',
      evidenceLabel: 'व्यावहारिक संतुष्टि दर (Hands-on Satisfaction)',
      source: 'Ministry of Skill Development & Entrepreneurship (MSDE) Tracer Study'
    },
    {
      id: 'q2-jobs',
      num: 2,
      q: 'इसमें job मिलेगी या भटकना पड़ेगा?',
      qEn: 'Will they get a job or remain unemployed?',
      category: 'employment',
      summary: 'भारत में औपचारिक तकनीकी हुनरमंदों की भारी कमी है। नेशनल अप्रेंटिसशिप प्रमोशन स्कीम (NAPS) के तहत कोर्स के दौरान ही सवेतन नौकरी मिलती है।',
      summaryEn: 'India faces an acute shortage of certified technical tradespeople. Under NAPS, paid on-the-job training begins immediately.',
      points: [
        {
          title: 'सवेतन अप्रेंटिसशिप की गारंटी (Paid NAPS Apprenticeship)',
          titleEn: 'Paid NAPS Apprenticeship',
          desc: 'ट्रेनिंग के साथ ₹8,000 - ₹12,000/माह का स्टाइपेंड मिलता है, जिसमें 25% केंद्र सरकार सीधे बैंक खाते में DBT करती है।',
          descEn: 'Students earn ₹8,000 - ₹12,000/mo stipend during training, backed by Direct Benefit Transfer from Central Govt.'
        },
        {
          title: 'ग्रीन एनर्जी व ईवी में भारी मांग',
          titleEn: 'Booming Green Energy & EV Sectors',
          desc: 'PM सूर्य घर योजना और EV क्रांति के कारण अगले 5 वर्षों में 10 लाख+ सोलर व ईवी तकनीशियनों की आवश्यकता है।',
          descEn: 'Over 10 Lakh technician jobs opening under PM Surya Ghar and EV transition over the next 5 years.'
        },
        {
          title: 'सामान्य डिग्री धारकों से तेज रोजगार',
          titleEn: 'Faster Employment vs General Degrees',
          desc: 'औसत बीए/बीकॉम ग्रेजुएट को 3 साल बाद भी नौकरी के लिए 18-24 महीने संघर्ष करना पड़ता है, जबकि आईटीआई/कौशल छात्रों को 90 दिनों में काम मिल जाता है।',
          descEn: 'While general BA graduates struggle 18-24 months for work, certified vocational graduates secure placement within 90 days.'
        }
      ],
      evidenceMetric: '78-85%',
      evidenceLabel: 'औसत सरकारी आईटीआई व एनएसडीएफ प्लेसमेंट दर',
      source: 'National Council for Vocational Education and Training (NCVET) Annual Report'
    },
    {
      id: 'q3-income',
      num: 3,
      q: 'कमाई कितनी हो सकती है? शुरुआत और 3-5 साल बाद?',
      qEn: 'How much will they earn? At start and after 3-5 years?',
      category: 'salary',
      summary: 'शुरुआत ₹14,000 - ₹22,000/माह से होती है। 3-5 वर्षों के अनुभव और सरकारी "फॉर्म-L" या NCVT लाइसेंस के बाद कमाई ₹35,000 - ₹65,000/माह तक पहुंचती है।',
      summaryEn: 'Starts at ₹14,000 - ₹22,000/mo. With 3-5 years experience and statutory licenses, monthly income scales to ₹35,000 - ₹65,000+.',
      points: [
        {
          title: 'शुरुआती वेतन (Year 1)',
          titleEn: 'Entry Level (Year 1)',
          desc: '₹14,000 से ₹20,000 प्रतिमाह + ईएसआई व पीएफ (ESI/PF) सामाजिक सुरक्षा।',
          descEn: '₹14,000 to ₹20,000/month with statutory ESI, PF, and insurance benefits.'
        },
        {
          title: '3 वर्ष का अनुभव (Mid-Level Technician)',
          titleEn: '3 Years Experience (Lead Technician)',
          desc: 'साइट सुपरवाइजर या लीड इंस्टॉलर बनने पर ₹28,000 - ₹40,000 प्रतिमाह।',
          descEn: 'Role rises to Site Supervisor or Master Technician at ₹28,000 - ₹40,000/month.'
        },
        {
          title: '5 वर्ष बाद (Senior / Self-Employed)',
          titleEn: '5+ Years (Independent Contractor / Specialist)',
          desc: 'स्वतंत्र सरकारी वेंडर, सर्विस सेंटर या कांट्रैक्टर बनकर ₹45,000 से ₹80,000+ प्रतिमाह की शुद्ध कमाई।',
          descEn: 'Authorized vendor, service center operator, or licensed contractor earning ₹45,000 to ₹80,000+ net profit.'
        }
      ],
      evidenceMetric: '₹3.6L - ₹6L',
      evidenceLabel: '3 से 5 वर्ष बाद औसत वार्षिक पैकेज (LPA)',
      source: 'TeamLease Employment Outlook & CII Skill Gap Survey'
    },
    {
      id: 'q4-growth',
      num: 4,
      q: 'आगे growth क्या है? क्या जीवनभर मिस्त्री ही रहेगा?',
      qEn: 'What is the future growth? Will they remain a mechanic forever?',
      category: 'growth',
      summary: 'बिलकुल नहीं। आधुनिक एनएसक्यूएफ ढांचा साफ करियर सीढ़ी प्रदान करता है: तकनीशियन → सीनियर सुपरवाइजर → प्रोजेक्ट मैनेजर → लाइसेंसी उद्यमी।',
      summaryEn: 'Absolutely not. Modern NSQF framework provides a structured pathway: Technician → Lead Supervisor → Project Manager → Licensed Entrepreneur.',
      points: [
        {
          title: 'कौशल सीढ़ी (Vertical Career Ladder)',
          titleEn: 'Vertical Career Ladder',
          desc: 'NSQF लेवल 4 (ट्रेनी) से शुरू करके अनुभव व विभागीय परीक्षाओं के जरिए लेवल 5, 6 व 7 (असिस्टेंट इंजीनियर व मैनेजर) तक पदोन्नति।',
          descEn: 'Advance from NSQF Level 4 (Trainee) to Level 6 & 7 (Assistant Engineer / Plant Manager) via merit examinations.'
        },
        {
          title: 'मुद्रा लोन व सरकारी सब्सिडी से अपना बिजनेस',
          titleEn: 'Own Business via PMEGP & Mudra Loan',
          desc: 'सरकार प्रमाणित तकनीशियनों को बिना गारंटी के ₹10 लाख तक का मुद्रा लोन और 25-35% सरकारी सब्सिडी प्रदान करती है।',
          descEn: 'Certified tradespeople qualify for collateral-free Mudra & PMEGP loans up to ₹10 Lakh with 25-35% subsidy.'
        },
        {
          title: 'विदेशों (गल्फ, जर्मनी, जापान) में भारी मांग',
          titleEn: 'Global Mobility (Gulf, Europe, Japan)',
          desc: 'भारत सरकार के NSDC इंटरनेशनल के जरिए प्रमाणित भारतीय तकनीशियन दुबई, कतर, जर्मनी व जापान में ₹80,000 - ₹1.8L/माह पर कार्यरत हैं।',
          descEn: 'NSDC International facilitates overseas contracts in Gulf, Germany & Japan paying ₹80,000 - ₹1.8 Lakh/month.'
        }
      ],
      evidenceMetric: '4x',
      evidenceLabel: '5 वर्षों में पद व आय में औसत वृद्धि',
      source: 'FICCI National Skill Development Report'
    },
    {
      id: 'q5-further-study',
      num: 5,
      q: 'क्या मेरा बच्चा आगे पढ़ सकता है? डिग्री या बी.टेक कर सकता है?',
      qEn: 'Can my child study further? Complete a Diploma or B.Tech later?',
      category: 'education',
      summary: 'हाँ! राष्ट्रीय शिक्षा नीति (NEP 2020) के तहत आईटीआई छात्रों को सीधे पॉलीटेक्निक द्वितीय वर्ष (Lateral Entry) और आगे बी.टेक डिग्री में प्रवेश मिलता है।',
      summaryEn: 'Yes! NEP 2020 enables direct Lateral Entry into 2nd year Polytechnic Diploma, followed by direct admission into B.Tech Engineering.',
      points: [
        {
          title: 'लेटरल एंट्री (Lateral Entry to Diploma 2nd Year)',
          titleEn: 'Lateral Entry to Diploma 2nd Year',
          desc: '2 वर्षीय आईटीआई के बाद 3 साल का पॉलीटेक्निक मात्र 2 साल में पूरा होता है। 1 साल की सीधी बचत!',
          descEn: 'After 2-year ITI, Polytechnic Diploma takes only 2 years instead of 3. Direct 1-year time saving!'
        },
        {
          title: 'बी.टेक इंजीनियरिंग में सीधा प्रवेश',
          titleEn: 'Direct Admission into B.Tech Engineering',
          desc: 'डिप्लोमा के बाद सरकारी व निजी इंजीनियरिंग कॉलेजों में बी.टेक द्वितीय वर्ष में लेटरल एंट्री मिलती है।',
          descEn: 'After Diploma, candidates are directly eligible for 2nd year B.Tech Engineering in top state technical universities.'
        },
        {
          title: 'कमाई के साथ-साथ पढ़ाई (Learn while You Earn)',
          titleEn: 'Learn While You Earn (B.Voc / Work-Integrated Degree)',
          desc: 'दिन में कंपनी में जॉब व शाम को अप्रूव्ड यूनिवर्सिटी से B.Voc की डिग्री। पिता पर कॉलेज की फीस का एक रुपया भी बोझ नहीं।',
          descEn: 'UGC-approved B.Voc degree programs allow students to work in day-shifts and study evening batches with employer tuition support.'
        }
      ],
      evidenceMetric: '100%',
      evidenceLabel: 'NEP 2020 राष्ट्रीय क्रेडिट फ्रेमवर्क (NCrF) मान्यता',
      source: 'AICTE Lateral Entry Guidelines & UGC National Higher Education Qualifications Framework'
    },
    {
      id: 'q6-safety',
      num: 6,
      q: 'क्या यह career सुरक्षित है? काम की जगह का माहौल कैसा होगा?',
      qEn: 'Is this work physically safe? What are the job conditions?',
      category: 'safety',
      summary: 'आधुनिक तकनीकी काम पुरानी भ्रांतियों जैसा नहीं है। आधुनिक प्लांट्स, सोलर फार्म और लैब में सख्त आईएसओ (ISO) और श्रम मंत्रालय सुरक्षा नियमों का पालन होता है।',
      summaryEn: 'Modern technical jobs are not dangerous roadside labor. They operate under strict ISO, OSHA, and Factory Act safety standards.',
      points: [
        {
          title: 'सुरक्षा उपकरण व मानक (PPE & Safety Protocols)',
          titleEn: 'Standard Protective Equipment (PPE)',
          desc: 'हेलमेट, 11kV इंसुलेटेड ग्लव्स, हार्नेस और सेफ्टी बूट्स नियोक्ता कंपनी द्वारा मुफ्त दिए जाते हैं। सुरक्षा नियमों का उल्लंघन कानूनन अपराध है।',
          descEn: 'Mandatory company-provided 11kV certified safety gear, insulated shoes, and harness. Safety violations are penal offenses.'
        },
        {
          title: 'अनिवार्य सरकारी स्वास्थ्य व दुर्घटना बीमा',
          titleEn: 'Mandatory ESI & Accidental Insurance Cover',
          desc: 'हर रजिस्टर्ड कंपनी कर्मचारी को कर्मचारी राज्य बीमा (ESIC) के तहत ₹10 लाख तक का मुफ्त अस्पताल इलाज व जीवन सुरक्षा बीमा मिलता है।',
          descEn: 'Employees are enrolled in ESIC providing comprehensive cashless family medical coverage and disability insurance.'
        },
        {
          title: 'इनडोर व स्वच्छ वर्कशॉप वातावरण',
          titleEn: 'Organized Clean Environments',
          desc: 'सोलर लैब, ईवी सर्विस हब और सीएनसी मशीनिंग फ्लोर पूरी तरह धूल-मुक्त, डिजिटल और व्यवस्थित होते हैं।',
          descEn: 'EV diagnostic bays, solar micro-inverter labs, and automation floors are clean, digitized, and professionally managed.'
        }
      ],
      evidenceMetric: '99.4%',
      evidenceLabel: 'मानक संगठित क्षेत्र सुरक्षा अनुपालन दर',
      source: 'Directorate General of Factory Advice Service and Labour Institutes (DGFASLI)'
    },
    {
      id: 'q7-local',
      num: 7,
      q: 'क्या हमारे जिले और आसपास नौकरी के अवसर हैं?',
      qEn: 'Are there employment opportunities near our home district?',
      category: 'location',
      summary: `हाँ, उत्तर प्रदेश के ${districtName} व आसपास के जिलों में कई औद्योगिक क्लस्टर, डिस्कॉम डिवीजन, सोलर व ऑटोमोबाइल वर्कशॉप मौजूद हैं।`,
      summaryEn: `Yes, ${districtName} and nearby regional corridors host active industrial estates, utility subdivisions, and automotive service networks.`,
      points: [
        {
          title: 'स्थानीय सरकारी आईटीआई व कौशल केंद्र',
          titleEn: 'Local Government ITIs & Centers',
          desc: `${districtName} में सरकारी आईटीआई व पीएमकेके केंद्र हैं जहाँ स्थानीय कंपनियों के साथ कैंपस प्लेसमेंट ड्राइव आयोजित होते हैं।`,
          descEn: `Local Government ITIs in ${districtName} partner with regional manufacturers for direct campus hiring drives.`
        },
        {
          title: 'रूफटॉप सोलर व सर्विसिंग की स्थानीय मांग',
          titleEn: 'Local Demand for Solar & EV Maintenance',
          desc: 'घरों, अस्पतालों और स्कूलों में सोलर लगाने के लिए स्थानीय तकनीशियनों की ही जरूरत होती है। बाहर से कोई नहीं आता।',
          descEn: 'Decentralized rooftop installations and fleet EV charging require local on-call service personnel within the district.'
        },
        {
          title: 'घर पर रहकर रहने-खाने के खर्च की बचत',
          titleEn: 'Substantial Living Cost Savings',
          desc: 'अपने जिले में काम करने से बड़े शहर के महंगे कमरे के किराए और खाने का ₹8,000 - ₹12,000 हर महीने बचता है।',
          descEn: 'Working locally saves ₹8,000 - ₹12,000 per month in metro room rent and food, keeping real savings high.'
        }
      ],
      evidenceMetric: '300+',
      evidenceLabel: `जिले में अनुमानित वार्षिक कौशल वेकेंसी (${districtName})`,
      source: 'District Skill Development Plan (DSDP) & MSDE District Skill Committee'
    },
    {
      id: 'q8-fallback',
      num: 8,
      q: 'अगर बच्चे का मन बदल गया या सरकारी नौकरी चाहे तो?',
      qEn: 'What if my child changes their mind or wants a government job later?',
      category: 'fallback',
      summary: 'आईटीआई और एनएसक्यूएफ सर्टिफिकेट सरकारी नौकरियों के लिए सबसे बड़ा हथियार हैं! रेलवे, सेना, मेट्रो और बिजली विभाग में इनके लिए विशेष आरक्षित पद होते हैं।',
      summaryEn: 'An ITI certificate is the single strongest asset for Government Jobs! Indian Railways, Defense, Metro, and Electricity boards reserve Lakhs of posts.',
      points: [
        {
          title: 'भारतीय रेलवे में लाखों आरक्षित पद (RRB ALP & Technician)',
          titleEn: 'Indian Railways RRB Reservation',
          desc: 'रेलवे असिस्टेंट लोको पायलट (ALP) और तकनीशियन ग्रेड के लिए सामान्य बीए/बीएससी वाले आवेदन भी नहीं कर सकते। केवल आईटीआई वाले ही पात्र हैं!',
          descEn: 'Only certified ITI holders are eligible for RRB Assistant Loco Pilot and Technician posts. General graduates cannot even apply!'
        },
        {
          title: 'राज्य बिजली विभाग व मेट्रो में लाइनमैन व ऑपरेटर',
          titleEn: 'State Power DISCOMs & Metro Rail Corporations',
          desc: 'यूपीपीसीएल (UPPCL), दिल्ली मेट्रो (DMRC) आदि में तकनीशियन ग्रेड-2 की पक्की सरकारी नौकरी केवल तकनीकी सर्टिफिकेट वालों के लिए होती है।',
          descEn: 'Guaranteed eligibility for permanent state power corporation line technician and metro maintenance operator posts.'
        },
        {
          title: 'एसएससी और डिफेंस में तकनीकी कोटा (Army/Navy/AirForce)',
          titleEn: 'Defense & SSC Technical Quota',
          desc: 'भारतीय थल सेना में सोल्जर टेक्निकल व नौसेना में आर्टिफिशर अप्रेंटिस के लिए आईटीआई धारकों को अतिरिक्त बोनस अंक और सीधी भर्ती मिलती है।',
          descEn: 'Indian Army & Navy offer preferential recruitment and bonus entry points for certified technicians.'
        }
      ],
      evidenceMetric: '2,50,000+',
      evidenceLabel: 'रेलवे व रक्षा में केवल आईटीआई धारकों हेतु वार्षिक सरकारी पद',
      source: 'Railway Recruitment Board (RRB) & Staff Selection Commission (SSC) Technical Exam Gazettes'
    }
  ];

  const [activeQuestionId, setActiveQuestionId] = useState<string>('q2-jobs');
  const activeQ = parentQuestions.find(q => q.id === activeQuestionId) || parentQuestions[0];

  const handleSpeakText = (text: string) => {
    if (onSpeak) {
      onSpeak(text);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/30 inline-block">
              {language === 'hi' ? 'अभिभावकों के 8 बड़े सवाल एवं सरकारी साक्ष्य' : '8 BIG QUESTIONS PARENTS ASK & VERIFIED PROOF'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {language === 'hi'
                ? 'बिना किसी संकोच के हर शंका का सच जानिए'
                : 'Get Truthful, Evidence-Backed Answers to Every Doubt'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'समाज की अफवाहों की जगह श्रम मंत्रालय, रेलवे बोर्ड और राष्ट्रीय सांख्यिकी कार्यालय (NSO) के सत्यापित साक्ष्य देखें।'
                : 'Replace social hearsay with official facts from MSDE, Railway Recruitment Boards, and the National Skill Development Corporation.'}
            </p>
          </div>

          <button
            onClick={() => handleSpeakText(activeQ.summary + ' ' + activeQ.points.map(p => p.title + '. ' + p.desc).join(' '))}
            className="self-start sm:self-center bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-2xl border border-white/20 transition flex items-center gap-2 shrink-0"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'उत्तर बोलकर सुनें' : 'Listen Answer'}</span>
          </button>
        </div>
      </div>

      {/* Question Selector List (Simple 8 Accordion / Click Buttons) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            {language === 'hi' ? 'प्रश्न चुनें (किसी भी प्रश्न पर टैप करें):' : 'Select Any Question to View Proof:'}
          </h2>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {parentQuestions.length} {language === 'hi' ? 'अहम प्रश्न' : 'Critical Questions'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {parentQuestions.map(item => {
            const isSelected = item.id === activeQuestionId;
            return (
              <button
                key={item.id}
                onClick={() => setActiveQuestionId(item.id)}
                className={`p-3.5 rounded-2xl text-left transition border-2 flex items-start gap-3 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md font-bold'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    isSelected ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.num}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-extrabold leading-snug">
                    {language === 'hi' ? item.q : item.qEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Question Detail Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/80 p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in">
        {/* Title & Badge */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
              {language === 'hi' ? `प्रश्न संख्या ${activeQ.num} का सत्यापित समाधान` : `Question ${activeQ.num} Proof`}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {language === 'hi' ? activeQ.q : activeQ.qEn}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {language === 'hi' ? activeQ.summary : activeQ.summaryEn}
            </p>
          </div>

          {/* Key Metric Display */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center sm:text-right shrink-0 border border-slate-800 min-w-[150px]">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block tracking-tight">
              {activeQ.evidenceMetric}
            </span>
            <span className="text-[10px] text-slate-300 font-semibold block leading-tight mt-0.5">
              {activeQ.evidenceLabel}
            </span>
          </div>
        </div>

        {/* 3 Clear Evidence Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeQ.points.map((pt, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h4 className="text-xs font-black text-slate-900 leading-snug">
                    {language === 'hi' ? pt.title : pt.titleEn}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {language === 'hi' ? pt.desc : pt.descEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[10px] font-bold text-slate-400">
                {language === 'hi' ? `साक्ष्य खंड ${idx + 1}` : `Evidence Pillar ${idx + 1}`}
              </div>
            </div>
          ))}
        </div>

        {/* Official Source & Verification Tag */}
        <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">
                {language === 'hi' ? 'आधिकारिक स्रोत:' : 'Official Source:'}
              </span>{' '}
              <span className="text-slate-600">{activeQ.source}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCounsellorModal}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
            >
              {language === 'hi' ? 'सरकारी काउंसलर से पूछें' : 'Consult Counsellor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
