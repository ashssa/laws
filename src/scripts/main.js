// src/scripts/main.js

// 1. Toastr 設定
if (typeof toastr !== 'undefined') {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "250",
        "hideDuration": "1500",
        "timeOut": "1500",
        "extendedTimeOut": "0",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "fadeOut",
        "onShown": function() {
            const toastElement = this;
            toastElement.style.opacity = '1';
        },
        };
}