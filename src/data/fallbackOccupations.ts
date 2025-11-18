/**
 * Fallback occupation and program data for when backend is unavailable.
 * This allows the demo to work without a deployed database.
 */

import type { Program } from '@/services/occupationService';

export interface FallbackOccupation {
  onet_code: string;
  title: string;
  description: string;
  median_salary: number;
  growth_outlook: string;
}

// Sample occupations covering various career paths
export const fallbackOccupations: Record<string, FallbackOccupation> = {
  '15-1252.00': {
    onet_code: '15-1252.00',
    title: 'Software Developers',
    description: 'Research, design, and develop computer and network software or specialized utility programs. Analyze user needs and develop software solutions, applying principles and techniques of computer science, engineering, and mathematical analysis.',
    median_salary: 110140,
    growth_outlook: 'Much faster than average'
  },
  '29-1141.00': {
    onet_code: '29-1141.00',
    title: 'Registered Nurses',
    description: 'Assess patient health problems and needs, develop and implement nursing care plans, and maintain medical records. Administer nursing care to ill, injured, convalescent, or disabled patients.',
    median_salary: 75330,
    growth_outlook: 'Faster than average'
  },
  '11-2021.00': {
    onet_code: '11-2021.00',
    title: 'Marketing Managers',
    description: 'Plan, direct, or coordinate marketing policies and programs, such as determining the demand for products and services offered by a firm and its competitors, and identify potential customers.',
    median_salary: 135900,
    growth_outlook: 'Faster than average'
  },
  '25-2021.00': {
    onet_code: '25-2021.00',
    title: 'Elementary School Teachers',
    description: 'Teach students basic academic, social, and other formative skills in public or private schools at the elementary level.',
    median_salary: 60660,
    growth_outlook: 'Average'
  },
  '13-2011.00': {
    onet_code: '13-2011.00',
    title: 'Accountants and Auditors',
    description: 'Examine, analyze, and interpret accounting records to prepare financial statements, give advice, or audit and evaluate statements prepared by others.',
    median_salary: 73560,
    growth_outlook: 'Average'
  },
  '19-3033.00': {
    onet_code: '19-3033.00',
    title: 'Clinical and Counseling Psychologists',
    description: 'Diagnose or evaluate mental and emotional disorders of individuals through observation, interview, and psychological tests, and formulate and administer programs of treatment.',
    median_salary: 81040,
    growth_outlook: 'Faster than average'
  },
  '27-3031.00': {
    onet_code: '27-3031.00',
    title: 'Public Relations Specialists',
    description: 'Promote or create an intended public image for individuals, groups, or organizations. May write or select material for release to various communications media.',
    median_salary: 62810,
    growth_outlook: 'Average'
  },
  '17-2051.00': {
    onet_code: '17-2051.00',
    title: 'Civil Engineers',
    description: 'Perform engineering duties in planning, designing, and overseeing construction and maintenance of building structures and facilities, such as roads, railroads, airports, bridges, harbors, channels, dams, irrigation projects, pipelines, power plants, and water and sewage systems.',
    median_salary: 88570,
    growth_outlook: 'Average'
  },
  '13-1161.00': {
    onet_code: '13-1161.00',
    title: 'Market Research Analysts',
    description: 'Research conditions in local, regional, national, or online markets to determine potential sales of products or services. May gather information on competitors, prices, sales, and methods of marketing and distribution.',
    median_salary: 63790,
    growth_outlook: 'Much faster than average'
  },
  '21-1093.00': {
    onet_code: '21-1093.00',
    title: 'Social Workers',
    description: 'Provide social services and assistance to improve the social and psychological functioning of children and their families and to maximize the family well-being and the academic functioning of children.',
    median_salary: 51760,
    growth_outlook: 'Faster than average'
  },
  '27-1024.00': {
    onet_code: '27-1024.00',
    title: 'Graphic Designers',
    description: 'Design or create graphics to meet specific commercial or promotional needs, such as packaging, displays, or logos. May use a variety of mediums to achieve artistic or decorative effects.',
    median_salary: 53380,
    growth_outlook: 'Average'
  },
  '15-1244.00': {
    onet_code: '15-1244.00',
    title: 'Network and Computer Systems Administrators',
    description: 'Install, configure, and maintain an organizations local area network (LAN), wide area network (WAN), data communications network, operating systems, and physical and virtual servers.',
    median_salary: 84810,
    growth_outlook: 'Average'
  },
  '19-2041.00': {
    onet_code: '19-2041.00',
    title: 'Environmental Scientists and Specialists',
    description: 'Conduct research or perform investigation for the purpose of identifying, abating, or eliminating sources of pollutants or hazards that affect either the environment or public health.',
    median_salary: 73230,
    growth_outlook: 'Average'
  },
  '29-1171.00': {
    onet_code: '29-1171.00',
    title: 'Nurse Practitioners',
    description: 'Diagnose and treat acute, episodic, or chronic illness, independently or as part of a healthcare team. May focus on health promotion and disease prevention.',
    median_salary: 111680,
    growth_outlook: 'Much faster than average'
  },
  '41-3099.00': {
    onet_code: '41-3099.00',
    title: 'Sales Representatives',
    description: 'Sell goods or services to businesses and individuals. Contact customers and explain features and merits of products or services.',
    median_salary: 62890,
    growth_outlook: 'Average'
  }
};

