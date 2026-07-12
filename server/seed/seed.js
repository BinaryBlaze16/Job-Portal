import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
    ]);
    console.log('Existing data cleared.');

    // ==================== USERS ====================

    // 1 Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@jobportal.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1-555-000-0001',
    });
    console.log('Admin user created.');

    // 3 Employers
    const employers = await User.create([
      {
        name: 'Sarah Mitchell',
        email: 'sarah@techcorp.com',
        password: 'employer123',
        role: 'employer',
        phone: '+1-555-100-0001',
        companyName: 'TechCorp Solutions',
        companyDescription:
          'TechCorp Solutions is a leading technology company specializing in enterprise software development, cloud infrastructure, and AI-powered solutions. Founded in 2010, we serve Fortune 500 companies across the globe with innovative technology that drives business transformation.',
        website: 'https://techcorp.example.com',
        companySize: '500-1000',
        industry: 'Technology',
        companyLogo: '',
      },
      {
        name: 'James Rodriguez',
        email: 'james@creativestudios.com',
        password: 'employer123',
        role: 'employer',
        phone: '+1-555-200-0002',
        companyName: 'Creative Studios',
        companyDescription:
          'Creative Studios is an award-winning design agency that brings brands to life through compelling visual storytelling, UX/UI design, and digital marketing. Our team of 150+ creatives has delivered projects for startups and global brands alike.',
        website: 'https://creativestudios.example.com',
        companySize: '100-500',
        industry: 'Design',
        companyLogo: '',
      },
      {
        name: 'Priya Sharma',
        email: 'priya@dataflow.com',
        password: 'employer123',
        role: 'employer',
        phone: '+1-555-300-0003',
        companyName: 'DataFlow Analytics',
        companyDescription:
          'DataFlow Analytics provides cutting-edge data analytics and business intelligence solutions. We help organizations harness the power of their data through advanced machine learning, predictive analytics, and real-time dashboarding platforms.',
        website: 'https://dataflow.example.com',
        companySize: '200-500',
        industry: 'Data & Analytics',
        companyLogo: '',
      },
    ]);
    console.log('Employer users created.');

    // 5 Seekers
    const seekers = await User.create([
      {
        name: 'Alex Johnson',
        email: 'alex@email.com',
        password: 'seeker123',
        role: 'seeker',
        phone: '+1-555-400-0001',
        bio: 'Passionate full-stack developer with 4 years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Looking for challenging roles at innovative tech companies.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
        experience: [
          {
            title: 'Junior Full Stack Developer',
            company: 'WebDev Inc.',
            from: new Date('2020-06-01'),
            to: new Date('2022-08-31'),
            description:
              'Built and maintained RESTful APIs and React-based frontends for e-commerce platforms serving 50k+ users.',
          },
          {
            title: 'Full Stack Developer',
            company: 'CloudApps LLC',
            from: new Date('2022-09-01'),
            to: new Date('2024-12-31'),
            description:
              'Led development of microservices architecture and implemented CI/CD pipelines. Reduced deployment time by 60%.',
          },
        ],
        education: [
          {
            degree: 'B.S. Computer Science',
            institution: 'State University',
            year: 2020,
          },
        ],
      },
      {
        name: 'Maria Garcia',
        email: 'maria@email.com',
        password: 'seeker123',
        role: 'seeker',
        phone: '+1-555-400-0002',
        bio: 'Creative UI/UX designer with a keen eye for detail and a passion for creating intuitive, accessible user experiences. 5 years of experience in product design for SaaS platforms.',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'HTML', 'CSS', 'User Research', 'Prototyping', 'Design Systems'],
        experience: [
          {
            title: 'UI Designer',
            company: 'DesignHub',
            from: new Date('2019-03-01'),
            to: new Date('2021-12-31'),
            description:
              'Designed responsive web interfaces and mobile app screens for healthcare and fintech clients.',
          },
          {
            title: 'Senior UX Designer',
            company: 'ProductFirst',
            from: new Date('2022-01-01'),
            to: new Date('2024-11-30'),
            description:
              'Led UX research and design sprints. Improved user onboarding conversion rate by 35% through iterative design.',
          },
        ],
        education: [
          {
            degree: 'B.F.A. Graphic Design',
            institution: 'Art Institute',
            year: 2019,
          },
          {
            degree: 'UX Design Certificate',
            institution: 'Google / Coursera',
            year: 2020,
          },
        ],
      },
      {
        name: 'David Kim',
        email: 'david@email.com',
        password: 'seeker123',
        role: 'seeker',
        phone: '+1-555-400-0003',
        bio: 'Data scientist with strong background in machine learning and statistical analysis. Experienced in Python, R, and big data technologies. Passionate about turning data into actionable insights.',
        skills: ['Python', 'R', 'TensorFlow', 'PyTorch', 'SQL', 'Spark', 'Tableau', 'Machine Learning'],
        experience: [
          {
            title: 'Data Analyst',
            company: 'Analytics Corp',
            from: new Date('2021-01-01'),
            to: new Date('2023-06-30'),
            description:
              'Performed data analysis and created dashboards to track KPIs. Built predictive models for customer churn with 89% accuracy.',
          },
          {
            title: 'Data Scientist',
            company: 'ML Solutions',
            from: new Date('2023-07-01'),
            to: new Date('2025-03-31'),
            description:
              'Developed NLP models for sentiment analysis and recommendation engines. Processed datasets with 10M+ records.',
          },
        ],
        education: [
          {
            degree: 'M.S. Data Science',
            institution: 'Tech University',
            year: 2021,
          },
          {
            degree: 'B.S. Mathematics',
            institution: 'National University',
            year: 2019,
          },
        ],
      },
      {
        name: 'Emily Chen',
        email: 'emily@email.com',
        password: 'seeker123',
        role: 'seeker',
        phone: '+1-555-400-0004',
        bio: 'Digital marketing specialist with expertise in SEO, content strategy, and performance marketing. Managed campaigns with combined budgets exceeding $2M.',
        skills: ['SEO', 'Google Ads', 'Content Marketing', 'Social Media', 'Analytics', 'HubSpot', 'Copywriting'],
        experience: [
          {
            title: 'Marketing Coordinator',
            company: 'BrandBoost Agency',
            from: new Date('2020-09-01'),
            to: new Date('2023-03-31'),
            description:
              'Coordinated multi-channel marketing campaigns. Grew organic traffic by 120% through SEO optimization.',
          },
        ],
        education: [
          {
            degree: 'B.A. Marketing',
            institution: 'Business School',
            year: 2020,
          },
        ],
      },
      {
        name: 'Ryan Thompson',
        email: 'ryan@email.com',
        password: 'seeker123',
        role: 'seeker',
        phone: '+1-555-400-0005',
        bio: 'Experienced financial analyst with CFA Level II candidacy. Strong quantitative skills with expertise in financial modeling, valuation, and risk analysis.',
        skills: ['Financial Modeling', 'Excel', 'Python', 'Bloomberg', 'SQL', 'Risk Analysis', 'Valuation', 'VBA'],
        experience: [
          {
            title: 'Financial Analyst',
            company: 'Global Finance Group',
            from: new Date('2019-07-01'),
            to: new Date('2022-12-31'),
            description:
              'Built financial models for M&A transactions totaling $500M+. Performed DCF and comparable company analysis.',
          },
          {
            title: 'Senior Financial Analyst',
            company: 'Capital Investments',
            from: new Date('2023-01-01'),
            to: new Date('2025-04-30'),
            description:
              'Led quarterly forecasting and budgeting processes. Developed automated reporting tools saving 20 hours per month.',
          },
        ],
        education: [
          {
            degree: 'M.B.A. Finance',
            institution: 'Business University',
            year: 2019,
          },
          {
            degree: 'B.S. Economics',
            institution: 'Liberal Arts College',
            year: 2017,
          },
        ],
      },
    ]);
    console.log('Seeker users created.');

    // ==================== JOBS ====================

    const jobs = await Job.create([
      // TechCorp Solutions Jobs (employers[0])
      {
        title: 'Full Stack Developer',
        description:
          'We are looking for a talented Full Stack Developer to join our engineering team. You will work on building and maintaining web applications using modern JavaScript frameworks. The ideal candidate has strong experience with both frontend and backend technologies and thrives in a collaborative agile environment.',
        employer: employers[0]._id,
        companyName: 'TechCorp Solutions',
        location: 'San Francisco, CA',
        salaryMin: 110000,
        salaryMax: 150000,
        jobType: 'full-time',
        category: 'Technology',
        experienceLevel: 'mid',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'Git'],
        requirements: [
          '3+ years of full-stack development experience',
          'Proficiency in React and Node.js',
          'Experience with NoSQL databases (MongoDB preferred)',
          'Familiarity with CI/CD pipelines',
          'Strong problem-solving skills',
        ],
        responsibilities: [
          'Design, develop, and maintain web applications',
          'Write clean, testable, and well-documented code',
          'Collaborate with cross-functional teams on feature development',
          'Participate in code reviews and architecture discussions',
          'Mentor junior developers and contribute to team knowledge sharing',
        ],
        benefits: [
          'Competitive salary and equity package',
          'Health, dental, and vision insurance',
          'Flexible remote work options',
          '401(k) with company match',
          'Professional development budget',
          'Unlimited PTO',
        ],
        applicationDeadline: new Date('2026-09-30'),
        isActive: true,
      },
      {
        title: 'Senior Backend Engineer',
        description:
          'TechCorp Solutions is seeking a Senior Backend Engineer to architect and build scalable microservices. You will lead technical design decisions and drive our platform forward, working with cutting-edge technologies in a high-growth environment.',
        employer: employers[0]._id,
        companyName: 'TechCorp Solutions',
        location: 'San Francisco, CA',
        salaryMin: 140000,
        salaryMax: 190000,
        jobType: 'full-time',
        category: 'Technology',
        experienceLevel: 'senior',
        skills: ['Node.js', 'Python', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'GraphQL'],
        requirements: [
          '6+ years of backend development experience',
          'Expert-level knowledge of Node.js or Python',
          'Experience designing microservices architecture',
          'Proficiency with cloud platforms (AWS/GCP)',
          'Strong understanding of distributed systems',
        ],
        responsibilities: [
          'Architect and implement scalable backend services',
          'Lead technical design reviews and architecture decisions',
          'Optimize performance and ensure system reliability',
          'Define coding standards and best practices',
          'Collaborate with product and engineering leadership',
        ],
        benefits: [
          'Top-tier compensation and stock options',
          'Comprehensive benefits package',
          'Remote-first culture',
          'Conference attendance and learning budget',
          'Home office stipend',
        ],
        applicationDeadline: new Date('2026-10-15'),
        isActive: true,
      },
      {
        title: 'DevOps Engineer',
        description:
          'Join our infrastructure team as a DevOps Engineer. You will build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure the reliability and scalability of our platform serving millions of users.',
        employer: employers[0]._id,
        companyName: 'TechCorp Solutions',
        location: 'Austin, TX',
        salaryMin: 120000,
        salaryMax: 160000,
        jobType: 'full-time',
        category: 'Technology',
        experienceLevel: 'mid',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Python'],
        requirements: [
          '3+ years of DevOps/SRE experience',
          'Strong experience with AWS services',
          'Proficiency with containerization (Docker, Kubernetes)',
          'Infrastructure as Code experience (Terraform/CloudFormation)',
          'Scripting skills in Python or Bash',
        ],
        responsibilities: [
          'Build and maintain CI/CD pipelines',
          'Manage and optimize cloud infrastructure',
          'Implement monitoring and alerting solutions',
          'Automate operational tasks and workflows',
          'Ensure platform security and compliance',
        ],
        benefits: [
          'Competitive salary',
          'Full benefits package',
          'Relocation assistance',
          'On-call compensation',
          'Training and certification reimbursement',
        ],
        applicationDeadline: new Date('2026-09-15'),
        isActive: true,
      },
      {
        title: 'Frontend Developer Intern',
        description:
          'Kickstart your career with TechCorp Solutions! As a Frontend Developer Intern, you will gain hands-on experience building user interfaces with React and modern web technologies. Ideal for recent graduates or final-year students.',
        employer: employers[0]._id,
        companyName: 'TechCorp Solutions',
        location: 'Remote',
        salaryMin: 30000,
        salaryMax: 45000,
        jobType: 'internship',
        category: 'Technology',
        experienceLevel: 'entry',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
        requirements: [
          'Currently pursuing or recently completed CS degree',
          'Basic knowledge of HTML, CSS, and JavaScript',
          'Familiarity with React is a plus',
          'Eagerness to learn and grow',
          'Good communication skills',
        ],
        responsibilities: [
          'Assist in building frontend components',
          'Participate in daily standups and sprint planning',
          'Write unit tests for UI components',
          'Learn and apply best practices from senior developers',
          'Contribute to documentation and code reviews',
        ],
        benefits: [
          'Paid internship',
          'Mentorship from senior engineers',
          'Potential full-time offer',
          'Flexible schedule',
          'Remote work setup provided',
        ],
        applicationDeadline: new Date('2026-08-31'),
        isActive: true,
      },
      {
        title: 'Mobile App Developer',
        description:
          'We are hiring a Mobile App Developer to build cross-platform mobile applications using React Native. You will work closely with designers and backend engineers to deliver smooth, performant mobile experiences.',
        employer: employers[0]._id,
        companyName: 'TechCorp Solutions',
        location: 'New York, NY',
        salaryMin: 105000,
        salaryMax: 140000,
        jobType: 'full-time',
        category: 'Technology',
        experienceLevel: 'mid',
        skills: ['React Native', 'JavaScript', 'TypeScript', 'iOS', 'Android', 'Redux'],
        requirements: [
          '2+ years of mobile development experience',
          'Proficiency with React Native',
          'Experience publishing apps to App Store and Google Play',
          'Understanding of mobile UI/UX principles',
          'Knowledge of RESTful APIs',
        ],
        responsibilities: [
          'Develop and maintain cross-platform mobile applications',
          'Optimize app performance across devices',
          'Collaborate with design team on mobile UI implementation',
          'Integrate with backend APIs and third-party services',
          'Manage app releases and updates',
        ],
        benefits: [
          'Competitive salary',
          'Health and wellness benefits',
          'Hybrid work model',
          'Latest devices provided',
          'Team outings and events',
        ],
        applicationDeadline: new Date('2026-10-01'),
        isActive: true,
      },
      // Creative Studios Jobs (employers[1])
      {
        title: 'UI/UX Designer',
        description:
          'Creative Studios is looking for a talented UI/UX Designer to craft beautiful and intuitive user interfaces. You will lead the design process from research to high-fidelity prototypes, working on exciting projects for diverse clients.',
        employer: employers[1]._id,
        companyName: 'Creative Studios',
        location: 'Los Angeles, CA',
        salaryMin: 90000,
        salaryMax: 130000,
        jobType: 'full-time',
        category: 'Design',
        experienceLevel: 'mid',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
        requirements: [
          '3+ years of UI/UX design experience',
          'Strong portfolio demonstrating design process',
          'Proficiency in Figma or Adobe XD',
          'Experience with user research and usability testing',
          'Understanding of accessibility standards',
        ],
        responsibilities: [
          'Lead design process from concept to delivery',
          'Conduct user research and create personas',
          'Create wireframes, mockups, and interactive prototypes',
          'Build and maintain design systems',
          'Collaborate with developers on implementation',
        ],
        benefits: [
          'Creative and inspiring work environment',
          'Competitive compensation',
          'Full health benefits',
          'Design conference attendance',
          'Flexible work hours',
        ],
        applicationDeadline: new Date('2026-09-20'),
        isActive: true,
      },
      {
        title: 'Graphic Designer',
        description:
          'Join our creative team as a Graphic Designer. You will produce stunning visual assets for branding, marketing campaigns, and digital products. This role requires a strong aesthetic sense and versatility across design mediums.',
        employer: employers[1]._id,
        companyName: 'Creative Studios',
        location: 'Los Angeles, CA',
        salaryMin: 65000,
        salaryMax: 90000,
        jobType: 'full-time',
        category: 'Design',
        experienceLevel: 'entry',
        skills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Branding', 'Print Design'],
        requirements: [
          '1+ years of graphic design experience',
          'Proficiency in Adobe Creative Suite',
          'Strong understanding of typography and color theory',
          'Portfolio showcasing diverse design work',
          'Ability to work on multiple projects simultaneously',
        ],
        responsibilities: [
          'Create visual assets for digital and print media',
          'Design marketing collateral and social media graphics',
          'Develop branding packages for clients',
          'Maintain brand consistency across all deliverables',
          'Collaborate with copywriters and marketing team',
        ],
        benefits: [
          'Collaborative creative environment',
          'Health and dental insurance',
          'Annual design tool budget',
          'Gallery visits and creative workshops',
          'Hybrid work model',
        ],
        applicationDeadline: new Date('2026-09-10'),
        isActive: true,
      },
      {
        title: 'Motion Graphics Designer',
        description:
          'We are seeking a Motion Graphics Designer to bring our clients\' stories to life through animation and video content. You will create engaging animations for web, social media, and video platforms.',
        employer: employers[1]._id,
        companyName: 'Creative Studios',
        location: 'Remote',
        salaryMin: 80000,
        salaryMax: 115000,
        jobType: 'remote',
        category: 'Design',
        experienceLevel: 'mid',
        skills: ['After Effects', 'Cinema 4D', 'Premiere Pro', 'Animation', 'Storyboarding', 'Video Editing'],
        requirements: [
          '3+ years of motion design experience',
          'Expert in After Effects and Premiere Pro',
          'Experience with 3D animation tools is a plus',
          'Strong storytelling and visual narrative skills',
          'Ability to work independently and meet deadlines',
        ],
        responsibilities: [
          'Create motion graphics and animations for client projects',
          'Develop animated explainer videos and social media content',
          'Collaborate with creative directors on visual concepts',
          'Manage multiple projects with tight deadlines',
          'Stay current with motion design trends and tools',
        ],
        benefits: [
          'Fully remote position',
          'Competitive salary',
          'Equipment and software provided',
          'Flexible schedule',
          'Creative freedom on projects',
        ],
        applicationDeadline: new Date('2026-10-05'),
        isActive: true,
      },
      {
        title: 'Brand Strategist',
        description:
          'Creative Studios seeks a Brand Strategist to develop compelling brand narratives and positioning strategies for our diverse portfolio of clients. You will bridge the gap between creative execution and business objectives.',
        employer: employers[1]._id,
        companyName: 'Creative Studios',
        location: 'Los Angeles, CA',
        salaryMin: 85000,
        salaryMax: 120000,
        jobType: 'full-time',
        category: 'Marketing',
        experienceLevel: 'mid',
        skills: ['Brand Strategy', 'Market Research', 'Copywriting', 'Presentation', 'Competitive Analysis'],
        requirements: [
          '4+ years in brand strategy or brand marketing',
          'Strong analytical and creative thinking',
          'Excellent presentation and communication skills',
          'Experience with market research and consumer insights',
          'Portfolio of brand strategy case studies',
        ],
        responsibilities: [
          'Develop brand positioning and messaging frameworks',
          'Conduct competitive and market analysis',
          'Lead client workshops and brand discovery sessions',
          'Create strategic briefs for creative teams',
          'Measure brand performance and recommend optimizations',
        ],
        benefits: [
          'High-impact strategic role',
          'Collaborative team environment',
          'Full benefits package',
          'Professional development budget',
          'Quarterly team retreats',
        ],
        applicationDeadline: new Date('2026-09-25'),
        isActive: true,
      },
      // DataFlow Analytics Jobs (employers[2])
      {
        title: 'Data Scientist',
        description:
          'DataFlow Analytics is hiring a Data Scientist to develop predictive models and extract insights from complex datasets. You will work at the intersection of statistics, machine learning, and business strategy to solve challenging problems.',
        employer: employers[2]._id,
        companyName: 'DataFlow Analytics',
        location: 'Seattle, WA',
        salaryMin: 125000,
        salaryMax: 170000,
        jobType: 'full-time',
        category: 'Technology',
        experienceLevel: 'mid',
        skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics', 'Data Visualization'],
        requirements: [
          '3+ years of data science experience',
          'Strong proficiency in Python and ML frameworks',
          'Advanced knowledge of statistics and probability',
          'Experience with large-scale data processing',
          'MS or PhD in quantitative field preferred',
        ],
        responsibilities: [
          'Build and deploy machine learning models',
          'Analyze large datasets to extract actionable insights',
          'Collaborate with engineering team on model integration',
          'Present findings and recommendations to stakeholders',
          'Stay current with latest research and techniques',
        ],
        benefits: [
          'Industry-leading compensation',
          'Research and innovation time',
          'Comprehensive benefits',
          'Conference and publication support',
          'Flexible hybrid schedule',
        ],
        applicationDeadline: new Date('2026-10-20'),
        isActive: true,
      },
      {
        title: 'Data Engineer',
        description:
          'Join DataFlow Analytics as a Data Engineer and build the data infrastructure that powers our analytics platform. You will design and implement robust data pipelines that process billions of records daily.',
        employer: employers[2]._id,
        companyName: 'DataFlow Analytics',
        location: 'Seattle, WA',
        salaryMin: 115000,
        salaryMax: 155000,
        jobType: 'full-time',
        category: 'Technology',
        experienceLevel: 'mid',
        skills: ['Python', 'Spark', 'Airflow', 'SQL', 'AWS', 'Kafka', 'dbt'],
        requirements: [
          '3+ years of data engineering experience',
          'Proficiency in Python and SQL',
          'Experience with Apache Spark and Airflow',
          'Knowledge of data warehouse design patterns',
          'Familiarity with streaming data architectures',
        ],
        responsibilities: [
          'Design and implement scalable data pipelines',
          'Maintain and optimize data warehouse infrastructure',
          'Ensure data quality and reliability',
          'Collaborate with data scientists on data needs',
          'Implement data governance and security practices',
        ],
        benefits: [
          'Competitive salary and equity',
          'Full health benefits',
          'Learning and development budget',
          'Hybrid work model',
          'Team hackathon events',
        ],
        applicationDeadline: new Date('2026-10-10'),
        isActive: true,
      },
      {
        title: 'Business Intelligence Analyst',
        description:
          'We need a BI Analyst to transform raw data into meaningful business insights. You will create dashboards, reports, and analyses that drive data-informed decision making across the organization.',
        employer: employers[2]._id,
        companyName: 'DataFlow Analytics',
        location: 'Chicago, IL',
        salaryMin: 80000,
        salaryMax: 110000,
        jobType: 'full-time',
        category: 'Technology',
        experienceLevel: 'entry',
        skills: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Python', 'Data Modeling'],
        requirements: [
          '1+ years of BI or analytics experience',
          'Strong SQL skills',
          'Proficiency in Tableau or Power BI',
          'Understanding of data modeling concepts',
          'Excellent communication and presentation skills',
        ],
        responsibilities: [
          'Create and maintain interactive dashboards',
          'Perform ad-hoc data analysis for stakeholders',
          'Develop automated reporting solutions',
          'Identify trends and provide actionable recommendations',
          'Document data definitions and business logic',
        ],
        benefits: [
          'Growth-oriented environment',
          'Health and dental insurance',
          'Professional certification support',
          'Flexible hours',
          'Collaborative team culture',
        ],
        applicationDeadline: new Date('2026-09-30'),
        isActive: true,
      },
      {
        title: 'Machine Learning Engineer',
        description:
          'DataFlow Analytics is looking for a Machine Learning Engineer to bridge the gap between data science research and production systems. You will build scalable ML infrastructure and deploy models that serve real-time predictions.',
        employer: employers[2]._id,
        companyName: 'DataFlow Analytics',
        location: 'Remote',
        salaryMin: 135000,
        salaryMax: 180000,
        jobType: 'remote',
        category: 'Technology',
        experienceLevel: 'senior',
        skills: ['Python', 'MLOps', 'Docker', 'Kubernetes', 'TensorFlow', 'PyTorch', 'AWS SageMaker'],
        requirements: [
          '5+ years in ML engineering or related field',
          'Strong software engineering skills in Python',
          'Experience with ML model deployment and monitoring',
          'Proficiency with MLOps tools and practices',
          'Knowledge of distributed computing',
        ],
        responsibilities: [
          'Design and build ML model training and serving infrastructure',
          'Implement CI/CD pipelines for ML models',
          'Optimize model performance and latency',
          'Collaborate with data scientists on model productionization',
          'Establish ML engineering best practices',
        ],
        benefits: [
          'Top-tier remote compensation',
          'Fully remote work',
          'Generous equity package',
          'Home office budget',
          'Bi-annual team meetups',
        ],
        applicationDeadline: new Date('2026-11-01'),
        isActive: true,
      },
      {
        title: 'Product Manager - Analytics Platform',
        description:
          'Lead the product strategy for our flagship analytics platform. You will define the product roadmap, prioritize features, and work closely with engineering and design teams to deliver an exceptional user experience.',
        employer: employers[2]._id,
        companyName: 'DataFlow Analytics',
        location: 'Seattle, WA',
        salaryMin: 130000,
        salaryMax: 170000,
        jobType: 'full-time',
        category: 'Technology',
        experienceLevel: 'senior',
        skills: ['Product Management', 'Agile', 'Data Analytics', 'Roadmapping', 'Stakeholder Management'],
        requirements: [
          '5+ years of product management experience',
          'Experience with data/analytics products',
          'Strong understanding of agile methodologies',
          'Excellent communication and leadership skills',
          'Technical background preferred',
        ],
        responsibilities: [
          'Define and own the product roadmap',
          'Gather and prioritize product requirements',
          'Work with engineering and design to deliver features',
          'Analyze product metrics and user feedback',
          'Present product strategy to leadership',
        ],
        benefits: [
          'Strategic leadership role',
          'Competitive salary and equity',
          'Full benefits package',
          'Executive coaching',
          'Hybrid work flexibility',
        ],
        applicationDeadline: new Date('2026-10-15'),
        isActive: true,
      },
      // Additional diverse jobs
      {
        title: 'Digital Marketing Manager',
        description:
          'TechCorp Solutions is hiring a Digital Marketing Manager to lead our marketing efforts across digital channels. You will develop and execute marketing strategies to drive brand awareness, lead generation, and customer engagement.',
        employer: employers[0]._id,
        companyName: 'TechCorp Solutions',
        location: 'Austin, TX',
        salaryMin: 90000,
        salaryMax: 125000,
        jobType: 'full-time',
        category: 'Marketing',
        experienceLevel: 'mid',
        skills: ['SEO', 'Google Ads', 'Content Marketing', 'Email Marketing', 'Analytics', 'Social Media'],
        requirements: [
          '4+ years of digital marketing experience',
          'Proven track record with SEO and paid advertising',
          'Experience with marketing automation tools',
          'Strong analytical and data-driven mindset',
          'Excellent project management skills',
        ],
        responsibilities: [
          'Develop and execute digital marketing strategies',
          'Manage SEO, SEM, and social media campaigns',
          'Analyze campaign performance and optimize ROI',
          'Lead content creation and distribution',
          'Manage marketing budget and vendor relationships',
        ],
        benefits: [
          'Competitive salary',
          'Performance bonuses',
          'Health and wellness benefits',
          'Marketing conference budget',
          'Flexible work arrangements',
        ],
        applicationDeadline: new Date('2026-09-30'),
        isActive: true,
      },
      {
        title: 'Financial Analyst',
        description:
          'DataFlow Analytics is looking for a Financial Analyst to support financial planning, analysis, and reporting. You will help drive financial decision-making through detailed modeling and insightful analysis.',
        employer: employers[2]._id,
        companyName: 'DataFlow Analytics',
        location: 'Chicago, IL',
        salaryMin: 75000,
        salaryMax: 100000,
        jobType: 'full-time',
        category: 'Finance',
        experienceLevel: 'entry',
        skills: ['Financial Modeling', 'Excel', 'SQL', 'Forecasting', 'Budgeting', 'PowerPoint'],
        requirements: [
          '1-3 years of financial analysis experience',
          'Advanced Excel and financial modeling skills',
          'Bachelor\'s degree in Finance, Accounting, or related field',
          'Strong attention to detail',
          'CFA candidacy is a plus',
        ],
        responsibilities: [
          'Build and maintain financial models',
          'Prepare monthly and quarterly financial reports',
          'Support budgeting and forecasting processes',
          'Analyze financial performance and trends',
          'Present findings to senior management',
        ],
        benefits: [
          'Competitive salary',
          'CFA exam support and reimbursement',
          'Health and dental insurance',
          'Professional development programs',
          '401(k) with match',
        ],
        applicationDeadline: new Date('2026-09-15'),
        isActive: true,
      },
      {
        title: 'QA Engineer',
        description:
          'TechCorp Solutions needs a QA Engineer to ensure the quality and reliability of our software products. You will design and execute test strategies, automate testing, and work closely with development teams.',
        employer: employers[0]._id,
        companyName: 'TechCorp Solutions',
        location: 'San Francisco, CA',
        salaryMin: 95000,
        salaryMax: 130000,
        jobType: 'full-time',
        category: 'Engineering',
        experienceLevel: 'mid',
        skills: ['Selenium', 'Jest', 'Cypress', 'API Testing', 'Python', 'CI/CD', 'Agile'],
        requirements: [
          '3+ years of QA engineering experience',
          'Experience with test automation frameworks',
          'Proficiency in at least one programming language',
          'Knowledge of API testing and performance testing',
          'Strong analytical and debugging skills',
        ],
        responsibilities: [
          'Design and implement test automation frameworks',
          'Write and maintain automated test suites',
          'Perform manual testing when needed',
          'Track and report bugs and quality metrics',
          'Collaborate with developers on quality improvement',
        ],
        benefits: [
          'Competitive salary',
          'Full benefits package',
          'Remote work options',
          'Testing tool licenses provided',
          'Career growth opportunities',
        ],
        applicationDeadline: new Date('2026-10-01'),
        isActive: true,
      },
      {
        title: 'Content Writer',
        description:
          'Creative Studios is looking for a talented Content Writer to create compelling content for our clients across various industries. You will write blog posts, website copy, marketing materials, and social media content.',
        employer: employers[1]._id,
        companyName: 'Creative Studios',
        location: 'Remote',
        salaryMin: 55000,
        salaryMax: 80000,
        jobType: 'contract',
        category: 'Marketing',
        experienceLevel: 'entry',
        skills: ['Copywriting', 'SEO Writing', 'Content Strategy', 'Editing', 'Research', 'WordPress'],
        requirements: [
          '1+ years of content writing experience',
          'Excellent English writing and editing skills',
          'Understanding of SEO best practices',
          'Ability to adapt tone and style for different brands',
          'Portfolio of published writing samples',
        ],
        responsibilities: [
          'Write engaging blog posts and articles',
          'Create website copy and landing pages',
          'Develop social media content calendars',
          'Research topics and maintain industry knowledge',
          'Edit and proofread content for quality assurance',
        ],
        benefits: [
          'Remote work flexibility',
          'Competitive hourly rate',
          'Diverse project exposure',
          'Portfolio building opportunities',
          'Potential for full-time conversion',
        ],
        applicationDeadline: new Date('2026-08-30'),
        isActive: true,
      },
      {
        title: 'Technical Lead',
        description:
          'DataFlow Analytics seeks a Technical Lead to guide our engineering team in building next-generation data analytics solutions. You will set technical direction, mentor engineers, and ensure the delivery of high-quality software.',
        employer: employers[2]._id,
        companyName: 'DataFlow Analytics',
        location: 'Seattle, WA',
        salaryMin: 160000,
        salaryMax: 210000,
        jobType: 'full-time',
        category: 'Engineering',
        experienceLevel: 'lead',
        skills: ['System Design', 'Python', 'Java', 'Cloud Architecture', 'Team Leadership', 'Agile'],
        requirements: [
          '8+ years of software engineering experience',
          '3+ years in a technical leadership role',
          'Experience designing large-scale distributed systems',
          'Strong programming skills in Python or Java',
          'Excellent mentoring and communication abilities',
        ],
        responsibilities: [
          'Set technical vision and architecture direction',
          'Lead a team of 8-12 engineers',
          'Drive engineering excellence and best practices',
          'Collaborate with product and design on technical feasibility',
          'Participate in hiring and team building',
        ],
        benefits: [
          'Executive-level compensation',
          'Significant equity stake',
          'Full benefits and wellness programs',
          'Leadership development programs',
          'Flexible hybrid work',
        ],
        applicationDeadline: new Date('2026-11-15'),
        isActive: true,
      },
    ]);
    console.log(`${jobs.length} jobs created.`);

    // ==================== APPLICATIONS ====================

    const applications = await Application.create([
      {
        job: jobs[0]._id, // Full Stack Developer at TechCorp
        applicant: seekers[0]._id, // Alex Johnson
        employer: employers[0]._id,
        coverLetter:
          'I am excited to apply for the Full Stack Developer position at TechCorp Solutions. With 4 years of experience in React and Node.js, I am confident I can contribute to your engineering team and help build scalable web applications.',
        status: 'under-review',
      },
      {
        job: jobs[5]._id, // UI/UX Designer at Creative Studios
        applicant: seekers[1]._id, // Maria Garcia
        employer: employers[1]._id,
        coverLetter:
          'As a passionate UI/UX designer with 5 years of experience, I am thrilled to apply for this role at Creative Studios. My expertise in Figma, user research, and design systems aligns perfectly with your requirements.',
        status: 'shortlisted',
      },
      {
        job: jobs[9]._id, // Data Scientist at DataFlow Analytics
        applicant: seekers[2]._id, // David Kim
        employer: employers[2]._id,
        coverLetter:
          'I would love to bring my data science expertise to DataFlow Analytics. My experience with Python, TensorFlow, and large-scale data processing makes me a strong fit for this role.',
        status: 'interview',
      },
      {
        job: jobs[15]._id, // Digital Marketing Manager at TechCorp
        applicant: seekers[3]._id, // Emily Chen
        employer: employers[0]._id,
        coverLetter:
          'With my background in digital marketing and proven results in SEO and content strategy, I am eager to lead TechCorp Solutions\' marketing efforts to new heights.',
        status: 'applied',
      },
      {
        job: jobs[16]._id, // Financial Analyst at DataFlow
        applicant: seekers[4]._id, // Ryan Thompson
        employer: employers[2]._id,
        coverLetter:
          'As a CFA Level II candidate with extensive experience in financial modeling and analysis, I am well-positioned to contribute to DataFlow Analytics\' financial planning team.',
        status: 'accepted',
      },
      {
        job: jobs[1]._id, // Senior Backend Engineer at TechCorp
        applicant: seekers[0]._id, // Alex Johnson
        employer: employers[0]._id,
        coverLetter:
          'I am interested in growing into a senior engineering role and believe the Senior Backend Engineer position is the perfect next step in my career.',
        status: 'rejected',
      },
      {
        job: jobs[6]._id, // Graphic Designer at Creative Studios
        applicant: seekers[1]._id, // Maria Garcia
        employer: employers[1]._id,
        coverLetter:
          'While my primary expertise is in UX design, I have a strong foundation in graphic design and would love to expand my role at Creative Studios.',
        status: 'applied',
      },
      {
        job: jobs[10]._id, // Data Engineer at DataFlow
        applicant: seekers[2]._id, // David Kim
        employer: employers[2]._id,
        coverLetter:
          'My experience with data pipelines and big data technologies makes me a strong candidate for the Data Engineer role at DataFlow Analytics.',
        status: 'under-review',
      },
      {
        job: jobs[0]._id, // Full Stack Developer at TechCorp
        applicant: seekers[2]._id, // David Kim
        employer: employers[0]._id,
        coverLetter:
          'While my background is primarily in data science, I have solid full-stack development skills and am interested in this opportunity.',
        status: 'applied',
      },
      {
        job: jobs[8]._id, // Brand Strategist at Creative Studios
        applicant: seekers[3]._id, // Emily Chen
        employer: employers[1]._id,
        coverLetter:
          'My marketing expertise and strategic thinking skills make me an ideal candidate for the Brand Strategist position at Creative Studios.',
        status: 'shortlisted',
      },
    ]);
    console.log(`${applications.length} applications created.`);

    // Update applicationsCount on jobs
    const applicationCounts = {};
    applications.forEach((app) => {
      const jobId = app.job.toString();
      applicationCounts[jobId] = (applicationCounts[jobId] || 0) + 1;
    });

    for (const [jobId, count] of Object.entries(applicationCounts)) {
      await Job.findByIdAndUpdate(jobId, { applicationsCount: count });
    }
    console.log('Application counts updated on jobs.');

    console.log('\n========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log('\nLogin credentials:');
    console.log('  Admin:    admin@jobportal.com / admin123');
    console.log('  Employer: sarah@techcorp.com / employer123');
    console.log('  Employer: james@creativestudios.com / employer123');
    console.log('  Employer: priya@dataflow.com / employer123');
    console.log('  Seeker:   alex@email.com / seeker123');
    console.log('  Seeker:   maria@email.com / seeker123');
    console.log('  Seeker:   david@email.com / seeker123');
    console.log('  Seeker:   emily@email.com / seeker123');
    console.log('  Seeker:   ryan@email.com / seeker123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
