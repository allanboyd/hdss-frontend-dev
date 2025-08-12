'use client';

import { Button } from '@/components/ui/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select/Select';
import { useState } from 'react';

export default function DebugRenderingPage() {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">CSS, Tailwind & Radix UI Debug</h1>
        
        {/* Basic CSS Variables Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">CSS Variables Test</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background text-foreground p-4 rounded border">
              <p>Background: var(--background)</p>
              <p>Foreground: var(--foreground)</p>
            </div>
            <div className="bg-card text-card-foreground p-4 rounded border">
              <p>Card Background: var(--card)</p>
              <p>Card Foreground: var(--card-foreground)</p>
            </div>
          </div>
        </div>

        {/* Tailwind Utility Classes Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Tailwind Utility Classes Test</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded">
              <p>Blue background with white text</p>
              <p className="text-sm">Classes: bg-blue-500 text-white p-4 rounded</p>
            </div>
            <div className="bg-red-500 text-white p-4 rounded">
              <p>Red background with white text</p>
              <p className="text-sm">Classes: bg-red-500 text-white p-4 rounded</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded">
              <p>Green background with white text</p>
              <p className="text-sm">Classes: bg-green-500 text-white p-4 rounded</p>
            </div>
            <div className="bg-yellow-500 text-black p-4 rounded">
              <p>Yellow background with black text</p>
              <p className="text-sm">Classes: bg-yellow-500 text-black p-4 rounded</p>
            </div>
          </div>
        </div>

        {/* Radix UI Button Components Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Radix UI Button Components Test</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </div>

        {/* Radix UI Card Components Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Radix UI Card Components Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Card 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is a test card to see if styling is working.</p>
                <p className="text-sm text-muted-foreground">Using muted-foreground color</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Test Card 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Another test card with different content.</p>
                <p className="text-sm text-muted-foreground">Testing card styling</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Radix UI Select Components Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Radix UI Select Components Test</h2>
          <div className="flex gap-4">
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center">
              <span className="text-sm">Selected: {selectedValue || 'None'}</span>
            </div>
          </div>
        </div>

        {/* CSS Custom Properties Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">CSS Custom Properties Test</h2>
          <div className="grid grid-cols-2 gap-4">
            <div style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }} className="p-4 rounded">
              <p>Primary Colors</p>
              <p className="text-sm">Using CSS custom properties</p>
            </div>
            <div style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }} className="p-4 rounded">
              <p>Secondary Colors</p>
              <p className="text-sm">Using CSS custom properties</p>
            </div>
          </div>
        </div>

        {/* Responsive Design Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Responsive Design Test</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <p className="text-sm sm:text-base lg:text-lg">Responsive text</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <p className="text-sm sm:text-base lg:text-lg">Responsive text</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <p className="text-sm sm:text-base lg:text-lg">Responsive text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
