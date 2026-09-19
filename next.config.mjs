import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

export default (phase) => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    output: 'standalone',
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
  }

  return nextConfig
}

