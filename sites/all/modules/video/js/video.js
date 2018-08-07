(function ($) {
    var video = $('video')[0];
    video.width = 640;

    var paused_time = 0;
    var current_time = 0;
    var r = false;

    myTimer = setInterval(function () {
        current_time = Math.floor(video.currentTime);

        if (video.paused || video.seeking) {
            paused_time = current_time;
        }

        if (current_time - paused_time == 3) {
            paused_time = current_time;
            video.pause();
            r = confirm('Are you there?');
        }

        if (r) {
            video.play();
            r = false;
        }
    }, 100);
}(jQuery));