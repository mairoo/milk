import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pincoin-s3.s3.amazonaws.com',
                port: '',
                pathname: '/media/**',
            },
        ],
        unoptimized: true,
    },
};

export default nextConfig;
