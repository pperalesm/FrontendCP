const es = {
  common: {
    fieldRequired: 'Este campo es obligatorio',
    ok: 'OK!', // @demo remove-current-line
    cancel: 'Cancel', // @demo remove-current-line
    back: 'Back', // @demo remove-current-line
    signOut: 'Log Out', // @demo remove-current-line
  },
  emptyStateComponent: {
    generic: {
      heading: 'Ha habido un error inesperado',
      content: 'Por favor, inténtalo de nuevo más tarde.',
      button: 'Reintentar',
    },
  },
  SignInScreen: {
    emailFieldLabel: 'Correo electrónico',
    emailFieldInvalid: 'El correo electrónico debe ser válido',
    passwordFieldLabel: 'Contraseña',
    signIn: 'Iniciar sesión',
    invalidCredentials: 'Correo o contraseña incorrectos',
    forgotPassword: '¿Has olvidado la contraseña?',
    signUp: 'Crear cuenta',
  },
  SignUpScreen: {
    emailFieldLabel: 'Correo electrónico',
    emailFieldInvalid: 'El correo electrónico debe ser válido',
    passwordFieldLabel: 'Contraseña',
    passwordFieldInvalid:
      'La contraseña debe tener un mínimo de 8 caracteres, entre los cuales:\n- Una mayúscula\n- Una minúscula\n- Un número\n- Un signo',
    repeatedPasswordFieldLabel: 'Repetir contraseña',
    notSamePassword: 'Las contraseñas deben coincidir',
    signUp: 'Crear cuenta',
    signIn: 'Inicia sesión aquí',
    accountCreated: 'Cuenta creada con éxito',
    accountCreatedHint:
      'En breves momentos recibirás un correo electrónico de activación. Únicamente deberás hacer click en el enlace proporcionado.',
  },
  ActivateScreen: {
    procedure: 'Esta cuenta aún no ha sido activada.',
    procedureHint:
      'Por favor, comprueba que no hayas recibido el correo de activación en la bandeja de Spam. Cuando lo encuentres, únicamente deberás hacer click en el enlace proporcionado.',
    requestActivation: 'Reenviar correo de activación',
    activationRequested: 'Correo reenviado con éxito',
    signOut: 'Prueba con otra cuenta',
  },
  ActivatedScreen: {
    accountActivated: 'Cuenta activada con éxito',
  },
  ResetPasswordScreen: {
    emailFieldLabel: 'Correo electrónico',
    emailFieldInvalid: 'El correo electrónico debe ser válido',
    passwordFieldLabel: 'Nueva contraseña',
    passwordFieldInvalid:
      'La contraseña debe tener un mínimo de 8 caracteres, entre los cuales:\n- Una mayúscula\n- Una minúscula\n- Un número\n- Un signo',
    repeatedPasswordFieldLabel: 'Repetir nueva contraseña',
    notSamePassword: 'Las contraseñas deben coincidir',
    requestPasswordReset: 'Enviar correo de confirmación',
    signIn: 'Inicia sesión aquí',
    passwordResetRequested: 'Correo enviado con éxito',
    passwordResetRequestedHint:
      'En breves momentos recibirás un correo electrónico de confirmación. Únicamente deberás hacer click en el enlace proporcionado.',
  },
  PasswordResetScreen: {
    passwordReset: 'Contraseña restablecida con éxito',
  },
  NotebooksScreen: {
    title: 'Libretas',
  },
  EntriesScreen: {
    favorites: 'Favoritos',
  },
  PlansScreen: {
    title: 'Planes',
    active: 'Activo',
    days: 'días',
    warning:
      'Los planes de bienestar en ningún caso sustituyen la terapia. Si ves que los problemas se hacen cada vez más difíciles de afrontar, busca ayuda profesional.',
  },
  RoutinesScreen: {
    day: 'Día',
    start: 'Empezar',
    end: 'Terminar',
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: 'Your app, almost ready for launch!',
    exciting: '(ohh, this is exciting!)',
    letsGo: "Let's go!", // @demo remove-current-line
  },
  errorScreen: {
    title: 'Something went wrong!',
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: 'RESET APP',
    traceTitle: 'Error from %{name} stack', // @demo remove-current-line
  },
  // @demo remove-block-start
  errors: {
    invalidEmail: 'Invalid email address.',
  },
  demoNavigator: {
    componentsTab: 'Components',
    debugTab: 'Debug',
    communityTab: 'Community',
    podcastListTab: 'Podcast',
  },
  demoCommunityScreen: {
    title: 'Connect with the community',
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: 'Join us on Slack',
    joinUsOnSlack:
      'Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.',
    joinSlackLink: 'Join the Slack Community',
    makeIgniteEvenBetterTitle: 'Make Ignite even better',
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: 'Contribute to Ignite',
    theLatestInReactNativeTitle: 'The latest in React Native',
    theLatestInReactNative:
      "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: 'React Native Radio',
    reactNativeNewsletterLink: 'React Native Newsletter',
    reactNativeLiveLink: 'React Native Live',
    chainReactConferenceLink: 'Chain React Conference',
    hireUsTitle: 'Hire Infinite Red for your next project',
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: 'Send us a message',
  },
  demoShowroomScreen: {
    jumpStart: 'Components to jump start your project!',
    lorem2Sentences:
      'Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.',
    demoHeaderTxExample: 'Yay',
    demoViaTxProp: 'Via `tx` Prop',
    demoViaSpecifiedTxProp: 'Via `{{prop}}Tx` Prop',
  },
  demoDebugScreen: {
    howTo: 'HOW TO',
    title: 'Debug',
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: 'Send to Reactotron',
    reportBugs: 'Report Bugs',
    demoList: 'Demo List',
    demoPodcastList: 'Demo Podcast List',
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  // @demo remove-block-end
};

export default es;
export type Translations = typeof es;
