var WebGLFacade = (function () {
    var gl; // A global variable for the WebGL context

    this.start = function (canvasName) {
        var canvas = document.getElementById(canvasName);

        // Initialize the GL context
        gl = initWebGL(canvas);

        // Only continue if WebGL is available and working
        if (!gl) {
            return;
        }

        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);
        // Near things obscure far things
        gl.depthFunc(gl.LEQUAL);
        // Clear the color as well as the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    this.initWebGL = function(canvas) {
        gl = null;

        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        // Ajust viewport according to the canvas' dimensions
        gl.viewport(0, 0, canvas.width, canvas.height);
        // If we don't have a GL context, give up now
        if (!gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
        }

        return gl;
    }

    return {
        start: this.start
    }
})();
