// Article labels are retained from the accepted list; URLs are from the saved original capture.
export const articlePaths = [
 '/blog/fda-hyperbaric-chambers-wellness-devices-not-exempt',
 '/post/hyperbaric-oxygen-therapy-for-longevity',
 '/post/hbot-for-brain-injury-what-clinical-trials-show',
 '/post/hyperbaric-oxygen-therapy-for-long-covid-research',
 '/post/does-insurance-cover-hyperbaric-oxygen-therapy',
 '/post/starting-an-hbot-business-clinic-setup-guide',
 '/post/hbot-for-pets-veterinary-hyperbaric-therapy',
 '/post/why-russell-wilson-spends-over-1-million-a-year-on-his-body',
 '/post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy',
 '/post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford',
 '/post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery',
 '/post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance',
 '/post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover',
 '/post/lebron-james-uses-hyperbaric-oxygen-therapy',
 '/post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports'
];
export const articles = [
 ['Safety and Regulation','November 5, 2026','FDA Guidance: Hyperbaric Chambers Sold for Wellness Still Require Clearance Under Medical Device Regulations','The FDA explains that Class II hyperbaric chambers need 510(k) clearance, including equipment marketed for wellness rather than for clinical treatment.'],
 ['Research','September 17, 2026','Hyperbaric Oxygen and Longevity: A Look at the Evidence','A review of research on hyperbaric oxygen and biological markers of aging.'],
 ['Research','September 17, 2026','HBOT for Brain Injury: Clinical Trial Findings','Explore clinical trials examining hyperbaric oxygen and traumatic brain injury.'],
 ['Research','September 17, 2026','Long COVID and Hyperbaric Therapy: The Latest Research','A review of studies examining hyperbaric oxygen and persistent COVID symptoms.'],
 ['Buying Guides','September 17, 2026','Understanding Insurance Coverage for Hyperbaric Therapy','How public and private insurance plans approach coverage for hyperbaric therapy.'],
 ['For Clinics','September 17, 2026','Planning a Hyperbaric Clinic: A Practical Starting Guide','Equipment, room planning, and practical steps for starting a hyperbaric clinic.'],
 ['Research','September 17, 2026','Hyperbaric Therapy in Veterinary Practice','How veterinary teams use hyperbaric oxygen in the care of dogs, cats, and horses.'],
 ['Recovery and Performance','February 16, 2026','Inside an Elite Quarterback’s Recovery Routine','Explore the recovery routines professional football players have described.'],
 ['For Clinics','February 14, 2026','From Personal Recovery to Helping Others','How one practitioner turned a personal recovery journey into a hyperbaric practice.'],
 ['For Clinics','February 14, 2026','Clinical Hyperbaric Care in a Connecticut Practice','How a Connecticut practice integrates professional hard-shell hyperbaric chambers.'],
 ['Recovery and Performance','January 19, 2026','A Professional Football Player’s Hyperbaric Recovery','A football player’s account of chamber sessions during injury rehabilitation.'],
 ['Recovery and Performance','January 19, 2026','Advanced Recovery Technology in Professional Soccer','How professional soccer players include chamber sessions in recovery routines.'],
 ['Recovery and Performance','January 19, 2026','Recovery Stories from Athletes at the Highest Level','Athletes share their experiences with hyperbaric chambers and recovery routines.'],
 ['Recovery and Performance','January 15, 2026','Hyperbaric Oxygen in a Basketball Star’s Routine','Public reports on hyperbaric sessions in professional basketball recovery.'],
 ['Recovery and Performance','January 15, 2026','Why Hyperbaric Therapy Is Growing in Professional Sport','Why professional teams have added hyperbaric chambers to their recovery programs.']
];
export const pathFor = title => articlePaths[articles.findIndex(article => article[2] === title)] || '/blog';

