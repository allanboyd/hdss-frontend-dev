import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    checked: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Auto-save',
    description: 'Automatically save your changes',
  },
};

export const Checked: Story = {
  args: {
    label: 'Dark mode',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked option',
    checked: true,
    disabled: true,
  },
};

export const NoLabel: Story = {
  args: {},
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Email notifications" />
      <Switch label="Push notifications" checked />
      <Switch label="SMS notifications" disabled />
      <Switch label="Marketing emails" checked disabled />
    </div>
  ),
};

export const Settings: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch
        label="Dark mode"
        description="Switch between light and dark themes"
        checked
      />
      <Switch
        label="Auto-save"
        description="Automatically save your work every 5 minutes"
      />
      <Switch
        label="Sound effects"
        description="Play sound effects for interactions"
      />
      <Switch
        label="Analytics"
        description="Help us improve by sending anonymous usage data"
        checked
      />
    </div>
  ),
};
