import { DistrictCluster } from '../types/career';

export const DISTRICT_CLUSTERS_DATA: DistrictCluster[] = [
  {
    state: 'Uttar Pradesh',
    district: 'Kanpur Nagar',
    districtHi: 'कानपुर नगर',
    keyIndustries: [
      'Leather & Footwear Export Cluster',
      'Defence Ordnance & Heavy Engineering',
      'Textiles & Garment Manufacturing',
      'Solar Rooftop Grid Infrastructure',
      'Chemicals & Plastics'
    ],
    topDemandedTrades: ['electrician', 'cnc-machinist', 'solar-technician', 'welder-fabricator', 'garment-fashion-tech'],
    governmentITIs: 6,
    privateITIs: 28,
    activeApprenticeships: 1420,
    notableEmployers: [
      'Ordnance Equipment Factory (OEF Kanpur)',
      'Lohia Corp Machinery',
      'Tata Power Solar Rooftop Partners',
      'Kanpur Metro Rail Corporation (UPMRC)',
      'Mirza International (Red Tape Footwear)'
    ],
    trainingCenters: [
      {
        name: 'Government ITI Pandu Nagar, Kanpur',
        type: 'Govt ITI',
        trades: ['Electrician', 'CNC Operator', 'Welder', 'Solar Technician'],
        contact: '0512-2296144 | itipandunagar@up.gov.in'
      },
      {
        name: 'National Skill Training Institute (NSTI Kanpur)',
        type: 'NSTI',
        trades: ['Advanced Tool & Die', 'Industrial Automation', 'Solar PV'],
        contact: '0512-2225144 | nstikanpur@dgt.gov.in'
      },
      {
        name: 'PMKK Skill Development Centre, Kalyanpur',
        type: 'PMKVY Center',
        trades: ['Healthcare GDA', 'EV Powertrain Assistant', 'IT Network Support'],
        contact: '+91 94520 11234'
      }
    ]
  },
  {
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    districtHi: 'वाराणसी',
    keyIndustries: [
      'Banarasi Handloom & Fashion Apparel',
      'Banaras Locomotive Works (BLW Indian Railways)',
      'Kisan Drone & Precision Agriculture Cluster',
      'Solar City Varanasi (Surya Ghar Pilot)',
      'Heritage Tourism & Healthcare Hub'
    ],
    topDemandedTrades: ['solar-technician', 'drone-technician', 'healthcare-gda', 'garment-fashion-tech', 'it-network-technician'],
    governmentITIs: 4,
    privateITIs: 19,
    activeApprenticeships: 1180,
    notableEmployers: [
      'Banaras Locomotive Works (BLW)',
      'Varanasi Smart City Solar Projects',
      'Apex & Heritage Super Speciality Hospitals',
      'Kisan Drones Agrico Hub',
      'Amul Banas Dairy Plant Varanasi'
    ],
    trainingCenters: [
      {
        name: 'Government ITI Karaundi, Varanasi',
        type: 'Govt ITI',
        trades: ['Solar PV Technician', 'Electrician', 'Electronics Mechanic'],
        contact: '0542-2570198'
      },
      {
        name: 'NSTI (W) Varanasi (Women Specialized Campus)',
        type: 'NSTI',
        trades: ['Beauty & Wellness', 'Apparel CAD & Garments', 'IT Network'],
        contact: '0542-2310892'
      },
      {
        name: 'DDU Kaushal Kendra, BHU Campus',
        type: 'Industry Partner Center',
        trades: ['Healthcare Assistant', 'Food Quality Testing'],
        contact: '+91 98390 44551'
      }
    ]
  },
  {
    state: 'Maharashtra',
    district: 'Pune',
    districtHi: 'पुणे',
    keyIndustries: [
      'Automotive & EV Hub (Tata, Bajaj, Bharat Forge)',
      'Precision CNC Engineering & Defense Machinery',
      'Renewable Energy & Solar Parks',
      'IT Software, Hardware & Data Centers'
    ],
    topDemandedTrades: ['ev-technician', 'cnc-machinist', 'automotive-service-tech', 'it-network-technician', 'electrician'],
    governmentITIs: 8,
    privateITIs: 42,
    activeApprenticeships: 3850,
    notableEmployers: [
      'Tata Motors EV Plant Pimpri',
      'Bajaj Auto Akurdi',
      'Bharat Forge Mundhwa',
      'Thermax India Energy',
      'KPIT Technologies'
    ],
    trainingCenters: [
      {
        name: 'Government ITI Aundh, Pune',
        type: 'Govt ITI',
        trades: ['EV Diagnostics', 'CNC Machining', 'Mechatronics'],
        contact: '020-25881234'
      },
      {
        name: 'Tata Motors Apprenticeship Training School, Pimpri',
        type: 'Industry Partner Center',
        trades: ['Automotive Service Tech', 'EV Powertrain', 'Robotic Welding'],
        contact: '020-66133200'
      }
    ]
  },
  {
    state: 'Rajasthan',
    district: 'Jaipur',
    districtHi: 'जयपुर',
    keyIndustries: [
      'Solar Parks & Renewable Grid Development',
      'Gems, Jewelry & Stone Craft Precision',
      'Apparel & Textile Exports (Sitapura)',
      'Healthcare Tourism & Multispeciality Hospitals'
    ],
    topDemandedTrades: ['solar-technician', 'garment-fashion-tech', 'healthcare-gda', 'drone-technician', 'electrician'],
    governmentITIs: 7,
    privateITIs: 31,
    activeApprenticeships: 1690,
    notableEmployers: [
      'Adani Green Energy Solar Substation',
      'Sitapura Apparel SEZ Units',
      'Mahatma Gandhi Medical College & Hospital',
      'Rajasthan State Road Transport Corp (RSRTC)'
    ],
    trainingCenters: [
      {
        name: 'Government ITI Bani Park, Jaipur',
        type: 'Govt ITI',
        trades: ['Solar PV Installation', 'Electrician', 'Draftsman'],
        contact: '0141-2200451'
      }
    ]
  },
  {
    state: 'Gujarat',
    district: 'Surat',
    districtHi: 'सूरत',
    keyIndustries: [
      'Textile Weaving, Dyeing & Garment Processing',
      'Diamond Laser Processing & Heavy Machinery',
      'Hazira Port & Petrochemical Pipe Fabrication',
      'Solar Industrial Rooftop Installations'
    ],
    topDemandedTrades: ['welder-fabricator', 'garment-fashion-tech', 'solar-technician', 'cnc-machinist'],
    governmentITIs: 5,
    privateITIs: 24,
    activeApprenticeships: 2400,
    notableEmployers: [
      'Larsen & Toubro (L&T Heavy Engineering Hazira)',
      'Reliance Industries Hazira Complex',
      'Garden Vareli Textiles',
      'Adani Ports & SEZ'
    ],
    trainingCenters: [
      {
        name: 'Government ITI Majura Gate, Surat',
        type: 'Govt ITI',
        trades: ['Heavy Fabrication Welder', 'CNC Milling', 'Solar PV'],
        contact: '0261-2651234'
      }
    ]
  },
  {
    state: 'Bihar',
    district: 'Patna',
    districtHi: 'पटना',
    keyIndustries: [
      'Jal-Jeevan-Hariyali Solar Installations',
      'Automotive & Commercial Vehicle Service Hub',
      'Healthcare & Nursing Network (AIIMS & PMCH)',
      'Kisan Drones & Agro-Logistic Centers'
    ],
    topDemandedTrades: ['solar-technician', 'healthcare-gda', 'automotive-service-tech', 'drone-technician', 'it-network-technician'],
    governmentITIs: 5,
    privateITIs: 27,
    activeApprenticeships: 980,
    notableEmployers: [
      'Bihar State Power Holding Company (BSPHCL)',
      'Patna Metro Rail Project',
      'Paras HMRI Hospital & Medanta Patna',
      'Tata Motors Commercial Workshop Digha'
    ],
    trainingCenters: [
      {
        name: 'Government ITI Digha Ghat, Patna',
        type: 'Govt ITI',
        trades: ['Electrician', 'Solar PV Installer', 'Motor Mechanic'],
        contact: '0612-2560124'
      }
    ]
  }
];
