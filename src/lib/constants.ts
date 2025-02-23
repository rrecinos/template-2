export interface Category {
  id: string
  name: string
  description: string
  count: number
}

export const categories: Category[] = [
  { id: 'cms', name: 'Content Management', description: 'CMS platforms and tools', count: 45 },
  { id: 'monitoring', name: 'Monitoring', description: 'System and application monitoring', count: 32 },
  { id: 'analytics', name: 'Analytics', description: 'Data and website analytics', count: 28 },
  { id: 'automation', name: 'Automation', description: 'Task and workflow automation', count: 35 },
  { id: 'backup', name: 'Backup & Storage', description: 'Data backup and storage solutions', count: 25 },
  { id: 'communication', name: 'Communication', description: 'Team chat and collaboration', count: 30 },
  { id: 'database', name: 'Databases', description: 'Database management systems', count: 22 },
  { id: 'development', name: 'Development', description: 'Development tools and IDEs', count: 40 },
  { id: 'documentation', name: 'Documentation', description: 'Wiki and knowledge bases', count: 18 },
  { id: 'security', name: 'Security', description: 'Security and access control', count: 33 },
] 