import { projects } from './projects';

export interface RouteMetadata {
  title: string;
  description: string;
  type: 'article' | 'profile';
}

const routeMeta = {
  home: {
    title: 'Helena Pedro Technical Portfolio | Backend, Cloud & AI Projects',
    description:
      'Technical portfolio for Helena Pedro, showcasing backend architecture, cloud systems, AI workflows, data platforms, and full-stack engineering projects.',
  },
};

export const getRouteMetadata = (pathname: string): RouteMetadata => {
  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
  const project = projectMatch
    ? projects.find((item) => item.id === projectMatch[1])
    : undefined;

  if (project) {
    return {
      title: `${project.title} | Technical Projects | Helena Pedro`,
      description: `${project.summary} Technical deep-dive by Helena Pedro covering architecture, backend design, and engineering tradeoffs.`,
      type: 'article',
    };
  }

  return {
    ...routeMeta.home,
    type: 'profile',
  };
};
