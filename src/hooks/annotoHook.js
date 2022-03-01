import { useCallback, useEffect } from "react";

const useAnnoto = (widgetConfig) => {
    useEffect(() => {
        if (window.Annoto.api) {
            return;
        }

        const { dispose } = window.Annoto.on('ready', (api) => {
            window.Annoto.api = api;
            delete window.Annoto.initing;
        });

        return () => dispose();
    }, []);

    const setAnnoto = useCallback(async () => {
        if (window.Annoto.initing) {
            console.warn('Annoto is initing');
            return;
        }

        if (window.Annoto.loading) {
            console.warn('Annoto is loading');
            return;
        }

        if (!widgetConfig) {
            return;
        }

        if (window.Annoto.api) {
            window.Annoto.loading = true;
            await window.Annoto.api.load(widgetConfig);
            delete window.Annoto.loading;
        } else {
            window.Annoto.initing = true;
            window.Annoto.boot(widgetConfig);
        }
    }, [widgetConfig]);

    useEffect(() => {
        setAnnoto()
            .catch(err => console.error(err));
    }, [setAnnoto]);
}

export default useAnnoto;
