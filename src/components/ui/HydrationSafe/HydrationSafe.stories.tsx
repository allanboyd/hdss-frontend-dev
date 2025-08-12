import type { Meta, StoryObj } from '@storybook/react';
import { HydrationSafe } from './HydrationSafe';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof HydrationSafe> = {
  title: 'UI/HydrationSafe',
  component: HydrationSafe,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Hydration Safe Component</h3>
      <HydrationSafe>
        <div className="p-4 border rounded-lg">
          <p>This content is only rendered after hydration.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Current time: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </HydrationSafe>
    </div>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">With Fallback</h3>
      <HydrationSafe fallback={<div className="p-4 border rounded-lg bg-gray-50">Loading...</div>}>
        <div className="p-4 border rounded-lg">
          <p>This content is only rendered after hydration.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Current time: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </HydrationSafe>
    </div>
  ),
};

export const ClientOnly: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Client Only Component</h3>
      <HydrationSafe fallback={<div className="p-4 border rounded-lg bg-gray-50">Loading...</div>}>
        <div className="p-4 border rounded-lg">
          <p>This content is only rendered on the client.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Current time: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </HydrationSafe>
    </div>
  ),
};

export const WithInteractiveElements: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">With Interactive Elements</h3>
      <HydrationSafe fallback={<div className="p-4 border rounded-lg bg-gray-50">Loading interactive elements...</div>}>
        <div className="p-4 border rounded-lg space-y-3">
          <p>Interactive elements that need client-side hydration:</p>
          <div className="flex gap-2">
            <Button size="sm">Click me</Button>
            <Badge variant="secondary">Interactive Badge</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Window size: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}
          </p>
        </div>
      </HydrationSafe>
    </div>
  ),
};

export const MultipleInstances: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Multiple Instances</h3>
      <div className="grid grid-cols-2 gap-4">
        <HydrationSafe fallback={<div className="p-4 border rounded-lg bg-gray-50">Loading 1...</div>}>
          <div className="p-4 border rounded-lg">
            <p>Instance 1</p>
            <p className="text-sm text-muted-foreground">
              Time: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </HydrationSafe>

        <HydrationSafe fallback={<div className="p-4 border rounded-lg bg-gray-50">Loading 2...</div>}>
          <div className="p-4 border rounded-lg">
            <p>Instance 2</p>
            <p className="text-sm text-muted-foreground">
              Time: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </HydrationSafe>
      </div>
    </div>
  ),
};

export const NoFallback: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">No Fallback (Hidden until hydrated)</h3>
      <HydrationSafe>
        <div className="p-4 border rounded-lg">
          <p>This content is hidden until hydration completes.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Current time: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </HydrationSafe>
    </div>
  ),
};
