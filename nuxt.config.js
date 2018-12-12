/* eslint import/no-extraneous-dependencies: "off" */
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const SentryPlugin = require('@sentry/webpack-plugin');

const shouldCache = !!process.env.CI;

/* istanbul ignore next */
module.exports = {
  /*
  ** Headers of the page
  */
  env: {
    IS_TESTNET: process.env.IS_TESTNET,
    INTERCOM_APPID: process.env.INTERCOM_APPID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  },
  head: {
    title: 'LikeCoin - Reinventing the Like',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { hid: 'description', name: 'description', content: 'With our unique LikeRank algorithm and decentralized Like button, we trace content footprint and reward all creators involved. This is called Proof of Creativity.' },
      { hid: 'og_title', property: 'og:title', content: 'LikeCoin - Reinventing the Like' },
      { hid: 'og_description', property: 'og:description', content: 'With our unique LikeRank algorithm and decentralized Like button, we trace content footprint and reward all creators involved. This is called Proof of Creativity.' },
      { hid: 'og_image', property: 'og:image', content: 'https://like.co/images/og/default.png' },
      { hid: 'og_image_alt', property: 'og:image:alt', content: 'LikeCoin' },
      { hid: 'og_image_width', property: 'og:image:width', content: '1200' },
      { hid: 'og_image_height', property: 'og:image:height', content: '630' },
      { hid: 'theme-color', name: 'theme-color', content: '#D2F0F0' },
    ],
    script: [
      { src: 'https://use.typekit.net/ube6iww.js' },
      { src: '/vendor/typekit.js' },
      { src: '/vendor/fb/pixel.js' },
      { src: '/vendor/fb/sdk.js' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,600|Material+Icons' },
    ],
  },
  /*
   ** Custom loading component
   */
  loading: '~/components/BlockProgress.vue',

  render: {
    csp: {
      enabled: true,
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': [
          "'self'",
          'data:',
          'blob:',
          '*',
        ],
        'script-src': [
          "'self'",
          /* gtm inline code */
          "'sha256-X3ZM8SMe34uV9LglkNh69UN/Vkuo+blzT0E7mN1rUnQ='",
          "'sha256-2xBjy9xHKMthpdhRq5DplVZ7EkoWxMla4wyUmB1jyFY='",
          'www.google-analytics.com',
          'www.googletagmanager.com',
          'www.googleadservices.com',
          '*.google.com',
          'www.gstatic.com',
          'www.gstatic.cn',
          'googleads.g.doubleclick.net',
          'cdn.mouseflow.com',
          'ajax.googleapis.com',
          'js.intercomcdn.com',
          'connect.facebook.net',
          'player.vimeo.com',
          'use.typekit.net',
          '*.intercom.io',
        ],
        'frame-src': [
          'www.google.com',
          'player.vimeo.com',
          '*.facebook.com',
          '*.facebook.net',
          '*.doubleclick.net',
          '*.like.co',
          'like.co',
        ],
        'connect-src': [
          "'self'",
          'data:',
          '*',
          'wss://*.intercom.io',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'fonts.googleapis.com',
        ],
        'report-uri': [
          process.env.SENTRY_REPORT_URI,
        ],
      },
    },
  },

  router: {
    middleware: 'sliding-menu',
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/verify/:uuid/:coupon',
        name: 'verify-uuid-coupon',
        component: resolve(__dirname, 'pages/verify/_uuid/index.vue'),
      });
      routes.push({
        name: 'id-eth-amount',
        path: '/:id/eth/:amount?',
        component: resolve(__dirname, 'pages/_id/index.vue'),
      });
      routes.push({
        name: 'id-eth',
        path: '/:id/eth',
        component: resolve(__dirname, 'pages/_id/index.vue'),
      });
      routes.push({
        name: 'id-amount',
        path: '/:id/:amount?',
        component: resolve(__dirname, 'pages/_id/index.vue'),
      });
      routes.push({
        name: 'in-embed-id-amount',
        path: '/in/embed/:id/:amount?',
        component: resolve(__dirname, 'pages/in/embed/_id/index.vue'),
      });
      routes.push({
        name: 'in-embed-id-button-amount',
        path: '/in/embed/:id/button/:amount?',
        component: resolve(__dirname, 'pages/in/embed/_id/button.vue'),
      });
      routes.push({
        name: 'pay-merchantId-amount',
        path: '/pay/:merchantId/:amount?',
        component: resolve(__dirname, 'pages/pay/_merchantId/index.vue'),
      });
    },
  },
  /*
  ** Global CSS
  */
  css: [
    { src: 'vue-material/dist/vue-material.min.css', lang: 'css' },
    { src: '@likecoin/ui-vue/dist/ui-vue.css', lang: 'css' },
    { src: '~/assets/theme.scss', lang: 'scss' }, // include vue-material theme engine
    { src: '~/assets/index.scss', lang: 'scss' },
    'swiper/dist/css/swiper.min.css',
    '~/assets/css/main.css',
  ],
  modules: [
    ['@nuxtjs/google-tag-manager', {
      id: process.env.GTM_ID || 'GTM-XXXXXXX',
      pageTracking: true,
    }],
    '@nuxtjs/sentry',
  ],
  plugins: [
    { src: '~/plugins/EthHelper', ssr: false },
    { src: '~/plugins/vue-cookie', ssr: false },
    { src: '~/plugins/vue-i18n' },
    { src: '~/plugins/vue-material' },
    { src: '~/plugins/likecoin-ui-vue' },
    { src: '~/plugins/vue-simple-svg' },
    { src: '~/plugins/vue-intercom', ssr: false },
    { src: '~/plugins/vue-vimeo-player', ssr: false },
    { src: '~/plugins/vue-image-lightbox', ssr: false },
    { src: '~/plugins/vue-swiper', ssr: false },
    { src: '~/plugins/vue-clipboard2', ssr: false },
    { src: '~/plugins/vue-portal', ssr: false },
    { src: '~/plugins/vue-scroll-reveal', ssr: false },
    { src: '~/plugins/testing' },
  ],
  /*
  ** Add axios globally
  */
  build: {
    cache: shouldCache,
    extractCSS: true,
    uglify: { cache: shouldCache },
    babel: {
      presets: ({ isServer }) => [
        [
          '@nuxt/babel-preset-app',
          {
            targets: isServer
              ? { node: '10' }
              : { browsers: ['defaults'] },
          },
        ],
      ],
    },

    extend(config, { isClient }) {
      config.devtool = '#source-map'; // eslint-disable-line no-param-reassign
      if (shouldCache) {
        config.plugins.push(new HardSourceWebpackPlugin());
      }
      if (process.env.RELEASE && process.env.SENTRY_AUTH_TOKEN) {
        config.plugins.push(new SentryPlugin({
          release: process.env.RELEASE,
          include: ['.nuxt/dist'],
          ignore: ['node_modules', '.nuxt/dist/server-bundle.json', '.nuxt/dist/img', '.nuxt/dist'],
          configFile: '.sentryclirc',
        }));
      }
      if (isClient) {
        /*
        ** Run ESLINT on save
        */
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },
};
