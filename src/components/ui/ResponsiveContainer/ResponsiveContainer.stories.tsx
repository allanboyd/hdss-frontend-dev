import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveContainer } from './ResponsiveContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../Card/Card';

const meta: Meta<typeof ResponsiveContainer> = {
  title: 'UI/ResponsiveContainer',
  component: ResponsiveContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['none', 'small', 'medium', 'large'],
    },
    maxWidth: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ResponsiveContainer>
      <Card>
        <CardHeader>
          <CardTitle>Default Container</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the default responsive container with medium padding and no max width.</p>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  ),
};

export const SmallPadding: Story = {
  render: () => (
    <ResponsiveContainer padding="small">
      <Card>
        <CardHeader>
          <CardTitle>Small Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has small padding.</p>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  ),
};

export const LargePadding: Story = {
  render: () => (
    <ResponsiveContainer padding="large">
      <Card>
        <CardHeader>
          <CardTitle>Large Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has large padding.</p>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  ),
};

export const NoPadding: Story = {
  render: () => (
    <ResponsiveContainer padding="none">
      <Card>
        <CardHeader>
          <CardTitle>No Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has no padding.</p>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  ),
};

export const WithMaxWidth: Story = {
  render: () => (
    <ResponsiveContainer maxWidth="lg">
      <Card>
        <CardHeader>
          <CardTitle>With Max Width</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has a maximum width of lg.</p>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  ),
};

export const SmallMaxWidth: Story = {
  render: () => (
    <ResponsiveContainer maxWidth="sm">
      <Card>
        <CardHeader>
          <CardTitle>Small Max Width</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has a small maximum width.</p>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  ),
};

export const LargeMaxWidth: Story = {
  render: () => (
    <ResponsiveContainer maxWidth="2xl">
      <Card>
        <CardHeader>
          <CardTitle>Large Max Width</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has a large maximum width.</p>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <ResponsiveContainer className="bg-gray-50 rounded-lg">
      <Card>
        <CardHeader>
          <CardTitle>Custom Styling</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has custom background and border radius.</p>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  ),
};

export const MultipleContainers: Story = {
  render: () => (
    <div className="space-y-4">
      <ResponsiveContainer maxWidth="sm">
        <Card>
          <CardHeader>
            <CardTitle>Small Container</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Small max width container.</p>
          </CardContent>
        </Card>
      </ResponsiveContainer>

      <ResponsiveContainer maxWidth="lg">
        <Card>
          <CardHeader>
            <CardTitle>Large Container</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Large max width container.</p>
          </CardContent>
        </Card>
      </ResponsiveContainer>

      <ResponsiveContainer maxWidth="2xl">
        <Card>
          <CardHeader>
            <CardTitle>Extra Large Container</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Extra large max width container.</p>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </div>
  ),
};
