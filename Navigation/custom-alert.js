(function () {
  "use strict";

  var nativeAlert = window.alert.bind(window);
  var swalLoaded = false;
  var alertQueue = [];

  function formatAlertMessage(message) {
    if (message === null || message === undefined) return "";
    if (typeof message === "object") {
      if (message.message) return String(message.message);
      try {
        return JSON.stringify(message);
      } catch (e) {
        return String(message);
      }
    }
    return String(message);
  }

  function getAlertIcon(message) {
    var text = formatAlertMessage(message).toLowerCase();
    if (/siker|sikeres|sikerult|sikeresen|sikerrel|success|ok\b|rendben|bejelentkezes/i.test(text)) {
      return "success";
    }
    if (/hiba|error|nem|nincs|kell|hibas|rossz|fail|invalid|sikertelen|vagy/i.test(text)) {
      return "error";
    }
    return "info";
  }

  function showSwal(message) {
    if (!window.Swal) {
      nativeAlert(message);
      return;
    }

  var formattedMsg = formatAlertMessage(message);
  var icon = getAlertIcon(message); // success, error, info [cite: 528]

  // Ha az ikon "success" -> TOAST
  var isToast = icon === "success";

  if (isToast) {
    window.Swal.fire({
      toast: true,
      position: "top-end", //"bottom-right", jobb felső, vagy alsó sarok
      icon: icon,
      title: formattedMsg,
      showConfirmButton: false,
      timer: 3000, // 3 másodperc múlva eltűnik
      timerProgressBar: true
    });
  } else {
    //Modal alert
    window.Swal.fire({
      title: formattedMsg,
      icon: icon,
      confirmButtonText: "OK",
      allowOutsideClick: false,
      allowEscapeKey: true,
      customClass: {
        popup: "swal2-custom-popup"
      }
    });
  }
  }

  function processQueue() {
    if (!swalLoaded || alertQueue.length === 0) return;
    var message = alertQueue.shift();
    showSwal(message);
  }

  function enqueueAlert(message) {
    alertQueue.push(message);
    if (swalLoaded && alertQueue.length === 1) {
      processQueue();
    }
  }

  function loadSwal() {
    if (window.Swal) {
      swalLoaded = true;
      processQueue();
      return;
    }

    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    script.defer = true;
    script.addEventListener("load", function () {
      swalLoaded = true;
      processQueue();
    });
    script.addEventListener("error", function () {
      swalLoaded = false;
    });
    document.head.appendChild(script);
  }

  window.alert = function (message) {
    if (!swalLoaded) {
      enqueueAlert(message);
      if (!window.Swal) {
        loadSwal();
      }
      return;
    }
    showSwal(message);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSwal);
  } else {
    loadSwal();
  }
})();