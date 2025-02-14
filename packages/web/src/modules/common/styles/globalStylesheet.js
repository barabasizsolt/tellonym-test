export const globalStylesheet = {
  html: {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    height: '100%',
    overflow: 'hidden',
  },
  body: {
    height: '100%',
    overflow: 'auto',
  },
  '#root': {
    height: '100%',
    display: 'flex',
    backgroundColor: '#f3f3f3',
  },
  '#root > [data-radium]': {
    display: 'flex',
    flex: 1,
  },
  'input.input-underline:-webkit-autofill': {
    '-webkit-transition':
      'color 9999s ease-out, background-color 9999s ease-out',
    '-webkit-transition-delay': '9999s',
  },
  'input.input-underline:-webkit-autofill:hover': {
    '-webkit-transition':
      'color 9999s ease-out, background-color 9999s ease-out',
    '-webkit-transition-delay': '9999s',
  },
  'input.input-underline:-webkit-autofill:focus': {
    '-webkit-transition':
      'color 9999s ease-out, background-color 9999s ease-out',
    '-webkit-transition-delay': '9999s',
  },
  'input.input-underline:-webkit-autofill:active': {
    '-webkit-transition':
      'color 9999s ease-out, background-color 9999s ease-out',
    '-webkit-transition-delay': '9999s',
  },
  'input.input-underline::placeholder': {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  '.cr-image': {
    color: 'transparent',
  },
  '.s-alert-info': {
    background: '#FF005A',
    color: '#fff',
  },
  '.s-alert-success': {
    background: '#62bf2f',
    color: '#fff',
  },
  '.s-alert-error': {
    background: '#a94442',
    color: '#fff',
  },
  '.s-alert-box': {
    zIndex: 97,
  },
  mediaQueries: {
    '(max-width: 767px)': {
      '.qc-cmp2-persistent-link': {
        display: 'none !important',
      },
    },
  },
  '#snap-login #snap-button > div > div > button': {
    alignItems: 'center',
    borderRadius: 24,
    boxShadow: '0px 6px 12px rgba(198, 181, 35, 0.08)',
    cursor: 'pointer',
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
    width: 300,
  },
  '#snap-login #snap-button > div > div > button:not([data-test-id="snap-connect-login-button-in-progress"])':
    {
      backgroundPosition: '32px 14px',
      backgroundSize: 20,
    },
  '#snap-login #snap-button > div > div > button > span': {
    color: '#14171A',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 0,
    width: '100%',
  },
  '#snap-connect #snap-button > div > div > button': {
    cursor: 'pointer',
    background: 'none',
    height: 'auto',
    padding: 0,
    position: 'relative',
    width: '100%',
  },
  '#snap-connect #snap-button > div > div > button:hover': {
    boxShadow: 'none',
  },
  '#snap-connect #snap-button > div > div > button > span': {
    fontWeight: 'normal',
    fontSize: 16,
    paddingLeft: 0,
    width: '100%',
  },
  /* override fontello.css styling - gets rid of excess whitespace */
  '[class^="icon-"]:before, [class*=" icon-"]:before': {
    marginLeft: 0,
    marginRight: 0,
    display: 'block' /* adjusts for unicode moving outside of icon tag */,
  },
}
