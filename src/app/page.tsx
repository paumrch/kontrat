'use client'

import { useAuth } from "@/contexts/AuthContext";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-3xl font-medium mb-4 text-foreground tracking-tight">
            {user ? `Bienvenido, ${user.email}` : 'Kontrat'}
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {user 
              ? 'Has accedido exitosamente a tu cuenta. Explora las funcionalidades disponibles.'
              : 'A production-grade application built with Next.js 15, Turbopack, TypeScript, Tailwind CSS, shadcn/ui and Supabase'
            }
          </p>
        </div>

        <div className="mb-20">
          <FeatureCard />
        </div>

        {!user && (
          <div className="space-y-6 mb-20 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium text-foreground text-center">Getting Started</h2>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-foreground font-medium">1.</span>
                Configure your Supabase project
              </li>
              <li className="flex gap-3">
                <span className="text-foreground font-medium">2.</span>
                Update environment variables
              </li>
              <li className="flex gap-3">
                <span className="text-foreground font-medium">3.</span>
                Define your database schema
              </li>
              <li className="flex gap-3">
                <span className="text-foreground font-medium">4.</span>
                Start building your application
              </li>
            </ol>
          </div>
        )}

        {user && (
          <div className="text-center">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Panel de Usuario</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cuenta: {user.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Registrado: {new Date(user.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
