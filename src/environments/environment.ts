// src/environments/environment.ts
export const environment = {
  production: false,
  // SheetDB — replace with your real SheetDB base URL
  sheetdbUrl: 'https://sheetdb.io/api/v1/YOUR_SHEET_ID',
  sheetdbReadKey: 'YOUR_READ_ONLY_API_KEY',

  // Firebase — replace with your real config
  firebase: {
    apiKey:            'YOUR_FIREBASE_API_KEY',
    authDomain:        'your-project.firebaseapp.com',
    projectId:         'your-project-id',
    storageBucket:     'your-project.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId:             'YOUR_APP_ID',
  },

  // YouTube Data API — restrict to your domain in Google Cloud Console
  youtubeApiKey: 'YOUR_YOUTUBE_DATA_API_KEY',
  youtubeApiUrl: 'https://www.googleapis.com/youtube/v3',

  // Creator defaults (overridden at runtime by SheetDB Creator tab)
  creatorName:     'Alex Creator',
  creatorHandle:   '@alexcreator',
  creatorChannelId: 'YOUR_CHANNEL_ID',
};
