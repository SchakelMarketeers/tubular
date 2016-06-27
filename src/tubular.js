/**
 * jQuery tubular plugin
 * @author Sean McCambridge
 * @see http://www.seanmccambridge.com/tubular
 * @version 1.0
 * @since 2010
 * @license MIT License
 */

(function($, window) {

    'use strict';

    // defaults
    var defaults = {
        ratio: 16 / 9, // usually either 4/3 or 16/9 -- tweak as needed
        videoId: 'ZCAnLxRvNNc', // toy robot in space is a good default, no?
        mute: true,
        repeat: true,
        width: $(window).width(),
        wrapperZIndex: 99,
        playButtonClass: 'tubular-play',
        pauseButtonClass: 'tubular-pause',
        muteButtonClass: 'tubular-mute',
        volumeUpClass: 'tubular-volume-up',
        volumeDownClass: 'tubular-volume-down',
        increaseVolumeBy: 10,
        start: 0,
        end: false,
        videoQuality: 'hd1080',
        relatedVideos: 0,
        pageBackground: true // Change to false if using for an element only.
    };

    // Set to false just before seeking
    var initialFire = 0;

    // methods

    var tubular = function(node, options) { // should be called on the wrapper div
        var player; // The Youtube player
        var $node = $(node); // cache wrapper node

        options = $.extend({}, defaults, options);

        // build container
        var tubularContainer = $(
            '<div id="tubular-container" style="overflow:' +
            'hidden; position: fixed; z-index: 1; width: 100%; height: 100%">' +
            '<div id="tubular-player" style="position: absolute"></div></div>' +
            '<div id="tubular-shield" style="width: 100%; height: 100%;' +
            'z-index: 2; position: absolute; left: 0; top: 0;"></div>'
        );

        // set up css prereq's, inject tubular container and set up wrapper defaults
        tubularContainer.insertBefore($node);
        $node.css({
            position: 'relative',
            'z-index': options.wrapperZIndex
        });

        // Resize function updates width, height and offset of player after
        // resize/init
        var resize = function() {
            var width = 0;
            var height = 0;

            if (options.pageBackground) {
                width = $(window).width();
                height = $(window).height();
            } else {
                width = $node.width();
                height = $node.height();
            }

            var pWidth; // player width, to be defined
            var pHeight; // player height, tbd

            var $tubularPlayer = $('#tubular-player');

            // when screen aspect ratio differs from video, video must center
            // and underlay one dimension

            // if new video height < window height (gap underneath)
            if (width / options.ratio < height) {
                // get new player width
                pWidth = Math.ceil(height * options.ratio);

                // player width is greater, offset left; reset top
                $tubularPlayer.width(pWidth).height(height).css({
                    left: (width - pWidth) / 2,
                    top: 0
                });
            } else { // new video width < window width (gap to right)

                // get new player height
                pHeight = Math.ceil(width / options.ratio);

                // player height is greater, offset top; reset left
                $tubularPlayer.width(width).height(pHeight).css({
                    left: 0,
                    top: (height - pHeight) / 2
                });
            }

        };

        // Handlers
        var onPlayerReady = function(e) {
            resize();
            if (options.mute) {
                e.target.mute();
            }

            e.target.seekTo(options.start);
            e.target.playVideo();

            initialFire = 1;
        };

        var onPlayerStateChange = function(state) {
            // if video ended, act accordingly
            if (state.data === 0) {

                // If repeating, repeat
                if (options.repeat) {
                    $node.trigger('tubular.restart');
                    player.seekTo(options.start);

                // Or fire event and stop
                } else {
                    $node.trigger('tubular.end');
                }
            }

            if (state.data === 3 && initialFire === 1) {
                initialFire = 2;
            } else if (state.data === 1 && initialFire === 2) {
                initialFire = 3;
                $node.trigger('tubular.start');
            }
        };

        // set up iframe player, use global scope so YT api can talk
        window.player = window.player || {};
        window.onYouTubeIframeAPIReady = function() {
            player = new YT.Player('tubular-player', {
                width: options.width,
                height: Math.ceil(options.width / options.ratio),
                videoId: options.videoId,
                playerVars: {
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    iv_load_policy: 3, //jscs:ignore
                    cc_load_policy: 0, //jscs:ignore
                    wmode: 'transparent',
                    vq: options.videoQuality,
                    rel: options.relatedVideos,
                    end: options.end,
                    origin: document.location.host
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange
                }
            });
        };

        // events
        $(window).on('resize.tubular', function() {
            resize();
        });

        // Play
        $('.' + options.playButtonClass).on('click', function(e) {
            e.preventDefault();
            player.playVideo();
        });

        // Pause
        $('.' + options.pauseButtonClass).on('click', function(e) {
            e.preventDefault();
            player.pauseVideo();
        });

        // Mute
        $('.' + options.muteButtonClass).on('click', function(e) {
            e.preventDefault();
            if (player.isMuted()) {
                player.unMute();
            } else {
                player.mute();
            }
        });

        // Volume down
        $('.' + options.volumeDownClass).on('click', function(e) {
            e.preventDefault();
            var currentVolume = player.getVolume();
            if (currentVolume < options.increaseVolumeBy) {
                currentVolume = options.increaseVolumeBy;
            }
            player.setVolume(currentVolume - options.increaseVolumeBy);
        });

        // Volume up
        $('.' + options.volumeUpClass).on('click', function(e) {
            e.preventDefault();
            if (player.isMuted()) {
                player.unMute(); // if mute is on, unmute
            }
            var currentVolume = player.getVolume();
            if (currentVolume > 100 - options.increaseVolumeBy) {
                currentVolume = 100 - options.increaseVolumeBy;
            }
            player.setVolume(currentVolume + options.increaseVolumeBy);
        });
    };

    // Load YT Iframe API (always via TLS)
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Register plugin
    $.fn.tubular = function(options) {
        return this.each(function() {
            if (!$.data(this, 'tubular_instantiated')) { // let's only run one
                $.data(this, 'tubular_instantiated',
                tubular(this, options));
            }
        });
    };

})(jQuery, window);
