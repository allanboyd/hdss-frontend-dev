'use client';

import { Map } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon/ComingSoon';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function MappingPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        title='Household Mapping'
        description='Interactive household mapping and spatial analysis tools for comprehensive research site visualization'
        icon={Map}
        targetDate={new Date('2024-10-30T23:59:59')}
        features={[
          'Interactive 3D household mapping',
          'Real-time GPS tracking and updates',
          'Spatial clustering and hotspot analysis',
          'Custom boundary and zone creation',
          'Population density heat maps',
          'Infrastructure and facility mapping',
          'Mobile data collection integration',
          'Export to GIS and mapping software',
        ]}
      />
    </ProtectedRoute>
  );
}
