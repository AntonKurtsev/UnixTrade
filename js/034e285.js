var sectionBg=document.querySelector(".b-absolutely-bg1"),sectionOffset=document.querySelector(".b-absolutely").offsetTop;window.addEventListener("scroll",function(){var e=window.pageYOffset||document.documentElement.scrollTop;767<windowWidth&&(sectionBg.style.transform="translateY("+.25*(e-sectionOffset)+"px)")});
/*var homePage={videoSection:animatedBlocksParam(".homepage-videosection"),statsSection:animatedBlocksParam(".homepage-stats"),bigDigitsTrust:document.querySelector(".big-digits-trust"),bigDigitsStrategies:document.querySelector(".big-digits-strategies")};window.addEventListener("load",function(){$(".homepage .page-header .animate-visible").removeClass("animate-visible"),$(".home-owl-carousel.owl-carousel").owlCarousel({autoplay:!0,autoplayTimeout:3e3,items:3,responsive:{0:{items:1},768:{items:2},1024:{items:3},1170:{items:3},1400:{items:4}}})}),window.addEventListener("scroll",function(){var e=window.pageYOffset||document.documentElement.scrollTop;767<windowWidth&&(homePage.videoSection.section&&(homePage.videoSection.sectionBg.style.transform="translateY("+.25*(e-homePage.videoSection.sectionOffset)+"px)"),homePage.statsSection.section&&(homePage.statsSection.sectionBg.style.transform="translateY("+.25*(e-homePage.statsSection.sectionOffset)+"px)")),homePage.bigDigitsTrust&&isVisible(homePage.bigDigitsTrust)&&incrementDigits.init(".big-digits-trust"),homePage.bigDigitsStrategies&&isVisible(homePage.bigDigitsStrategies)&&incrementDigits.init(".big-digits-strategies")});*/
var homePage = {
    videoSection: animatedBlocksParam(".start-with"),
    statsSection: animatedBlocksParam(".homepage-stats"),
    bigDigitsTrust: document.querySelector(".big-digits-trust"),
    bigDigitsStrategies: document.querySelector(".big-digits-strategies")
};
window.addEventListener("load", function() {
    $(".homepage .page-header .animate-visible").removeClass("animate-visible"), $(".home-owl-carousel.owl-carousel").owlCarousel({
        autoplay: !0,
        autoplayTimeout: 3e3,
        items: 3,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1024: {
                items: 3
            },
            1170: {
                items: 3
            },
            1400: {
                items: 4
            }
        }
    })
}), window.addEventListener("scroll", function() {
    var e = window.pageYOffset || document.documentElement.scrollTop;
    767 < windowWidth && (homePage.videoSection.section && (homePage.videoSection.sectionBg.style.transform = "translateY(" + .25 * (e - homePage.videoSection.sectionOffset) + "px)"), homePage.statsSection.section && (homePage.statsSection.sectionBg.style.transform = "translateY(" + .25 * (e - homePage.statsSection.sectionOffset) + "px)")), homePage.bigDigitsTrust && isVisible(homePage.bigDigitsTrust) && incrementDigits.init(".big-digits-trust"), homePage.bigDigitsStrategies && isVisible(homePage.bigDigitsStrategies) && incrementDigits.init(".big-digits-strategies")
});
var drawCircles = function() {
    var g = document.querySelector(".header-wave").clientHeight,
        c = document.querySelector(".header-wave").clientWidth,
        e = document.getElementById("wave");
    e.height = g, e.width = c;
    var m = e.getContext("2d"),
        l = 90,
        d = 1;
    return {
        update: function() {
            m.clearRect(0, 0, c, g);
            for (var e, t, i, a, s = 0; s < 100; s++)
                for (var o = 0; o < 10; o++) {
                    var n = 150 * Math.sin(.3 * (s + l)) + 50 * Math.sin(.5 * (o + l)),
                        r = 4 * (Math.sin(.3 * (s + l)) + 1) + 4 * (Math.sin(.5 * (o + l)) + 1);
                    e = 150 * s - l * s, t = 1.15 * g - n - 60 * o, i = 2 * r / 10, a = r / 2, m.beginPath(), m.arc(e, t, i, 0, 2 * Math.PI, !1), m.closePath(), m.fillStyle = "rgba(77, 145, 208, " + a + ")", m.shadowColor = "rgba(255, 250, 250, 0.65)", m.shadowBlur = parseInt(a), m.fill()
                }
            d ? l < 10 ? (l -= .05) < 1 && (d = 0) : l -= .07 : 80 < l ? 90 < (l += .05) && (d = 1) : l += .07, requestAnimationFrame(drawCircles.update)
        }
    }
}();
requestAnimationFrame(drawCircles.update);