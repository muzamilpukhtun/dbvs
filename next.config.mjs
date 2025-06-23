import webpack from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Next.js 15+ compatibility
  serverExternalPackages: [
    "@coral-xyz/anchor",
    "@solana/web3.js",
    "bs58"
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        os: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        net: false,
        tls: false
      };
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  },
};

export default nextConfig;
