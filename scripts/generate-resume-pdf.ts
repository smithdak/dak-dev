import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const OUTPUT_PATH = path.join(process.cwd(), 'public', 'dakota-smith-resume.pdf');

const COLORS = {
  background: '#0A0A0A',
  text: '#F5F5F5',
  muted: '#A9A9A9',
  surface: '#333333',
  accent: '#00D9FF', // Neo-brutalist accent color
};

// Resume Data
const resumeData = {
  name: 'Dakota Smith',
  title: 'Strategic Technical Leader & Fullstack Architect',
  email: 'dakota@twofold.tech',
  github: 'https://github.com/smithdak',
  summary: `Strategic Technical Leader & Fullstack Architect with 14 years of enterprise experience and a track record of shipping 30+ production-ready projects. I specialize in bridging the gap between high-level business vision and deep technical execution, possessing an "M-shaped" skill set that encompasses multiple technical domains, leadership, and project management. I am a "Big Picture Thinker" who excels at translating business requirements into scalable, secure, and maintainable architectural blueprints.`,

  competencies: [
    {
      title: 'Technical Strategy & Leadership',
      items: [
        { name: 'Vision & Strategy', desc: 'Defining long-term technical roadmaps aligned with business ROI.' },
        { name: 'Mentorship', desc: 'Cultivating talent through high-level code reviews and "player-coach" leadership.' },
      ],
    },
    {
      title: 'Architecture & Innovation',
      items: [
        { name: 'Fullstack Mastery', desc: 'Expert-level proficiency in NextJS, ReactJS, .NET, and C#.' },
        { name: 'Enterprise CMS', desc: '14+ years architecting Sitecore (XM Cloud), Optimizely, and Umbraco solutions.' },
      ],
    },
    {
      title: 'Operational Excellence',
      items: [
        { name: 'RAID Management', desc: 'Expert at mitigating Risks, Assumptions, Issues, and Dependencies.' },
        { name: 'Agile Orchestration', desc: '9+ years leading Scrum teams to deliver under tight deadlines.' },
      ],
    },
  ],

  skills: {
    'Frontend Mastery': ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS', 'JavaScript', 'jQuery', 'SASS', 'Bootstrap'],
    'Backend & Data': ['.NET Core', 'C#', 'GraphQL', 'SQL Server', 'MongoDB', 'Postgres', 'Prisma', 'Solr', 'Fabric'],
    'Platform & DevOps': ['Sitecore XM Cloud', 'Umbraco', 'Optimizely', 'Shopify', 'GitHub Actions', 'Azure DevOps', 'Vercel', 'Docker'],
    'AI & Innovation': ['AI-powered CMS analyzers', 'Automated security scanning', 'Performance scanning agents'],
  },

  experience: [
    {
      company: 'RBA Consulting',
      title: 'Senior Fullstack Engineer',
      location: 'Remote',
      period: 'Dec 2023 - Present',
      highlights: [
        'Lead Architect for global web solutions, ensuring adherence to international accessibility (ADA) and performance standards.',
        'Strategist: Shifted team focus from tactical execution to strategic resource allocation and workflow optimization.',
      ],
    },
    {
      company: 'TwofoldTech',
      title: 'Founder & Tech Lead',
      location: 'Remote',
      period: 'Mar 2020 - Present',
      highlights: [
        'Executive Leadership: Define technical strategy and manage cross-functional teams for 29+ enterprise client projects.',
        'Fullstack Implementation: Deliver bespoke e-commerce and SaaS solutions using modern tech stacks and agile methodologies.',
      ],
    },
    {
      company: 'XCentium',
      title: 'Senior Fullstack Engineer',
      location: 'Remote',
      period: 'Apr 2019 - Mar 2020',
      highlights: [
        "International Implementation: Pioneered the first Sitecore instance hosted behind China's firewall, navigating complex regulatory landscapes.",
        'Platform Extension: Optimized content management by extending Sitecore pipelines and building reusable components.',
      ],
    },
    {
      company: 'Aware',
      title: 'Senior Software Engineer',
      location: 'Remote',
      period: 'Sep 2016 - Mar 2019',
      highlights: [
        'Architected and supported complex CMS migrations (Sitecore to Episerver) and custom data warehouses.',
      ],
    },
    {
      company: 'AJi Software',
      title: 'Solutions Architect',
      location: 'Kansas City, MO',
      period: 'Aug 2014 - Sep 2016',
      highlights: [
        'Architecture: Designed multi-site Sitecore systems and custom payment service integrations for clients like VFW and Medical News Network.',
      ],
    },
    {
      company: 'Roundedcube',
      title: 'Lead Software Engineer',
      location: 'St. Louis, MO',
      period: 'Jan 2012 - Aug 2014',
      highlights: [
        'Structural Design: Architected secure, multi-tier .NET systems and optimized multi-site Sitecore instances for high-traffic brands like SeaWorld.',
      ],
    },
  ],

  certifications: [
    'Sitecore XM Cloud Certified Developer',
    'Sitecore 9 Certified Developer',
    'Microsoft Certified Technology Specialist (MCTS)',
    'Microsoft Certified Professional (MCP)',
    'Shopify Developer Certification (In Progress)',
  ],

  education: {
    degree: 'C# ASP.NET Graduate',
    institution: 'Centriq Training',
    location: 'Leawood, KS',
    period: 'Jan 2011 - May 2011',
  },
};

