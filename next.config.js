// @ts-check
module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
  */
 // @ts-ignore
 const app_env = process.env.APP_ENV || 'development';

 // @ts-ignore
 if (app_env === 'development') {
  return {
    env: {
      authBase: 'http://localhost:3000',
      RESPONSE_TYPE: process.env.RESPONSE_TYPE,
      CLIENT_ID: process.env.CLIENT_ID,
      REDIRECT_URI: process.env.REDIRECT_URI,
      SCOPE: process.env.SCOPE,
      STATE: process.env.STATE,
      TENANCY: process.env.TENANCY,
    },
    reactStrictMode: false,
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://account-service-twvszsnmba-uc.a.run.app/api/:path*',
        },
      ];
    },
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,POST,PUT,DELETE' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          ],
        },
      ];
    },
  }
  }
 // @ts-ignore
 if (app_env === 'staging') {
    return {
      env: {
        authBase: 'https://accounts.tucar.dev',
      },
      reactStrictMode: false,
      async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://account-service-twvszsnmba-uc.a.run.app/api/:path*',
          },
        ];
      },
      async headers() {
        return [
          {
            source: '/api/:path*',
            headers: [
              { key: 'Access-Control-Allow-Credentials', value: 'true' },
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,POST,PUT,DELETE' },
              { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
            ],
          },
        ];
      },
    }
  }

  return {
    env: {
      authBase: 'https://accounts.tucar.app',
    },
    reactStrictMode: false,
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://account-service-13535404425.us-central1.run.app/api/:path*',
        },
      ];
    },
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,POST,PUT,DELETE' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          ],
        },
      ];
    },
  }
}