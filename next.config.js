/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://api.sl.se//:path*',
            },
        ];
    },
};

module.exports = nextConfig;
