'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function FeatureCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Next.js 15</CardTitle>
          <CardDescription className="text-sm">
            Latest React framework with Turbopack
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">React 19</Badge>
            <Badge variant="secondary" className="text-xs">Turbopack</Badge>
            <Badge variant="secondary" className="text-xs">App Router</Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Built on the latest Next.js with React 19 for optimal performance and developer experience.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">TypeScript</CardTitle>
          <CardDescription className="text-sm">
            Type-safe development environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">Type Safety</Badge>
            <Badge variant="secondary" className="text-xs">IntelliSense</Badge>
            <Badge variant="secondary" className="text-xs">Refactoring</Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Comprehensive type checking and enhanced development experience with modern TypeScript.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Supabase</CardTitle>
          <CardDescription className="text-sm">
            Open source Firebase alternative
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">Database</Badge>
            <Badge variant="secondary" className="text-xs">Auth</Badge>
            <Badge variant="secondary" className="text-xs">Real-time</Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Complete backend solution with PostgreSQL, authentication, and real-time subscriptions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}