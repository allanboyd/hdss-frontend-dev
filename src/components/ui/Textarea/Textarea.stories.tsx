import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    rows: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="message" className="text-sm font-medium">
        Message
      </label>
      <Textarea id="message" placeholder="Enter your message..." />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    value: 'This is a pre-filled textarea with some content.',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    disabled: true,
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large textarea with more rows',
    rows: 8,
    className: 'min-h-[200px]',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small textarea',
    rows: 2,
    className: 'min-h-[60px]',
  },
};

export const WithCharacterCount: Story = {
  render: () => (
    <div className="space-y-2">
      <Textarea
        placeholder="Enter your message..."
        maxLength={100}
      />
      <p className="text-xs text-muted-foreground text-right">
        0/100 characters
      </p>
    </div>
  ),
};

export const Error: Story = {
  args: {
    placeholder: 'Error state textarea',
    className: 'border-red-500 focus-visible:ring-red-500',
  },
};

export const Resizable: Story = {
  args: {
    placeholder: 'This textarea is resizable',
    className: 'resize',
  },
};

export const NonResizable: Story = {
  args: {
    placeholder: 'This textarea is not resizable',
    className: 'resize-none',
  },
};
