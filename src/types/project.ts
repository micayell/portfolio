export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    thumbnailUrl?: string;
    githubUrl?: string;
    demoUrl?: string;

    overview: {
        goal: string;
        background: string;
        role: string;
        period: string;
        members: string;
    };
    skills: {
        name: string;
        reason: string;
    }[];
    features: {
        title: string;
        description: string;
        imageUrl?: string;
    }[];
    troubleShooting?: {
        problem: string;
        solution: string;
        result: string;
    }[];
  }