document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("scroll", function () {
        let scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
        document.querySelectorAll("nav a").forEach(function (link) {
            let section = document.querySelector(link.getAttribute("href"));
            if (section && section.offsetTop <= scrollPos + 10) {
                document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
                link.classList.add("active");
            }
        });
    });
});
