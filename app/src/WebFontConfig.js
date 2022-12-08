const WebFontConfig = {
    google: {
        families: [
            'Splash', 
            'Dancing Script',
            'Oswald',
            'Raleway',
            'Lobster',
            'Pacifico',
            'Rubik Gemstones',
            'Rubik Spray Paint',
            'Rubik Vinyl',
            'Caveat',
            'Press Start 2P',
            'Marck Script',
            'Neucha',
            'Kosugi Maru',
            'Bad Script',
            'Vollkorn SC'
        ]
    },
    timeout: 2000
}

export const AvailableFontFamilies = [
    ...WebFontConfig.google.families
];

export default WebFontConfig;