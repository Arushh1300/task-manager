import { Link } from 'react-router-dom';
import { BarChart3, CheckSquare, Users, ArrowRight } from 'lucide-react';
import GradientBlinds from '../components/GradientBlinds/GradientBlinds';

const features = [
  {
    title: 'Task Tracking',
    description: 'Create, assign, and move work from todo to done with clear ownership.',
    icon: CheckSquare,
  },
  {
    title: 'Team Collaboration',
    description: 'Keep projects, members, and deadlines visible in one shared workspace.',
    icon: Users,
  },
  {
    title: 'Real-time Dashboard',
    description: 'See progress, overdue work, and project health at a glance.',
    icon: BarChart3,
  },
];

const Landing = () => (
  <main className="min-h-screen bg-white text-gray-950 dark:bg-gray-950 dark:text-white">
    <section className="relative isolate overflow-hidden h-screen flex items-center border-b border-gray-100 dark:border-gray-900">
      {/* GradientBlinds background - Full screen but visually distinct on the right */}
      <div className="absolute inset-0 z-0">
        <GradientBlinds
          gradientColors={['#0ea5e9', '#6366f1', '#a855f7']}
          angle={-15}
          noise={0.2}
          blindCount={12}
          blindMinWidth={60}
          spotlightRadius={0.7}
          spotlightSoftness={0.8}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0.1}
          shineDirection="left"
          mixBlendMode="normal"
        />
      </div>

      {/* Content overlay mask for text readability */}
      {/* Mobile: Gradient from top to bottom. Desktop: Gradient from left to right */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-white/80 to-transparent md:bg-gradient-to-r md:from-white md:via-white/95 md:to-transparent dark:from-gray-950 dark:via-gray-950/80 md:dark:from-gray-950 md:dark:via-gray-950/95 dark:to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="max-w-2xl pt-20 pb-16 md:pt-0 md:pb-0">
            <div className="mb-6 inline-flex rounded-full border border-primary-200/50 bg-primary-50/80 px-4 py-1.5 text-sm font-semibold text-primary-700 backdrop-blur-md dark:border-primary-800/50 dark:bg-primary-900/30 dark:text-primary-300 shadow-sm">
              ✨ The New Standard for Team Task Managers
            </div>
            <h1 className="text-5xl font-black tracking-tight text-gray-950 sm:text-7xl dark:text-white leading-[1.1]">
              Manage your team tasks <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">efficiently</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-xl">
              A focused, lightning-fast workspace for projects, tasks, ownership, and progress tracking without the clutter. Built for modern teams.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="group flex items-center justify-center rounded-2xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-600/20 transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-primary-600/30"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white/60 px-8 py-4 text-base font-bold text-gray-700 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200 dark:hover:bg-gray-900 shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          {/* Right Column: Empty on purpose to let the animation show through */}
          <div className="hidden md:block h-full w-full"></div>
        </div>
      </div>
    </section>

    <section className="bg-white py-24 sm:py-32 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            No clutter. Just the essentials.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900">
                <dt className="flex items-center gap-x-3 text-xl font-bold leading-7 text-gray-900 dark:text-white">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  </main>
);

export default Landing;
