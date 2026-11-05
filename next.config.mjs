import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

export default (phase) => {
  const isVercel = Boolean(process.env.VERCEL)

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    // Vercel manages serverless output natively and requires standard build artifacts.
    // In standalone/container hosting (AI Studio / Cloud Run / Docker), enable standalone output.
    ...(isVercel
      ? {}
      : {
          distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
          output: 'standalone',
        }),
    images: {
      unoptimized: true,
    },
  }

  return nextConfig
}