// Fallback programs for each occupation
export const fallbackPrograms: Record<string, Program[]> = {
  '15-1252.00': [
    {
      id: 'prog-cs-cert-1',
      name: 'Web Development Certificate',
      description: 'Intensive certificate program covering HTML, CSS, JavaScript, and modern frameworks.',
      pathway_id: 'pathway-tech',
      institution_id: 'inst-honcc',
      degree_type: 'Certificate of Competence',
      duration_years: 0.5,
      total_credits: 15,
      cost_per_credit: 135,
      program_url: 'https://www.honolulu.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['Online', 'Evening']
    },
    {
      id: 'prog-cs-as-1',
      name: 'AS - Information Technology',
      description: 'Associate degree covering networking, databases, programming, and web development.',
      pathway_id: 'pathway-tech',
      institution_id: 'inst-leeward',
      degree_type: 'Associate in Science',
      duration_years: 2,
      total_credits: 60,
      cost_per_credit: 135,
      program_url: 'https://www.leeward.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person', 'Online']
    },
    {
      id: 'prog-cs-bs-1',
      name: 'BS - Computer Science',
      description: 'Comprehensive CS program covering software engineering, algorithms, and systems.',
      pathway_id: 'pathway-tech',
      institution_id: 'inst-uhm',
      degree_type: 'Bachelor of Science',
      duration_years: 4,
      total_credits: 124,
      cost_per_credit: 348,
      program_url: 'https://www.hawaii.edu/ics/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person', 'Hybrid']
    }
  ],
  '29-1141.00': [
    {
      id: 'prog-nursing-cert-1',
      name: 'Practical Nursing Certificate',
      description: 'Certificate program preparing students for Licensed Practical Nurse certification.',
      pathway_id: 'pathway-health',
      institution_id: 'inst-kapcc',
      degree_type: 'Certificate',
      duration_years: 1,
      total_credits: 30,
      cost_per_credit: 135,
      program_url: 'https://www.kapiolani.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person']
    },
    {
      id: 'prog-nursing-as-1',
      name: 'AS - Nursing',
      description: 'Associate degree leading to Registered Nurse licensure.',
      pathway_id: 'pathway-health',
      institution_id: 'inst-kapcc',
      degree_type: 'Associate in Science',
      duration_years: 2,
      total_credits: 65,
      cost_per_credit: 135,
      program_url: 'https://www.kapiolani.hawaii.edu/',
      program_links: [],
      prerequisites: ['Anatomy & Physiology', 'Microbiology'],
      delivery_modes: ['In-person', 'Clinical']
    },
    {
      id: 'prog-nursing-bsn-1',
      name: 'BSN - Nursing',
      description: 'Bachelor of Science in Nursing with clinical experiences across specialties.',
      pathway_id: 'pathway-health',
      institution_id: 'inst-uhm',
      degree_type: 'Bachelor of Science',
      duration_years: 4,
      total_credits: 120,
      cost_per_credit: 348,
      program_url: 'https://nursing.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person', 'Clinical']
    }
  ],
  '11-2021.00': [
    {
      id: 'prog-marketing-cert-1',
      name: 'Digital Marketing Certificate',
      description: 'Short-term certificate in social media, SEO, and digital advertising.',
      pathway_id: 'pathway-business',
      institution_id: 'inst-honcc',
      degree_type: 'Certificate',
      duration_years: 0.5,
      total_credits: 12,
      cost_per_credit: 135,
      program_url: 'https://www.honolulu.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['Online']
    },
    {
      id: 'prog-marketing-as-1',
      name: 'AS - Business',
      description: 'Associate degree with focus on business fundamentals and marketing.',
      pathway_id: 'pathway-business',
      institution_id: 'inst-windward',
      degree_type: 'Associate in Science',
      duration_years: 2,
      total_credits: 60,
      cost_per_credit: 135,
      program_url: 'https://www.windward.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person', 'Hybrid']
    },
    {
      id: 'prog-marketing-bba-1',
      name: 'BBA - Marketing',
      description: 'Bachelor of Business Administration with marketing concentration.',
      pathway_id: 'pathway-business',
      institution_id: 'inst-uhm',
      degree_type: 'Bachelor of Business Administration',
      duration_years: 4,
      total_credits: 120,
      cost_per_credit: 348,
      program_url: 'https://shidler.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person']
    }
  ],
  '25-2021.00': [
    {
      id: 'prog-education-as-1',
      name: 'AS - Liberal Arts (Education Track)',
      description: 'Associate degree providing foundation for elementary education.',
      pathway_id: 'pathway-education',
      institution_id: 'inst-leeward',
      degree_type: 'Associate in Arts',
      duration_years: 2,
      total_credits: 60,
      cost_per_credit: 135,
      program_url: 'https://www.leeward.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person', 'Hybrid']
    },
    {
      id: 'prog-education-bed-1',
      name: 'BEd - Elementary Education',
      description: 'Bachelor of Education leading to teacher certification for grades K-6.',
      pathway_id: 'pathway-education',
      institution_id: 'inst-uhm',
      degree_type: 'Bachelor of Education',
      duration_years: 4,
      total_credits: 124,
      cost_per_credit: 348,
      program_url: 'https://coe.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person', 'Field Experience']
    }
  ],
  '13-2011.00': [
    {
      id: 'prog-accounting-as-1',
      name: 'AS - Accounting',
      description: 'Associate degree covering accounting principles, bookkeeping, and tax preparation.',
      pathway_id: 'pathway-business',
      institution_id: 'inst-honcc',
      degree_type: 'Associate in Science',
      duration_years: 2,
      total_credits: 62,
      cost_per_credit: 135,
      program_url: 'https://www.honolulu.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person', 'Hybrid']
    },
    {
      id: 'prog-accounting-bba-1',
      name: 'BBA - Accounting',
      description: 'Bachelor of Business Administration preparing for CPA certification.',
      pathway_id: 'pathway-business',
      institution_id: 'inst-uhm',
      degree_type: 'Bachelor of Business Administration',
      duration_years: 4,
      total_credits: 120,
      cost_per_credit: 348,
      program_url: 'https://shidler.hawaii.edu/',
      program_links: [],
      prerequisites: [],
      delivery_modes: ['In-person']
    }
  ]
};

// Generate fallback programs for all occupations
Object.keys(fallbackOccupations).forEach(onetCode => {
  if (!fallbackPrograms[onetCode]) {
    // Provide generic programs if specific ones aren't defined
    fallbackPrograms[onetCode] = [
      {
        id: `prog-${onetCode}-generic`,
        name: 'Related Certificate Program',
        description: `Certificate program related to ${fallbackOccupations[onetCode].title}`,
        pathway_id: 'pathway-general',
        institution_id: 'inst-uhsystem',
        degree_type: 'Certificate',
        duration_years: 1,
        total_credits: 24,
        cost_per_credit: 135,
        program_url: 'https://www.hawaii.edu/',
        program_links: [],
        prerequisites: [],
        delivery_modes: ['In-person']
      }
    ];
  }
});
