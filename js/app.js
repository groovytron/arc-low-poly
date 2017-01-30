
var vertexBuffersArray = [];
var indexBuffersArray = [];
var textureBuffersArray = [];
var normalBuffersArray = [];
var indicesArray = [];
var texColorTab = new Array();
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var nMatrix = mat4.create();
var currentRy = 0;
var tx = 0.0;
var ty = 0.2;
var tz = -10.5;
window.onkeydown = checkKey;
var movingStep = 1.0;
var meshObjects = [];

function checkKey(ev){
    switch(ev.keyCode){
        case 87: tz+=movingStep; break;
        case 83: tz-=movingStep; break;
        case 68: tx+=movingStep; break;
        case 65: tx-=movingStep; break;
        case 82: ty+=movingStep; break;
        case 70: ty-=movingStep; break;
        default:
          console.log(ev.keyCode);
        break;
    }
}
function initShaderParameters(prg){
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.vertexNormalAttribute = glContext.getAttribLocation(prg, "aVertexNormal");
    glContext.enableVertexAttribArray(prg.vertexNormalAttribute);
    prg.textureCoordsAttribute = glContext.getAttribLocation(prg, "aTextureCoord");
    glContext.enableVertexAttribArray(prg.textureCoordsAttribute);
    prg.colorTextureUniform = glContext.getUniformLocation(prg, "uColorTexture");
    prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
    prg.nMatrixUniform = glContext.getUniformLocation(prg, 'uNMatrix');
    prg.lightPositionUniform = glContext.getUniformLocation(prg, 'uLightPosition');
}

function initScene(){
    meshObjects.push(new MeshObject("models/OBJ/Table/Table-Final-uvmapped.obj", "models/OBJ/Table/uvmap.png", 0.0, 0.0, 0.0));
    meshObjects.push(new MeshObject("models/OBJ/Table/Table-Final-uvmapped.obj", "models/OBJ/Table/uvmap.png", 1.0, 1.0, 1.0));
    initLights();
    initTextureWithImage("models/OBJ/Table/uvmap.png", texColorTab);
}
// Might be unuseful
function initLights(){
    glContext.uniform3f(prg.lightPositionUniform, 0, 0, 1);
}

function startRenderLoop(){
    mat4.identity(mvMatrix); // Must be done in drawScene()
    renderLoop();
}
function drawScene(){
    glContext.clearColor(0.4, 0.4, 1.0, 1.0);
    glContext.blendFunc(glContext.ONE, glContext.ONE_MINUS_SRC_ALPHA);
    glContext.enable(glContext.BLEND);
    // glContext.disable(glContext.BLEND);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);
    mat4.perspective(pMatrix, degToRad(60), c_width / c_height, 0.1, 1000.0);
    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);

    translationMat = mat4.create();
    mat4.identity(translationMat);
    mat4.translate(translationMat, translationMat, [tx, ty, tz]);
    rotateModelViewMatrixUsingQuaternion(true);
    meshObjects.forEach( m => m.draw());
}
function initWebGL(){
    glContext = getGLContext('webgl-canvas');
    initProgram();
    initScene();
    startRenderLoop(); // Might be reaplced by renderLoop()
}
