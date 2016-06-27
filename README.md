# jQuery tubular
[![MIT Licensed][ico-license]][license]

Tubular is a jQuery plugin that lets you set a YouTube video as your page
background.  Just attach it to your page wrapper element, set some options, and
you're on your way.

```js
$('.my-wrapper-element').tubular({
    // options
});
```

## Installing

You can install tubular in 3 ways:

 - Using bower: (`bower require --save schakel-tubular`)
 - By downloading [a release][releases]
 - By cloning the repo (`git clone ...`)

## Tubular's *hello world*

The simplest way to incorporate tubular is shown below. The example assumes
you're happy with the default options and will show you kittens in no time!

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <div id="wrapper">
            <h1>Hello world!</h1>
            <p>Lorem ipsum kittens</p>
        </div>

        <script src="path/to/jquery.min.js"></script>
        <script src="path/to/tubular.min.js"></script>
        <script>
        $(document).ready(function(){
            $('#wrapper').tubular({
                videoId: '0Bmhjf0rKe8'
            });
        });
        </script>
    </body>
</html>
```


## Options and defaults
```js
$('element').tubular({
    ratio: 16/9 // usually either 4/3 or 16/9 -- tweak as needed
    videoId: 'ZCAnLxRvNNc' // toy robot in space is a good default, no?
    mute: true
    repeat: true
    width: $(window).width() // no need to override
    wrapperZIndex: 99
    playButtonClass: 'tubular-play'
    pauseButtonClass: 'tubular-pause'
    muteButtonClass: 'tubular-mute'
    volumeUpClass: 'tubular-volume-up'
    volumeDownClass: 'tubular-volume-down'
    increaseVolumeBy: 10 // increment value; volume range is 1-100
    start: 0 // starting position in seconds
    end: false, // Set to an int to end the video at the given time.
    pageBackground: true // Set to false to align to element, true to align to body.
});
```

## Events

The following events are fired from the element that the tubular was
instantiated on:

 - `tubuar.start` is fired when the playback is started for the first time.
 - `tubular.end` is fired when the video has ended and won't loop
 - `tubular.restart` is fired when the video has ended and is about to loop

## A word of caution
Tubular does not design your website for you. It works here thanks to alpha
transparency on these gray boxes and the png logo on the top left. I built
tubular thinking it would help experienced web designers and developers add
some subtle background elements - emphasis on subtle - to their work. I'm sure
there are some tasteful ways to use tubular and many, many more not so tasteful
ways to use it. With great power comes great responsibility. The kitten example
above is not to be taken seriously! :-)

## Assumptions by Tubular
Tubular does one thing well. It takes a single video from YouTube at injects it
as a full-screen background on a website. It scales the video, offsets the
video and provides some basic controls for the video.  That's it.

Tubular makes some assumptions on how your website works. First, it assumes you
have a single wrapper element under the body tag that envelops all of your
website content. It promotes that wrapper to z-index: 99 and position:
relative. You can configure the z-index value in the options. So it's assuming
your wrapper can accept positioning without breaking your site.

Finally, tubular injects the YouTube video you specified as an iframe using
fixed position at z-index: 1.  Browsers that do not support fixed positioning
will not support tubular. Also, since the YouTube iframe API requires the HTML5
postMessage feature, browsers that do not support it (I'm looking at you, IE7)
will not support tubular - tubular will return false before any changes are
made to your CSS in IE7.

[license]: LICENSE
[ico-license]: http://img.shields.io/github/license/schakelmarketeers/tubular.svg?style=flat
[releases]: https://github.com/SchakelMarketeers/tubular/releases

