import type { Meta, StoryObj } from '@storybook/react';
import { Loading, FullScreenLoading } from './Loading';

const meta: Meta<typeof Loading> = {
  title: 'UI/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    text: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const CustomText: Story = {
  args: {
    text: 'Please wait while we process your request...',
  },
};

export const NoText: Story = {
  args: {
    text: '',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Loading size="sm" text="Small" />
      <Loading size="md" text="Medium" />
      <Loading size="lg" text="Large" />
    </div>
  ),
};

export const FullScreen: Story = {
  render: () => <FullScreenLoading />,
  parameters: {
    layout: 'fullscreen',
  },
};

export const InCard: Story = {
  render: () => (
    <div className="w-[300px] p-6 border rounded-lg">
      <Loading text="Loading content..." />
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Processing...</span>
      <Loading size="sm" text="" />
    </div>
  ),
};
