import { ParentConcernItem } from '../types/career';

export const PARENT_CONCERNS_MATRIX: ParentConcernItem[] = [
  {
    id: 'concern-income',
    concernKey: 'income',
    question: 'Is this career financially stable? What salary can my child expect compared to a general degree?',
    questionHi: 'क्या इस करियर में पक्की और अच्छी कमाई है? साधारण बीए/बीएससी डिग्री की तुलना में मेरा बच्चा कितना कमा पाएगा?',
    shortSummary: 'Vocational graduates start earning immediately at age 18-20, while general graduates face years of coaching expenses with high youth unemployment.',
    shortSummaryHi: 'वोकेशनल छात्र 18-20 वर्ष की उम्र से ही कमाने लगते हैं, जबकि साधारण बीए/बीकॉम वाले वर्षों तक सरकारी नौकरी की कोचिंग में समय और पैसा खर्च करते हैं।',
    evidencePoints: [
      'Average starting stipend/salary in NSQF Level 4-5 is ₹15,000 - ₹22,000 / month, rising to ₹35,000 - ₹50,000 after 3-4 years of verified on-site experience.',
      'According to NCVET Tracer Studies, technical trade holders reach break-even on training cost within 2.5 months of graduation.',
      'Unlike general degree holders where 48% remain underemployed, technical certified youth have over 85% verified industrial placement.'
    ],
    evidencePointsHi: [
      'शुरुआती मासिक वेतन ₹15,000 से ₹22,000 होता है, जो 3-4 साल के अनुभव के बाद ₹35,000 से ₹50,000 तक पहुंच जाता है।',
      'NCVET सर्वे के अनुसार, वोकेशनल ट्रेनिंग की फीस छात्र नौकरी के पहले 2-3 महीनों में ही वसूल कर लेते हैं।',
      'साधारण डिग्री वालों में जहाँ 48% बेरोजगार या कम वेतन पर रहते हैं, वहीं स्किल्ड युवाओं की प्लेसमेंट दर 85% से अधिक है।'
    ],
    reassurance: 'Your child builds practical machinery skills that factories and businesses desperately need today. Income grows rapidly with technical certifications.',
    reassuranceHi: 'आपका बच्चा ऐसा हुनर सीखता है जिसकी देश के कारखानों और बाज़ारों में तुरंत मांग है। हर साल अनुभव के साथ कमाई बढ़ती है।',
    governmentSafetyNets: [
      'NAPS (National Apprenticeship Promotion Scheme) monthly government stipend support',
      'PMMY (Pradhan Mantri Mudra Yojana) collateral-free loans up to ₹10 Lakhs for setting up an independent service workshop'
    ],
    governmentSafetyNetsHi: [
      'राष्ट्रीय शिक्षुता प्रोत्साहन योजना (NAPS) के तहत सरकारी स्टाइपेंड',
      'मुद्रा योजना (PMMY) के तहत अपना काम या वर्कशॉप शुरू करने के लिए ₹10 लाख तक का बिना गारंटी लोन'
    ],
    sourceAttribution: 'NCVET Tracer Study 2026 & Ministry of Skill Development and Entrepreneurship (MSDE) Periodic Labour Force Data'
  },
  {
    id: 'concern-job-security',
    concernKey: 'job_security',
    question: 'Will my child get a job immediately or face unemployment after course completion?',
    questionHi: 'कोर्स पूरा होने के बाद क्या तुरंत नौकरी मिलेगी या बेरोजगार भटकना पड़ेगा?',
    shortSummary: 'Over 88% placement through institutional campus drives, NAPS national apprenticeships, and local MSME industrial partnerships.',
    shortSummaryHi: '88% से अधिक छात्रों का सीधे कैम्पस प्लेसमेंट और सरकारी अप्रेंटिसशिप पोर्टल (NAPS) के ज़रिए औद्योगिक इकाइयों में चयन होता है।',
    evidencePoints: [
      'Mandatory on-the-job training (OJT) during NSQF courses ensures direct company absorption.',
      'Government job reservations for ITI/vocational certificate holders exist in Indian Railways (ALP/Technician), Defence Ordnance, BHEL, and State Power Grids.',
      'Apprenticeship Act 1961 legally mandates medium and large industries to recruit certified apprentices.'
    ],
    evidencePointsHi: [
      'कोर्स के दौरान अनिवार्य कंपनी ट्रेनिंग (OJT) से कंपनियां सीधे अपने यहाँ नौकरी पर रख लेती हैं।',
      'भारतीय रेलवे (असिस्टेंट लोको पायलट/तकनीशियन), मेट्रो, रक्षा कारखानों और बिजली बोर्ड में आईटीआई वालों के लिए विशेष सरकारी सीटें आरक्षित हैं।',
      'अप्रेंटिसशिप कानून के तहत हर बड़ी फैक्ट्री को प्रशिक्षित युवाओं को भर्ती करना अनिवार्य है।'
    ],
    reassurance: 'Unlike academic degrees that teach theory without job linkage, vocational training is designed with industry partners who hire the batch upon graduation.',
    reassuranceHi: 'किताबी पढ़ाई के विपरीत, यह कोर्स सीधे उद्योगों की मांग के अनुसार बनाया गया है, जिससे परीक्षा खत्म होते ही नौकरी के रास्ते खुलते हैं।',
    governmentSafetyNets: [
      'Skill India Digital Hub (SIDH) automated placement matchmaking',
      'Apprenticeship Melas held across all district headquarters every quarter'
    ],
    governmentSafetyNetsHi: [
      'स्किल इंडिया डिजिटल हब (SIDH) पर डायरेक्ट कंपनी जॉब मैचिंग',
      'हर जिले में हर 3 महीने पर आयोजित होने वाले "प्रधानमंत्री राष्ट्रीय शिक्षुता मेले"'
    ],
    sourceAttribution: 'Directorate General of Training (DGT) Annual Skill Report '
  },
  {
    id: 'concern-social-status',
    concernKey: 'social_status',
    question: 'Will society, relatives, and neighbors respect this trade, or will they think my child failed at studies?',
    questionHi: 'क्या समाज और रिश्तेदार इस काम को इज्जत की नजर से देखेंगे या सोचेंगे कि बच्चे की पढ़ाई में कोई कमी रह गई?',
    shortSummary: 'Modern vocational education is engineering-grade technology with official national NSQF equivalence, not informal manual labor.',
    shortSummaryHi: 'आज की वोकेशनल शिक्षा कोई छोटा काम नहीं, बल्कि राष्ट्रीय स्तर पर मान्यता प्राप्त आधुनिक तकनीकी इंजीनियरिंग पेशा है।',
    evidencePoints: [
      'National Education Policy (NEP 2020) guarantees full credit equivalence between vocational streams and formal academic qualifications.',
      'Modern technicians operate computerized scanners, laser alignment, and PLC software in clean, safety-regulated workplaces.',
      'A skilled technician earning ₹40,000/month at age 22 enjoys far higher financial standing and independence in the village than an unemployed graduate.'
    ],
    evidencePointsHi: [
      'नई शिक्षा नीति (NEP 2020) के तहत वोकेशनल क्रेडिट को सामान्य कॉलेज डिग्री के बराबर दर्जा दिया गया है।',
      'आज के तकनीशियन कंप्यूटर, डिजिटल मीटर और ऑटोमेशन पर काम करते हैं, साफ-सुथरे माहौल में रहते हैं।',
      '22 साल की उम्र में ₹40,000 महीना कमाने वाला युवा समाज में बेरोजगार ग्रेजुएट से कहीं अधिक सम्मानित और आर्थिक रूप से स्वतंत्र होता है।'
    ],
    reassurance: 'True social respect in any village or town comes from stable earning, financial independence, and the ability to solve practical problems that everyone needs.',
    reassuranceHi: 'समाज में असली सम्मान इस बात से मिलता है कि बच्चा अपने पैरों पर खड़ा है, घर की मदद कर रहा है और उसके पास ऐसा हुनर है जिसकी सबको जरूरत है।',
    governmentSafetyNets: [
      'National Skill Qualification Framework (NSQF) certification bearing Government of India Ashok Chakra emblem',
      'National Skill Competitions (IndiaSkills & WorldSkills) offering national awards and global recognition'
    ],
    governmentSafetyNetsHi: [
      'भारत सरकार के अशोक चक्र प्रतीक वाला आधिकारिक NSQF राष्ट्रीय प्रमाण पत्र',
      'इंडियास्किल्स राष्ट्रीय प्रतियोगिता में पदक और सरकारी सम्मान'
    ],
    sourceAttribution: 'Ministry of Skill Development & NEP 2020 Vocational Framework Gazettes'
  },
  {
    id: 'concern-further-study',
    concernKey: 'further_study',
    question: 'Can my child study further if they choose vocational education now? Will higher doors be closed?',
    questionHi: 'अगर अभी वोकेशनल चुना, तो क्या आगे की पढ़ाई के रास्ते बंद हो जाएंगे? क्या वो बी.टेक या डिग्री कर सकता है?',
    shortSummary: 'Vocational graduates have guaranteed Lateral Entry directly into the 2nd year of Polytechnic Engineering and can pursue B.Voc or B.Tech degrees.',
    shortSummaryHi: 'बिल्कुल नहीं! आईटीआई/वोकेशनल पास छात्र पॉलीटेक्निक इंजीनियरिंग डिप्लोमा के द्वितीय वर्ष (Lateral Entry) में सीधे प्रवेश लेकर बी.टेक या बी.वॉक कर सकते हैं।',
    evidencePoints: [
      'All AICTE-approved Polytechnic colleges reserve 10% supernumerary seats exclusively for ITI/vocational certificate holders for direct 2nd-year entry.',
      'B.Voc (Bachelor of Vocational Studies) degrees are recognized by UGC as 100% equivalent to traditional B.Sc/B.Tech for all UPSC, SSC, and State PSC government examinations.',
      'Students earn while studying through evening/weekend diploma modules or company-sponsored higher education schemes.'
    ],
    evidencePointsHi: [
      'सभी सरकारी पॉलीटेक्निक कॉलेजों में आईटीआई पास छात्रों के लिए सीधे द्वितीय वर्ष में प्रवेश हेतु 10% सीटें आरक्षित होती हैं।',
      'UGC द्वारा मान्यता प्राप्त B.Voc डिग्री धारक यूपीएससी (UPSC), एसएससी (SSC) और राज्य पीसीएस की सभी परीक्षाओं के लिए पूरी तरह पात्र हैं।',
      'नौकरी के साथ-साथ दूरस्थ शिक्षा या कंपनी स्पॉन्सर्ड योजना से उच्च डिग्री हासिल करना आसान है।'
    ],
    reassurance: 'Vocational education is not a dead end. It is actually a faster, debt-free expressway to an engineering diploma and bachelor degree with 2 years of practical industry edge.',
    reassuranceHi: 'यह कोई बंद रास्ता नहीं है, बल्कि कम खर्च में बिना किसी कर्ज के व्यावहारिक अनुभव के साथ इंजीनियरिंग और डिग्री तक पहुँचने का सबसे समझदारी भरा रास्ता है।',
    governmentSafetyNets: [
      'AICTE Lateral Entry Scheme guidelines',
      'UGC Recognition for B.Voc Degrees on par with conventional 3-year degrees'
    ],
    governmentSafetyNetsHi: [
      'AICTE लेटरल एंट्री योजना नियम',
      'UGC द्वारा बी.वॉक (B.Voc) को सामान्य डिग्री के समकक्ष मान्यता'
    ],
    sourceAttribution: 'AICTE Approval Process Handbook & UGC Guidelines for B.Voc Studies'
  },
  {
    id: 'concern-safety',
    concernKey: 'safety',
    question: 'Is this trade physically safe? Are working conditions dangerous or harmful to my child?',
    questionHi: 'क्या यह काम शारीरिक रूप से सुरक्षित है? क्या कारखानों में कोई दुर्घटना या स्वास्थ्य को खतरा तो नहीं?',
    shortSummary: 'Certified trades adhere to strict National Occupational Standards (NOS) with mandatory PPE gear, circuit interlocks, and workplace insurance.',
    shortSummaryHi: 'प्रमाणित संस्थानों में आधुनिक सुरक्षा उपकरण (PPE), ऑटोमैटिक सेंसर और कर्मचारियों के लिए ईएसआई (ESIC) स्वास्थ्य बीमा अनिवार्य है।',
    evidencePoints: [
      'All recognized ITIs and NSTIs mandate safety modules: fire safety, electrical insulation, high-altitude harnesses, and eye shields.',
      'Organized factories are governed by the Factories Act 1948 and OSHA workplace standards with zero-accident safety audits.',
      'Every formal apprentice and employee receives ESIC (Employees State Insurance) medical coverage for self and dependent parents.'
    ],
    evidencePointsHi: [
      'ट्रेनिंग के दौरान अग्नि सुरक्षा, फर्स्ट-एड और प्रोटेक्टिव किट का कड़ा अभ्यास कराया जाता है।',
      'फैक्ट्री एक्ट के तहत हर प्लांट में सुरक्षा नियम लागू होते हैं जहाँ दुर्घटनाओं को रोकने के लिए सेंसर लगे होते हैं।',
      'नौकरी लगते ही ईएसआईसी (ESIC) के तहत बच्चे और माता-पिता दोनों का अस्पताल में मुफ्त इलाज कार्ड बनता है।'
    ],
    reassurance: 'Modern technical jobs are highly standardized and automated. Today’s machines have optical safety curtains and emergency cutoffs that protect workers continuously.',
    reassuranceHi: 'आजकल की नई मशीनें कंप्यूटर और सेंसर से लैस होती हैं जो हाथ पास आते ही अपने आप रुक जाती हैं। सुरक्षा सरकार की सर्वोच्च प्राथमिकता है।',
    governmentSafetyNets: [
      'ESIC (Employees State Insurance Corporation) comprehensive health cover for family',
      'Pradhan Mantri Suraksha Bima Yojana (PMSBY) accidental cover'
    ],
    governmentSafetyNetsHi: [
      'ईएसआईसी (ESIC) के जरिए पूरे परिवार के लिए फ्री मेडिकल सुरक्षा',
      'प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)'
    ],
    sourceAttribution: 'Directorate General of Factory Advice Service and Labour Institutes (DGFASLI)'
  },
  {
    id: 'concern-relocation',
    concernKey: 'relocation',
    question: 'Will my child have to leave our village/district and move to faraway expensive metro cities like Mumbai or Bengaluru?',
    questionHi: 'क्या बच्चे को घर-परिवार छोड़कर मुंबई, बेंगलुरु जैसे दूर-दराज के महंगे शहरों में जाना पड़ेगा?',
    shortSummary: 'Most vocational trades (Solar, Electrician, Auto, Healthcare, IT) have huge local demand right in Tier-2/Tier-3 districts and rural development blocks.',
    shortSummaryHi: 'सोलर, इलेक्ट्रीशियन, ऑटोमोबाइल, स्वास्थ्य सेवा और कंप्यूटर नेटवर्क जैसे कामों की भारी मांग आपके अपने जिले और नजदीकी कस्बों में ही उपलब्ध है।',
    evidencePoints: [
      'District-level industrialization schemes (ODOP - One District One Product) prioritize local technical hiring.',
      'Rural infrastructure programs like PM Surya Ghar (Solar Rooftop) and Jal Jeevan Mission have created hundreds of technician jobs in every development block.',
      'Self-employment in hometowns (repair center, electrical contracting, custom workshop) saves metro rent and living expenses, yielding higher net savings.'
    ],
    evidencePointsHi: [
      'एक जिला एक उत्पाद (ODOP) और स्थानीय औद्योगिक क्षेत्रों में स्थानीय युवाओं को पहली प्राथमिकता दी जाती है।',
      'पीएम सूर्य घर (सोलर) और हर घर जल जैसी सरकारी योजनाओं में हर ब्लॉक स्तर पर स्थानीय तकनीशियनों की आवश्यकता है।',
      'अपने जिले या घर के पास काम करने से बड़े शहर का किराया, खाना और रहने का भारी खर्च बचता है, जिससे बचत अधिक होती है।'
    ],
    reassurance: 'You can choose trades with strong local district absorption so your child can live at home or within 30-40 kilometers, staying connected with the family.',
    reassuranceHi: 'आप ऐसा ट्रेड चुन सकते हैं जिसकी मांग आपके अपने जिले में हो, ताकि बच्चा परिवार के पास ही रहकर सम्मानजनक आजीविका कमा सके।',
    governmentSafetyNets: [
      'District Industries Centre (DIC) local entrepreneurship assistance',
      'Gramin Skill Vikas Kendras in development blocks'
    ],
    governmentSafetyNetsHi: [
      'जिला उद्योग केंद्र (DIC) द्वारा स्थानीय रोजगार एवं स्वरोजगार सहायता',
      'ब्लॉक स्तर पर ग्रामीण कौशल विकास केंद्र'
    ],
    sourceAttribution: 'District Skill Development Plans (DSDP) - MSDE'
  }
];
