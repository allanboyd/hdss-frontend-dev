import type { Meta, StoryObj } from '@storybook/react';
import { ComingSoon } from './ComingSoon';
import { Sparkles, Zap, Users, BarChart3 } from 'lucide-react';

const meta: Meta<typeof ComingSoon> = {
  title: 'UI/ComingSoon',
  component: ComingSoon,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
    targetDate: {
      control: { type: 'date' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Advanced Analytics',
    description: 'Get deeper insights into your data with our new analytics dashboard.',
    icon: BarChart3,
    targetDate: new Date('2024-12-31T23:59:59'),
    features: [
      'Real-time data visualization',
      'Custom dashboard builder',
      'Advanced filtering options',
      'Export capabilities',
      'Team collaboration tools',
      'Mobile responsive design',
    ],
  },
};

export const WithSparkles: Story = {
  args: {
    title: 'AI-Powered Features',
    description: 'Experience the future with our cutting-edge AI capabilities.',
    icon: Sparkles,
    targetDate: new Date('2024-06-15T23:59:59'),
    features: [
      'Smart content recommendations',
      'Automated workflow optimization',
      'Predictive analytics',
      'Natural language processing',
      'Intelligent search algorithms',
      'Automated reporting',
    ],
  },
};

export const WithZap: Story = {
  args: {
    title: 'Lightning Fast Performance',
    description: 'Experience blazing fast speeds with our optimized infrastructure.',
    icon: Zap,
    targetDate: new Date('2024-08-20T23:59:59'),
    features: [
      'Sub-second response times',
      'Global CDN deployment',
      'Advanced caching strategies',
      'Optimized database queries',
      'Progressive web app features',
      'Offline functionality',
    ],
  },
};

export const WithUsers: Story = {
  args: {
    title: 'Team Collaboration',
    description: 'Work together seamlessly with our new collaboration features.',
    icon: Users,
    targetDate: new Date('2024-09-10T23:59:59'),
    features: [
      'Real-time collaboration',
      'Shared workspaces',
      'Comment and feedback system',
      'Version control',
      'Role-based permissions',
      'Activity tracking',
    ],
  },
};

export const ShortCountdown: Story = {
  args: {
    title: 'Quick Launch',
    description: 'Coming very soon with exciting new features.',
    icon: Sparkles,
    targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
    ],
  },
};

export const NoFeatures: Story = {
  args: {
    title: 'Simple Coming Soon',
    description: 'A simple coming soon page without feature list.',
    icon: Sparkles,
    targetDate: new Date('2024-12-31T23:59:59'),
    features: [],
  },
};
