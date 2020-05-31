// resource: https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp

// webP image format is better than png/jpeg counterparts.
// And have a meaningful browser supports, but safari and ios do not support at all (only JPEG 2000)
//

// check_webp_feature:
//   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
//   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
// lossless is the recommended one to convert images. // n1 difference
export default function isWebpSupported(feature, callback) {
    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    };
    var img = new Image();
    img.onload = function () {
        var result = (img.width > 0) && (img.height > 0);
        callback(feature, result);
    };
    img.onerror = function () {
        callback(feature, false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
}


/* COMMENTS
n1:
What’s the difference between the two? Think of it as being a lot like the differences between JPEG and PNG images. JPEGs are lossy, and PNG images are lossless. Use regular old WebP when you want to convert your JPEG images. Use WebP Lossless when you’re converting your PNGs.
https://css-tricks.com/using-webp-images
*/