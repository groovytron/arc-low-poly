
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
    prg.vertexPositionAttribute     = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.vertexNormalAttribute         = glContext.getAttribLocation(prg, "aVertexNormal");
    glContext.enableVertexAttribArray(prg.vertexNormalAttribute);
    prg.textureCoordsAttribute         = glContext.getAttribLocation(prg, "aTextureCoord");
    glContext.enableVertexAttribArray(prg.textureCoordsAttribute);
    prg.colorTextureUniform         = glContext.getUniformLocation(prg, "uColorTexture");
    prg.pMatrixUniform                 = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform                = glContext.getUniformLocation(prg, 'uMVMatrix');
    prg.nMatrixUniform                 = glContext.getUniformLocation(prg, 'uNMatrix');
    prg.lightPositionUniform           = glContext.getUniformLocation(prg, 'uLightPosition');
}

function initScene(){
    // TODO: Implement Me
    // Create billboard(s)
    console.log("Il faut créer un billboard!");
}
// Might be unuseful
function initLights(){
    glContext.uniform3f(prg.lightPositionUniform, 0, 0, 1);
}
function drawObject(modelViewMatrix, vertexBuffer, normalsBuffer, textureBuffer, indexBuffer, indexCount){
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, modelViewMatrix);
    mat4.copy(nMatrix, modelViewMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);
    glContext.uniformMatrix4fv(prg.nMatrixUniform, false, nMatrix);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, normalsBuffer);
    glContext.vertexAttribPointer(prg.vertexNormalAttribute, 3, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, textureBuffer);
    glContext.vertexAttribPointer(prg.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.activeTexture(glContext.TEXTURE0);
    glContext.bindTexture(glContext.TEXTURE_2D, texColorTab[0]);
    glContext.uniform1i(prg.colorTextureUniform, 0);
    glContext.drawElements(glContext.TRIANGLES, indexCount, glContext.UNSIGNED_SHORT,0);
}
function startRenderLoop(){
    initLights(); // Remove if unused
    mat4.identity(mvMatrix); // Must be done in drawScene()
    renderLoop();
}
function drawScene(){
    glContext.clearColor(0.4, 0.4, 1.0, 1.0);
    //glContext.enable(glContext.DEPTH_TEST);
    glContext.blendFunc(glContext.ONE, glContext.ONE_MINUS_SRC_ALPHA);
    glContext.enable(glContext.BLEND);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);
    mat4.perspective(pMatrix, degToRad(60), c_width / c_height, 0.1, 1000.0);
    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    if(indicesArray.length > 0){
        translationMat = mat4.create();
        mat4.identity(translationMat);
        mat4.translate(translationMat, translationMat, [tx, ty, tz]);
        rotateModelViewMatrixUsingQuaternion(true);
        var modelViewMatrix = mat4.multiply(mat4.create(), translationMat, mvMatrix);
        drawObject(modelViewMatrix, vertexBuffersArray[0], normalBuffersArray[0], textureBuffersArray[0], indexBuffersArray[0], indicesArray[0].length);
    }
}
function initWebGL(){
    glContext = getGLContext('webgl-canvas');
    initProgram();
    initScene();
    loadModel("models/OBJ/Table/Table-Final-uvmapped.obj"); // Must be done in Billboard class
    initTextureWithImage( "models/OBJ/Table/uvmap.png", texColorTab ); // Must be done in Billboard class
    startRenderLoop(); // Might be reaplced by renderLoop()
}
