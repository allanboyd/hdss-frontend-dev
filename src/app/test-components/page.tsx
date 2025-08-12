'use client';

import { Button } from '@/components/ui/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select/Select';

export default function TestComponentsPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Radix UI Components Test</h1>
      
      {/* Test Button Components */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Tests</h2>
        <div className="flex gap-4 flex-wrap">
          <Button>Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </div>

      {/* Test Card Components */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Card Tests</h2>
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a test card to see if styling is working.</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Select Components */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Select Tests</h2>
        <Select defaultValue="option1">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Test with basic Tailwind classes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Tailwind Test</h2>
        <div className="bg-blue-500 text-white p-4 rounded">
          This should be a blue box with white text
        </div>
        <div className="bg-red-500 text-white p-4 rounded">
          This should be a red box with white text
        </div>
      </div>
    </div>
  );
}
