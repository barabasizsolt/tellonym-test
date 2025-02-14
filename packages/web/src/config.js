/**
 * This file is imported before optional polyfills
 */
import * as eventTypes from '@tellonym/core/events/types'
import { LOG_LEVEL } from '@tellonym/core/store/middleware/createLogger'
import { I18n } from './modules/common/locales/I18n'

/**
 * type reduxLogger = {
 *   actionType: string,
 *   logLevel: string,
 *   module: string,
 * }
 */
const reduxLogger = {
  actionType: 'analytics/ADD_EVENT',
  logLevel: LOG_LEVEL.ALL,
  module: 'analytics',
  eventValidation: false,
}

const appVersion = APP_VERSION

const appTranslations = [
  'de',
  'en',
  'es',
  'fr',
  'it',
  'pt',
  'ro',
  'ru',
  'sv',
  'tr',
]
const webTranslations = ['de', 'en'] // info.tellnonym.me
window.tnym.getLanguage = () => I18n.language.toLowerCase().replace(/-\w\w/, '')
const lang = window.tnym.getLanguage()
const browserLanguage = appTranslations.indexOf(lang) > -1 ? lang : 'en'
const webLanguage = webTranslations.indexOf(lang) > -1 ? lang : 'en'

export const config = {
  __app__: {
    appTranslations,
    appVersion,
    browserLanguage,
    webLanguage,
  },
  ads: {
    shouldUseTargetVideo: false,
  },
  analytics: {
    registered: {
      endpoint: 'log_client_events',
      threshold: 1,
    },
    unregistered: {
      endpoint: 'log_ur_client_events',
      threshold: 1,
    },
  },
  api: {
    client: `web:${appVersion}`,
    errorBlacklist: [
      eventTypes.UPDATE_ERROR,
      'friends/REFRESH_PEOPLE_SUGGESTIONS_ERROR',
      'friends/UPLOAD_CONTACTS_ERROR',
      'notifications/LOG_OPENED_PUSH_NOTIFICATION_ERROR',
      'notifications/SEEN_ERROR',
      'profile/LOG_SOCIAL_LINK_PRESS_ERROR',
      'reporting/REPORT_ERROR',
    ],
    homepage:
      process.env.REACT_APP_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.REACT_APP_ENV === 'testing'
        ? 'https://tnym.de'
        : process.env.REACT_APP_ENV === 'staging'
        ? 'https://staging.tellonym.me'
        : 'https://tellonym.me',
    host:
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'testing'
        ? 'https://api.tnym.de'
        : process.env.REACT_APP_ENV === 'staging'
        ? 'https://api-staging.tellonym.me'
        : 'https://api.tellonym.me',
    hostAnalytics:
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'testing' ||
      process.env.REACT_APP_ENV === 'staging'
        ? 'https://a.tnym.de'
        : 'https://a.tellonym.me',
    hostUpload:
      process.env.REACT_APP_ENV === 'development'
        ? 'https://upload.tnym.de'
        : 'https://upload.tellonym.me',
    isWeb: true,
    limit: window.tnym.isDesktop() ? 24 : 12,
    maxAnswerImageSize: 5000000,
    maxAvatarSize: 500000,
    userimg: {
      thumb: 'https://userimg.tellonym.me/thumb',
      xs: 'https://userimg.tellonym.me/xs',
      md: 'https://userimg.tellonym.me/md',
      lg: 'https://userimg.tellonym.me/lg',
      xs_v2: 'https://userimg.tellonym.me/xs-v2',
      md_v2: 'https://userimg.tellonym.me/md-v2',
      lg_v2: 'https://userimg.tellonym.me/lg-v2',
    },
    updateInterval: process.env.REACT_APP_ENV === 'development' ? 60000 : 30000,
  },
  appleSignIn: {
    clientId: 'de.tellonym.app.signin',
    scope: 'email',
    redirectURI:
      process.env.REACT_APP_ENV === 'development'
        ? 'http://hanneszeigmaldrauf.tellonym.me'
        : process.env.REACT_APP_ENV === 'staging'
        ? 'https://staging.tellonym.me'
        : 'https://tellonym.me',
    usePopup: true,
  },
  snapchatSignIn: {
    clientId:
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'testing'
        ? '76e40257-ce18-402c-ba93-e84314f4673c'
        : 'b0bc891b-622a-475d-b1d1-6b3daaef1d0c',
    redirectURI:
      process.env.REACT_APP_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.REACT_APP_ENV === 'testing'
        ? 'https://tnym.de'
        : process.env.REACT_APP_ENV === 'staging'
        ? 'https://staging.tellonym.me'
        : 'https://tellonym.me',
    scope: ['user.display_name', 'user.bitmoji.avatar', 'user.external_id'],
  },
  components: {
    ReadMore: {
      lineBreakWidth: 30,
      maxLength: 280,
    },
    SubscribeButton: {
      counterDuration: 3,
    },
    PageWordfilter: {
      limit: 10,
    },
    TextInput: {
      maxLength: 14999,
    },
    WriteTell: {
      daysMinToRemind: 7,
    },
  },
  Croppie: {
    config: {
      viewport: {
        width: 160,
        height: 160,
        type: 'circle',
      },
      boundary: {
        width: 200,
        height: 200,
      },
      enableOrientation: false,
      enableExif: true,
    },
    export: {
      circle: false,
      format: 'jpeg',
      quality: '0.9',
      size: {
        height: 600,
        width: 600,
      },
      type: 'blob',
    },
  },
  CroppieRedesign: {
    export: {
      format: 'jpeg',
      quality: '0.9',
      size: {
        height: 780,
        width: 600,
      },
      type: 'blob',
      circle: false,
    },
  },

  DeviceInfo: {
    deviceName: window.navigator.userAgent.substring(0, 100),
    deviceType: 'web',
    lang: webLanguage,
  },
  doNotDisturbRoutes: [
    '/',
    '/actions/parentalconsent',
    '/actions/parentalconsent/:token',
    '/actions/passwordreset/:token',
    '/login',
    '/login/help/methods',
    '/login/help/profiles',
    '/login/help/resetpassword',
    '/login/help/username',
    '/login/instagram/callback',
    '/register/email',
    '/register/password',
    '/register/username',
  ],
  externalLinks: {
    appstore: 'https://itunes.apple.com/de/app/id1265133033?mt=8',
    appStorePressDownload:
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'testing'
        ? 'https://testing.tnym.me/appstore'
        : 'https://tnym.me/appstore',
    imprint: 'https://info.tellonym.me/imprint',
    modcpAdminPage: 'https://modcp.tellonym.me/user',
    moderationInfo: 'https://info.tellonym.me/safety/moderation',
    openInApp:
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'testing'
        ? 'https://testing.tnym.me/open'
        : 'https://tnym.me/open',
    playstore: 'https://play.google.com/store/apps/details?id=de.tellonym.app',
    playStorePressDownload:
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'testing'
        ? 'https://testing.tnym.me/playstore'
        : 'https://tnym.me/playstore',
    store: 'https://info.tellonym.me/app',
    storePressDownload:
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'testing'
        ? 'https://testing.tnym.me/app'
        : 'https://tnym.me/app',
    tellonymInstagram: 'https://www.instagram.com/tellonym',
    tellonymTwitter: 'https://twitter.com/tellonym',
  },
  fullProfileCountryCodes: [],
  turnstile: {
    baseUrl: 'https://tellonym.me',
    siteKeys: {
      authentication: '0x4AAAAAAAAlCAlDJDud-dCw',
      sendTell: '0x4AAAAAAAAlCRuG7QXKYtOA',
    },
  },
  googleSignIn: {
    client_id:
      process.env.REACT_APP_ENV === 'development' ||
      process.env.REACT_APP_ENV === 'testing'
        ? '423176294381-hoo8t5v78be00b04vvo44uecs7g454fe.apps.googleusercontent.com'
        : '423176294381-su1k49qn1nm2hge728u9cbci1om3dn5h.apps.googleusercontent.com',
    fetch_basic_profile: false,
    scope: 'profile email',
  },
  helpers: {
    activateAdsOnIndex: window.tnym.isDesktop()
      ? [2, 6, 10, 14, 18, 22]
      : [2, 6, 10],
    fixedOffset: 2,
    friendSliderProbability: 0,
    iterationQuotient: window.tnym.isDesktop() ? 30 : 15,
    placementFrequency: 4,
    placementOffset: 2,
  },
  reduxLogger,
  Sentry: {
    config: {
      autoSessionTracking: false,
      debug: process.env.REACT_APP_ENV === 'development',
      dsn: 'https://20653ae7c38a4d1a979780125132c83f@o74781.ingest.sentry.io/1245331',
      enabled: process.env.REACT_APP_ENV !== 'development',
      environment: process.env.REACT_APP_ENV,
      release: appVersion,
      sampleRate: process.env.REACT_APP_ENV === 'development' ? 1.0 : 0.5,
      allowUrls: [
        /https?:\/\/(cdn|www|www2|www2-staging|hanneszeigmaldrauf)\.(tellonym|tnym)\.(me|de)\/static\/js/,
        /https?:\/\/unpkg.com/,
        /http:\/\/localhost:3000/,
      ],
      denyUrls: [
        /extensions\//i,
        /^chrome:\/\//i,
        /^.*pageFold\/ftpagefold_v.*\.js$/,
        /^https:\/\/raw\.githubusercontent\.com\/ampproject\/amphtml\/.*\/ads\/.*$/,
        /^\/diff\/templates\/ts\/dist\/viewability\/.*\.js$/,
      ],
      ignoreErrors: [
        '[undefined]: [undefined]',
        /\[undefined\]/,
        /Failed to fetch/,
        /Image is not a constructor/,
        /^Failed to load.*Document is already detached\.$/,
      ],
    },
    /**
     * string: excludes error if e.stack.includes(string) equals true
     * regex: excludes error if regex.test(e.stack) equals true
     */
    stackBlacklist: ['pubads'],
  },
  socialMediaLinksBar: {
    NETWORKS: {
      INSTAGRAM: {
        NAME: 'INSTAGRAM',
        ICON: 'instagram',
        getLink: (username) => `https://www.instagram.com/${username}`,
      },
      SNAPCHAT: {
        NAME: 'SNAPCHAT',
        ICON: 'snapchat-ghost',
        getLink: (username) => `https://www.snapchat.com/add/${username}`,
      },
      SPOTIFY: {
        NAME: 'SPOTIFY',
        ICON: 'spotify',
        getLink: (username) => `https://open.spotify.com/artist/${username}`,
      },
      TWITTER: {
        NAME: 'TWITTER',
        ICON: 'twitter',
        getLink: (username) => `https://twitter.com/${username}`,
      },
      YOUTUBE: {
        NAME: 'YOUTUBE',
        ICON: 'youtube-play',
        getLink: (username) => `https://www.youtube.com/${username}`,
      },
    },
  },
  store: {
    offline: {},
    version: '2.12.0',
  },
  WebViews: {
    CommunityRules:
      'https://help.tellonym.me/hc/sections/360001004780-Guidelines',
    Cookies: `https://info.tellonym.me/cookies?language=${webLanguage}`,
    CreditsView: 'https://www2.tellonym.me/credits.html',
    InfoCenter: `https://info.tellonym.me/?language=${webLanguage}`,
    Jobs: 'https://info.tellonym.me/jobs',
    Licenses: 'https://static.tellonym.me/public/info/licenses.txt',
    MoreTells: `https://tellonym.me/info/${webLanguage}/moreTells`,
    Privacy: `https://tellonym.me/legal/${webLanguage}/privacy`,
    Safety: 'https://info.tellonym.me/safety',
    SafetyFilter: `https://info.tellonym.me/safety/filters?language=${webLanguage}`,
    SafetyParents: 'https://info.tellonym.me/safety/parents',
    TellonymProfile: 'https://tellonym.me/Tellonym',
    Terms: `https://tellonym.me/legal/${webLanguage}/terms`,
  },
}
