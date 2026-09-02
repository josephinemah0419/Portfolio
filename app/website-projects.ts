export type WebsiteProject = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  video: string;
  description: string;
  role: string;
  responsibilities: string;
  iframeAllowed: boolean;
  caseStudy: { heading: string; text: string }[];
};

// Edit project URLs, artwork and your contribution here.
// false always uses the screenshot; true attempts a direct browser iframe.
// The browser enforces the destination website's embedding policy.
export const websiteProjects: WebsiteProject[] = [
  { id: '1826-studio', title: '1826 Studio', url: 'https://1826studio.com/', thumbnail: '/works/websites/website-01.jpg', video: '/works/websites/website-01.mp4', description: 'Photography studio website with a showcase of its work and services.' },
  { id: 'hola-hola', title: 'Hola Hola', url: 'https://www.holahola.asia/', thumbnail: '/works/websites/website-02.jpg', video: '/works/websites/website-02.mp4', description: 'Hola Hola website project. Explore the live experience or recorded walkthrough.' },
  { id: 'fanstag-ai', title: 'FansTag AI', url: 'https://fanstag.asia/', thumbnail: '/works/websites/website-03.jpg', video: '/works/websites/website-03.mp4', description: 'An AI marketing platform website introducing its product and services.' },
].map(project => ({
  ...project,
  role: 'End-to-End Website Design & Development',
  responsibilities: project.id === 'hola-hola'
    ? 'Codex · UI/UX Design · Front-End Development · Responsive Design · Interaction Development'
    : 'WordPress · UI/UX Design · Website Development · Responsive Design · Content Structure',
  iframeAllowed: true,
  caseStudy: [
    { heading: 'Project overview', text: project.description },
    { heading: 'My contribution', text: 'Detailed responsibilities, process and outcomes will be added here.' },
  ],
}));
