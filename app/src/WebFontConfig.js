const WebFontConfig = {
    google: {
        families: [
            'Splash', 
            'Dancing Script'
        ]
    },
    timeout: 2000
}

export const AvailableFontFamilies = [
    ...WebFontConfig.google.families
];

export default WebFontConfig;