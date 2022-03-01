import React, { useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import useAnnoto from '../hooks/annotoHook';

const VideoJS = (props) => {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const { options, onReady } = props;

    /*-------------------------------------Annoto-----------------------------------------*/
    const videoWrapRef = React.useRef(null);
    // Store configurations in a state. This will avoid unnecessary re-renders
    const [widgetConfig, setWidgetConfig] = useState(null);

    useEffect(() => {
        if (!videoRef) {
            return;
        }

        // Configurations can be initialized only after videoRef initialization
        setWidgetConfig({
            // Set to provided clientId
            // clientId: '...',
            widgets: [
                {
                    player: {
                        type: 'videojs',
                        params: { videojs },
                        element: videoWrapRef.current,
                    },
                    timeline: {
                        overlay: true,
                    },
                },
            ],
        });
    }, [videoWrapRef]);

    useAnnoto(widgetConfig);

    // An example of a secure SSO login. This method can be called at any time
    const auth = async (userToken) => {
        if (window.Annoto.api) {
            await window.Annoto.api.auth(userToken);
        }

        const { dispose } = window.Annoto.on('ready', async (api) => {
            await api.auth(userToken);
            dispose();
        });
    };
    /*-------------------------------------Annoto-----------------------------------------*/

    useEffect(() => {
        // make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) return;

            const player = playerRef.current = videojs(videoElement, options, async() => {
                console.log('player is ready');

                onReady && onReady(player);
            });
        } else {
            // you can update player here [update player through props]
            // const player = playerRef.current;
            // player.autoplay(options.autoplay);
            // player.src(options.sources);
        }
    }, [options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player ref={videoWrapRef}>
            <video
                ref={videoRef}
                className="video-js vjs-big-play-centered"
            >
                <source src="https://demo-assets.annoto.net/portals.mp4" type="video/mp4"/>
                Your browser does not support HTML5 video.
            </video>
        </div>
    );
}

export default VideoJS;
