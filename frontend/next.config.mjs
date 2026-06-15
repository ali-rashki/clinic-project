/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.prod.website-files.com",
            },
            {
                protocol: "https",
                hostname: "archline.ir",
            },
            {
                protocol: "https",
                hostname: "aranostudio.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },

            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
            {
                protocol: "https",
                hostname: "cdn.pixabay.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;