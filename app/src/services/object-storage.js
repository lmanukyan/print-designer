const ObjectStorageService = {
    get: (key, deafultValue = {}) => {
        let value = deafultValue;
        try {
            let parsedObject = JSON.parse(localStorage.getItem(key));
            if( typeof parsedObject  === 'object' && parsedObject !== null ){
                value = parsedObject;
            }
        } catch(e) {
            //
        }
        return value;
    },

    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
}

export default ObjectStorageService;