$(document).ready(function () {
    $(window).scroll(function () {
        let scrollPos = $(document).scrollTop();
        $('nav a').each(function () {
            let section = $($(this).attr('href'));
            if (section.position().top <= scrollPos + 10) {
                $('nav a').removeClass('active');
                $(this).addClass('active');
            }
        });
    });
});