export const productDetails = [
 {slug:'fortius-420',name:'Fortius 420',type:'Clinical Chamber',tagline:'Power, Precision, and Performance',pressure:'Up to 4.0 ATA',diameter:'42 inches',weight:'1,250 lbs',construction:'Reinforced steel',photo:'homepage/updated/carousel-fortius-420-product.webp',detail:'Fortius420/updated/fortius-digital-display-detail.webp',lifestyle:'Fortius420/updated/fortius-brick-studio-render.webp',description:'A full-size clinical chamber with a spacious interior and a carefully designed control system. Explore the configuration, installation process, and support available for your practice.'},
 {slug:'fortius-420-exp',name:'Fortius 420 EXP',type:'Modular Clinical Chamber',tagline:'Clinical capability. A more flexible installation.',pressure:'Up to 4.0 ATA',diameter:'42 inches',weight:'Configuration dependent',construction:'Modular hard shell',photo:'homepage/updated/carousel-fortius-exp-render.webp',detail:'fortius420exp/updated/fortius-exp-detail-render.webp',lifestyle:'homepage/updated/fortius-brick-studio-render.webp',description:'A modular approach to the clinical chamber. Discuss access routes, available space, and the configuration that works for your installation with an OxyHealth specialist.'},
 {slug:'quamvis-320',name:'Quamvis 320',type:'Professional Portable Chamber',tagline:'Room to relax. Built for everyday use.',pressure:'1.3 ATA',diameter:'32 inches',weight:'Confirm with our team',construction:'Soft shell',photo:'Quamvis320/updated/quamvis-black-scene.webp',detail:'Quamvis320/updated/quamvis-black-scene.webp',lifestyle:'Quamvis320/updated/quamvis-jesus-hero-lifestyle.webp',description:'A portable chamber designed around comfort and practical operation. Explore its spacious interior, system components, and the support available for home and professional settings.'},
 {slug:'respiro-270',name:'Respiro 270',type:'Portable Chamber',tagline:'Comfort in a compact footprint.',pressure:'1.3 ATA',diameter:'27 inches',weight:'Confirm with our team',construction:'Soft shell',photo:'homepage/updated/carousel-respiro-diana-lifestyle.webp',detail:'homepage/updated/carousel-respiro-diana-lifestyle.webp',lifestyle:'homepage/updated/carousel-respiro-diana-lifestyle.webp',description:'A compact portable chamber for spaces where a smaller footprint matters. Discover the setup, accessories, and service that accompany your chamber.'},
 {slug:'vitaeris-320',name:'Vitaeris 320',type:'Portable Chamber',tagline:'Thoughtfully designed for home and clinic.',pressure:'1.3 ATA',diameter:'32 inches',weight:'Confirm with our team',construction:'Soft shell',photo:'Vitarous320/renders/vitaeris-room-b1.webp',detail:'Vitarous320/renders/vitaeris-room-c2.webp',lifestyle:'Vitarous320/renders/vitaeris-room-a4.webp',description:'A spacious portable design with room to settle in. Learn about the system, compare its features, and plan a supported installation for your home or practice.'}
];

export const productArticleRoutes = [
 ...productDetails.map(product=>({path:'/products/'+product.slug,title:product.name+' Hyperbaric Chamber',template:'product'})),
 ...articles.map((article,index)=>({path:articlePaths[index],title:article[2],template:'article'}))
];

export const articleSections = [
 ['Understanding device classification','Clearance and registration','Evaluating a wellness claim','Documentation for buyers','Checking model information','Safety and intended use','Questions for a supplier','Planning your next steps'],
 ['Research into biological aging','Understanding study design','Cellular markers and measured outcomes','Brain health and ongoing research','Pressure and the study environment','Home and clinical equipment','Limitations of the evidence','Questions for your healthcare provider'],
 ['The questions clinical trials explore','Participants and trial design','Understanding outcome measures','Pressure and treatment settings','Interpreting published findings','Limitations and further research','Discussing the evidence with your clinician'],
 ['Understanding persistent symptoms','How researchers design a trial','Measures of recovery and daily function','Comparing study populations','The role of clinical supervision','Reading results in context','Questions for future research'],
 ['Start with your insurance policy','Medical necessity and prior authorization','Documents to request from your provider','Questions about in-network care','Understanding out-of-pocket costs','Keeping a record of coverage decisions','Planning the next conversation'],
 ['Defining your practice and services','Planning the treatment space','Comparing chamber configurations','Staff training and operational readiness','Service and ongoing maintenance','Building a practical budget','Preparing for installation'],
 ['Hyperbaric care in veterinary settings','The veterinary team and assessment','Equipment and the treatment environment','Monitoring and day-to-day operation','Reading veterinary research','Questions for a veterinary professional','Further resources']
];