function generateResumePDF() {
  console.log('Generating resume PDF...');

  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: 'Dakota Smith - Resume',
      Author: 'Dakota Smith',
      Subject: 'Professional Resume',
    },
  });

  const stream = fs.createWriteStream(OUTPUT_PATH);
  doc.pipe(stream);

  let yPos = doc.y;

  // Header
  doc
    .fontSize(24)
    .font('Helvetica-Bold')
    .text(resumeData.name, { align: 'left' });

  doc
    .fontSize(12)
    .font('Helvetica')
    .text(resumeData.title, { align: 'left' });

  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .text(`${resumeData.email} | ${resumeData.github}`, { align: 'left' });

  doc.moveDown(1);
  drawLine(doc);

  // Executive Summary
  doc.moveDown(1);
  doc.fontSize(14).font('Helvetica-Bold').text('Executive Summary');
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica').text(resumeData.summary, { align: 'justify' });

  doc.moveDown(1);

  // Core Competencies
  doc.fontSize(14).font('Helvetica-Bold').text('Core Competencies');
  doc.moveDown(0.5);

  resumeData.competencies.forEach((comp) => {
    doc.fontSize(11).font('Helvetica-Bold').text(comp.title);
    doc.moveDown(0.3);
    comp.items.forEach((item) => {
      doc.fontSize(10).font('Helvetica-Bold').text(`• ${item.name}: `, { continued: true });
      doc.font('Helvetica').text(item.desc);
    });
    doc.moveDown(0.5);
  });

  // Technical Toolkit
  doc.fontSize(14).font('Helvetica-Bold').text('Technical Toolkit');
  doc.moveDown(0.5);

  Object.entries(resumeData.skills).forEach(([category, skills]) => {
    doc.fontSize(11).font('Helvetica-Bold').text(category);
    doc.fontSize(10).font('Helvetica').text(skills.join(', '));
    doc.moveDown(0.3);
  });

  doc.moveDown(0.5);

  // Professional Experience
  doc.addPage();
  doc.fontSize(14).font('Helvetica-Bold').text('Professional Experience');
  doc.moveDown(0.5);

  resumeData.experience.forEach((exp) => {
    doc.fontSize(12).font('Helvetica-Bold').text(exp.company);
    doc.fontSize(10).font('Helvetica-Oblique').text(`${exp.title} | ${exp.location} | ${exp.period}`);
    doc.moveDown(0.3);

    exp.highlights.forEach((highlight) => {
      doc.fontSize(10).font('Helvetica').text(`• ${highlight}`, { indent: 10 });
    });

    doc.moveDown(0.5);
  });

  // Certifications & Education
  doc.moveDown(1);
  doc.fontSize(14).font('Helvetica-Bold').text('Certifications & Education');
  doc.moveDown(0.5);

  doc.fontSize(11).font('Helvetica-Bold').text('Certifications');
  doc.moveDown(0.3);
  resumeData.certifications.forEach((cert) => {
    doc.fontSize(10).font('Helvetica').text(`• ${cert}`);
  });

  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica-Bold').text('Education');
  doc.moveDown(0.3);
  doc.fontSize(10).font('Helvetica-Bold').text(resumeData.education.degree);
  doc.font('Helvetica').text(`${resumeData.education.institution} | ${resumeData.education.location} | ${resumeData.education.period}`);

  doc.end();

  stream.on('finish', () => {
    const stats = fs.statSync(OUTPUT_PATH);
    const fileSizeKB = Math.round(stats.size / 1024);
    console.log(`✓ Resume PDF generated successfully`);
    console.log(`✓ Location: ${OUTPUT_PATH}`);
    console.log(`✓ Size: ${fileSizeKB} KB`);

    if (fileSizeKB > 500) {
      console.warn(`⚠ Warning: PDF size (${fileSizeKB} KB) exceeds 500 KB target`);
    } else {
      console.log(`✓ Size is within 500 KB limit`);
    }
  });
}

function drawLine(doc: PDFKit.PDFDocument) {
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .lineWidth(2)
    .stroke();
}

// Generate the PDF
generateResumePDF();
