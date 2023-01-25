const removeImports = require("next-remove-imports")();

// set-cookie
const headers = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubdomains; preload",
  },
  // {
  //  key: "Content-Security-Policy",
  //  value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  // },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  
  {
    key: "Access-Control-Allow-Origin",
    value: "*"
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // webpack: (config, { dev, isServer }) => {
  //   if (!dev && !isServer) {
  //     config.resolve.alias = {
  //       ...config.resolve.alias,
  //       "react/jsx-runtime.js": "preact/compat/jsx-runtime",
  //       react: "preact/compat",
  //       "react-dom/test-utils": "preact/test-utils",
  //       "react-dom": "preact/compat",
  //     };
  //   }

  //   return config;
  // },

  images: {
    domains: ["webgate.fr", "www.gravatar.com", "assets2.razerzone.com", "images.unsplash.com"]
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: headers,
      },
    ];
  },
};

module.exports = removeImports(nextConfig);

// module.exports = nextConfig;