export const articleImages = [
 'Vitarous320/renders/vitaeris-room-a4.webp','Vitarous320/renders/vitaeris-room-b1.webp',
 'Fortius420/updated/fortius-brick-studio-render.webp','Vitarous320/renders/vitaeris-room-c2.webp',
 'Vitarous320/renders/vitaeris-room-a4.webp','Quamvis320/updated/quamvis-black-scene.webp',
 'homepage/updated/carousel-respiro-diana-lifestyle.webp',
 'resources/russell_wilson.webp','resources/coryn_carver.webp','resources/md_hyperbaric_stamford.webp',
 'resources/mark_andrews.webp','resources/neymar_chamber.webp','resources/terrell_owens.webp',
 'resources/lebron_lakers.avif','resources/lebron_chamber.webp'
];

// Hierarchy and paragraph lengths from the read-only source outlines in
// live-source-articles.json. Copy is paraphrased; colors and geometry remain unverified.
export const researchArticleProfiles = {
  "1": {
    "sections": [
      {
        "title": "A landmark study of telomeres",
        "paragraphs": [
          62,
          68,
          16,
          64,
          25,
          73
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Stem cells and tissue regeneration",
        "paragraphs": [
          60,
          63,
          61
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Mitochondria and cellular energy",
        "paragraphs": [
          52,
          55,
          62
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Cognitive health in later life",
        "paragraphs": [
          67,
          59,
          55,
          35
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Alternating oxygen conditions",
        "paragraphs": [
          64,
          21,
          45,
          23,
          75
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Chamber options for longevity research",
        "paragraphs": [
          51,
          67,
          59,
          60
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Limits and considerations",
        "paragraphs": [
          34,
          48,
          50,
          44,
          63
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Directions for future research",
        "paragraphs": [
          60,
          49,
          45
        ],
        "groups": [],
        "bullets": []
      }
    ],
    "references": [],
    "faq": [
      {
        "title": "How does longevity research approach hyperbaric therapy?",
        "paragraphs": [
          44,
          34
        ]
      },
      {
        "title": "What did the telomere study examine?",
        "paragraphs": [
          69,
          24
        ]
      },
      {
        "title": "How should claims about aging be interpreted?",
        "paragraphs": [
          53,
          37
        ]
      },
      {
        "title": "What questions do stem cell studies explore?",
        "paragraphs": [
          61,
          16
        ]
      },
      {
        "title": "Why do researchers study alternating oxygen conditions?",
        "paragraphs": [
          44,
          31
        ]
      },
      {
        "title": "How are study schedules designed?",
        "paragraphs": [
          64,
          19
        ]
      },
      {
        "title": "How does home equipment compare with research settings?",
        "paragraphs": [
          74,
          17
        ]
      },
      {
        "title": "What regulatory limitations should readers understand?",
        "paragraphs": [
          50,
          33
        ]
      }
    ],
    "related": [
      [
        "Longevity research",
        "/hyperbaric-therapy-anti-aging"
      ],
      [
        "Cognitive health research",
        "/hyperbaric-therapy-brain-health"
      ],
      [
        "Chamber benefits",
        "/hyperbaric-chamber-benefits"
      ],
      [
        "Chambers for home use",
        "/home-hyperbaric-chamber"
      ]
    ],
    "cta": {
      "title": "Explore Your Chamber Options",
      "label": "Explore Chambers",
      "href": "/products/vitaeris-320"
    }
  },
  "2": {
    "sections": [
      {
        "title": "Why brain injury is being studied",
        "paragraphs": [
          60,
          22,
          59,
          28
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Possible pathways in brain health",
        "paragraphs": [
          39
        ],
        "groups": [
          {
            "title": "Oxygen delivery in brain tissue",
            "paragraphs": [
              55,
              25
            ]
          },
          {
            "title": "Inflammation and neurological research",
            "paragraphs": [
              57,
              22
            ]
          },
          {
            "title": "Research into neuroplasticity",
            "paragraphs": [
              40,
              64
            ]
          }
        ],
        "bullets": []
      },
      {
        "title": "Published brain injury research",
        "paragraphs": [
          33
        ],
        "groups": [
          {
            "title": "Defense-funded clinical trials",
            "paragraphs": [
              59,
              49,
              59
            ]
          },
          {
            "title": "Studies of cerebral blood flow",
            "paragraphs": [
              54,
              29,
              64
            ]
          },
          {
            "title": "Research into post-concussion symptoms",
            "paragraphs": [
              70,
              65
            ]
          }
        ],
        "bullets": []
      },
      {
        "title": "Understanding the limits of the evidence",
        "paragraphs": [
          44,
          39,
          23
        ],
        "groups": [],
        "bullets": [
          39,
          28,
          38,
          43,
          33
        ]
      },
      {
        "title": "Pressurized oxygen and brain tissue",
        "paragraphs": [
          67,
          57,
          28,
          64,
          27
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Equipment used in research",
        "paragraphs": [
          37,
          52,
          65,
          48
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Medical information and individual advice",
        "paragraphs": [
          51,
          44,
          56
        ],
        "groups": [],
        "bullets": []
      }
    ],
    "references": [
      "Boussi-Gross and colleagues (2013): a trial examining persistent post-concussion symptoms.",
      "Cifu and colleagues (2014): three-month outcomes following blast-related injury.",
      "Hadanny and colleagues (2022): research into cognition following stroke.",
      "Harch and colleagues (2012): an early study of blast injury and post-traumatic symptoms.",
      "Huang and Bhatt (2016): a review of proposed neuroinflammatory mechanisms."
    ],
    "faq": [
      {
        "title": "What is the regulatory status for brain injury?",
        "paragraphs": [
          59
        ]
      },
      {
        "title": "How should the available trial results be understood?",
        "paragraphs": [
          56,
          21
        ]
      },
      {
        "title": "Which possible mechanisms are being studied?",
        "paragraphs": [
          60,
          16
        ]
      },
      {
        "title": "Which injury types have researchers investigated?",
        "paragraphs": [
          60
        ]
      },
      {
        "title": "What pressure settings do research protocols describe?",
        "paragraphs": [
          68
        ]
      },
      {
        "title": "Which safety questions should be discussed with a clinician?",
        "paragraphs": [
          62
        ]
      },
      {
        "title": "How do session schedules vary between studies?",
        "paragraphs": [
          68
        ]
      },
      {
        "title": "Where can readers explore the research further?",
        "paragraphs": [
          60
        ]
      }
    ],
    "related": [
      [
        "Cognitive health research",
        "/hyperbaric-therapy-brain-health"
      ],
      [
        "Chamber benefits",
        "/hyperbaric-chamber-benefits"
      ],
      [
        "Side effects and precautions",
        "/hyperbaric-chamber-side-effects"
      ],
      [
        "Recovery and performance",
        "/hyperbaric-therapy-athletic-recovery"
      ]
    ],
    "cta": {
      "title": "Explore Your Chamber Options",
      "label": "Explore Chambers",
      "href": "/products/vitaeris-320"
    }
  },
  "3": {
    "sections": [
      {
        "title": "Understanding post-COVID symptoms",
        "paragraphs": [
          66,
          60,
          59
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "A randomized trial published in 2022",
        "paragraphs": [
          63,
          54,
          25,
          51,
          21,
          55,
          50
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Possible pathways in post-COVID recovery",
        "paragraphs": [
          37
        ],
        "groups": [
          {
            "title": "Tissue oxygenation",
            "paragraphs": [
              68,
              25
            ]
          },
          {
            "title": "Neuroinflammation",
            "paragraphs": [
              45,
              45
            ]
          },
          {
            "title": "Mitochondrial function",
            "paragraphs": [
              56,
              24
            ]
          },
          {
            "title": "Blood vessels and tissue repair",
            "paragraphs": [
              76,
              23
            ]
          }
        ],
        "bullets": []
      },
      {
        "title": "Further published research",
        "paragraphs": [
          58,
          23,
          55,
          18,
          59
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "The principles of pressurized oxygen",
        "paragraphs": [
          56,
          18,
          67,
          50
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Limitations and practical considerations",
        "paragraphs": [
          23
        ],
        "groups": [],
        "bullets": [
          44,
          37,
          34,
          34,
          34
        ]
      },
      {
        "title": "Chamber options and further information",
        "paragraphs": [
          47,
          51,
          39
        ],
        "groups": [],
        "bullets": []
      }
    ],
    "references": [
      "Zilberman-Itskovich and colleagues (2022): a randomized trial of post-COVID symptoms.",
      "World Health Organization (2021): a clinical case definition of post-COVID condition.",
      "Robbins and colleagues (2021): early evaluation of hyperbaric therapy for long COVID."
    ],
    "faq": [
      {
        "title": "What is the regulatory status for post-COVID symptoms?",
        "paragraphs": [
          75
        ]
      },
      {
        "title": "What did the randomized study in 2022 examine?",
        "paragraphs": [
          56,
          34
        ]
      },
      {
        "title": "Which neurological mechanisms are being studied?",
        "paragraphs": [
          60,
          20
        ]
      },
      {
        "title": "How were sessions scheduled in the research?",
        "paragraphs": [
          57,
          28
        ]
      },
      {
        "title": "Which persistent symptoms have studies measured?",
        "paragraphs": [
          63,
          15
        ]
      },
      {
        "title": "How do home and clinical research settings differ?",
        "paragraphs": [
          54,
          29
        ]
      },
      {
        "title": "How conclusive is the current evidence?",
        "paragraphs": [
          61,
          26
        ]
      },
      {
        "title": "Who can help readers explore individual questions?",
        "paragraphs": [
          60,
          24
        ]
      }
    ],
    "related": [
      [
        "Post-COVID research",
        "/hyperbaric-therapy-long-covid"
      ],
      [
        "Cognitive health research",
        "/hyperbaric-therapy-brain-health"
      ],
      [
        "Inflammation research",
        "/hyperbaric-therapy-inflammation"
      ],
      [
        "Chamber benefits",
        "/hyperbaric-chamber-benefits"
      ]
    ],
    "cta": {
      "title": "Explore Your Chamber Options",
      "label": "Explore Chambers",
      "href": "/products/vitaeris-320"
    }
  },
  "5": {
    "sections": [
      {
        "title": "Demand for hyperbaric services",
        "paragraphs": [
          47,
          67,
          61,
          56
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Different types of hyperbaric practice",
        "paragraphs": [
          27,
          54,
          50,
          40,
          41,
          40
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Choosing equipment for a business",
        "paragraphs": [
          55
        ],
        "groups": [
          {
            "title": "Portable equipment for a practice",
            "paragraphs": [
              34,
              47,
              32,
              40
            ]
          },
          {
            "title": "Clinical equipment for medical facilities",
            "paragraphs": [
              22,
              45,
              47
            ]
          }
        ],
        "bullets": []
      },
      {
        "title": "Planning the treatment space",
        "paragraphs": [
          32,
          62,
          52,
          50,
          59
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Understanding regulatory requirements",
        "paragraphs": [
          31,
          56,
          48,
          21,
          48,
          21
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Staffing, training, and outreach",
        "paragraphs": [
          74,
          41,
          21,
          41,
          49
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Planning equipment finance",
        "paragraphs": [
          43,
          58,
          61
        ],
        "groups": [],
        "bullets": []
      },
      {
        "title": "Reviewing commercial equipment certifications",
        "paragraphs": [
          41,
          55,
          51,
          37,
          41,
          43
        ],
        "groups": [],
        "bullets": []
      }
    ],
    "references": [],
    "faq": [
      {
        "title": "Which business permissions should be reviewed?",
        "paragraphs": [
          58,
          25
        ]
      },
      {
        "title": "How should clinical oversight be planned?",
        "paragraphs": [
          64,
          7
        ]
      },
      {
        "title": "How much room will a practice need?",
        "paragraphs": [
          72,
          23
        ]
      },
      {
        "title": "Which equipment certifications should be checked?",
        "paragraphs": [
          69
        ]
      },
      {
        "title": "How can portable and clinical equipment be compared?",
        "paragraphs": [
          60,
          22
        ]
      },
      {
        "title": "What training should the team arrange?",
        "paragraphs": [
          52,
          17
        ]
      },
      {
        "title": "How can equipment purchases be financed?",
        "paragraphs": [
          65
        ]
      },
      {
        "title": "What should a practice consider when planning outreach?",
        "paragraphs": [
          63,
          15
        ]
      }
    ],
    "related": [
      [
        "Hyperbaric equipment for business",
        "/hyperbaric-chamber-for-business"
      ],
      [
        "Choosing a chamber",
        "/hyperbaric-chamber-buying-guide"
      ],
      [
        "Planning the purchase cost",
        "/hyperbaric-chamber-cost"
      ],
      [
        "Financing options",
        "/finance"
      ]
    ],
    "cta": {
      "title": "Plan Your Hyperbaric Practice",
      "label": "Explore Equipment for Business",
      "href": "/hyperbaric-chamber-for-business"
    }
  }
};
