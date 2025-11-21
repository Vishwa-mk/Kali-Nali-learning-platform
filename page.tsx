'use client';

import { useAppState } from '@/lib/state';
import { ProjectCard } from '@/components/dashboard/project-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Code, Rocket, BrainCircuit, Trophy } from 'lucide-react';

export default function Home() {
  const { projects } = useAppState();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6">
            Learn & Play
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            A digital learning environment where play becomes the primary engine of understanding.
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore interactive coding projects, learn by doing, and master new skills through hands-on experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="#projects">
                Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="/leaderboard">
                View Leaderboard <Trophy className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Learn & Play?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline text-xl font-semibold mb-2">Hands-On Learning</h3>
              <p className="text-muted-foreground">
                Learn by building real projects with interactive code editors and step-by-step guidance.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline text-xl font-semibold mb-2">Start Immediately</h3>
              <p className="text-muted-foreground">
                No setup required. Jump right into coding and start learning from day one.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <BrainCircuit className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline text-xl font-semibold mb-2">AI-Powered Hints</h3>
              <p className="text-muted-foreground">
                Get personalized hints and suggestions to help you learn at your own pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
            Explore Our Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from a variety of projects designed to teach you programming concepts through practical application.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
