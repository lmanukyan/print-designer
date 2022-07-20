import { store } from '@/store'

export const ComputedMutator = (module, name, setter) => ({
    get() {
        return store.state[module][name];
    },
    set(value) {
        store.commit(`${module}/${setter}`, value);
    },
});