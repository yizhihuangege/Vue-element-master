var passiveEvent = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function () {
      passiveEvent = true;
    }
  });
  window.addEventListener("test", null, opts);
} catch (e) {}

// in my case I need both passive and capture set to true, change as you need it.
passiveEvent = passiveEvent ? {
  capture: true,
  passive: true
} : true;

//if you need to handle mouse wheel scroll
var supportedWheelEvent = "onwheel" in HTMLDivElement.prototype ? "wheel" :
  document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
