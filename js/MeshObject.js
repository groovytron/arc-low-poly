class MeshObject {
    constructor(objFileName, textureFileName, x, y, z) {
        this.modelViewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.nMatrix = mat4.create(); // No idea what is is but we need it
        this.x = x;
        this.y = y;
        this.z = z;
        this.loadModel(objFileName);
        // initTextureWithImage(textureFileName, texColorTab);
    }

    handleOBJModel(filename, data){
        console.info(filename + ' has been retrieved from the server');

        var objData = new OBJ.Mesh(data);
        this.vertexBuffer = getVertexBufferWithVertices(objData.vertices);
        this.normalsBuffer = getVertexBufferWithVertices(objData.vertexNormals);
        this.textureBuffer = getVertexBufferWithVertices(objData.textures);
        this.indexBuffer = getIndexBufferWithIndices(objData.indices);
        this.indices = objData.indices;
    }

    showPayloadInfo(filename, payload ) {
        console.info(filename + ' has been retrieved from the server');
        console.info("v: " + payload.vertices);
        console.info("i: " + payload.indices);
        console.info("c: " + payload.colors);

        var passTable = [];
        passTable = payload.indices;

        console.info("#polygones : " + passTable.length / 3);
    }

    /**
    * Creates the buffers that contain the geometry of the model
    */
    handleJSONModel(filename, payload) {
        showPayloadInfo(filename, payload);

        this.indices = payload.indices;

        //initializes buffers: sends data from the JavaScript arrays to the graphics card
        this.vertexBuffer = getVertexBufferWithVertices(payload.vertices);
        this.normalsBuffer = getVertexBufferWithVertices(payload.normals);
        this.indexBuffer = getIndexBufferWithIndices(payload.indices);
    }

    /**
    * Creates an AJAX request to load a model asynchronously
    */
    loadModel(filename){
        var request = new XMLHttpRequest();
        console.info('Requesting ' + filename);
        request.open("GET",filename);

        request.onreadystatechange = () => {
          if (request.readyState == 4) {
            if(request.status == 404) {
                console.info(filename + ' does not exist');
             }
            else {
                var re = /(?:\.([^./]+))?$/;
                var ext = re.exec(filename)[1];
                console.info('file: '+ filename + ', ext: ' + ext);
                switch( ext ){
                    case "json": this.handleJSONModel(filename, JSON.parse(request.responseText)); break;
                    case "obj":  this.handleOBJModel(filename, request.responseText); break;
                    default: console.info("unknown format extension: " + ext );
                }
            }
          }
        }
        request.send();
    }

    draw(){
        mat4.identity(this.modelViewMatrix);

        //Translates the mv matrix
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(this.x, this.y, this.z));
        //Multiplies the model View matrix of the object with the view matrix of the scene
        mat4.multiply(this.modelViewMatrix, this.modelViewMatrix, mvMatrix);
        mat4.multiply(this.modelViewMatrix, translationMat, mvMatrix);

        glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, this.modelViewMatrix);
        mat4.copy(this.nMatrix, this.modelViewMatrix);
        mat4.invert(this.nMatrix, this.nMatrix);
        mat4.transpose(this.nMatrix, this.nMatrix);
        glContext.uniformMatrix4fv(prg.nMatrixUniform, false, this.nMatrix);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.normalsBuffer);
        glContext.vertexAttribPointer(prg.vertexNormalAttribute, 3, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textureBuffer);
        glContext.vertexAttribPointer(prg.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        glContext.activeTexture(glContext.TEXTURE0);
        glContext.bindTexture(glContext.TEXTURE_2D, texColorTab[0]);
        glContext.uniform1i(prg.colorTextureUniform, 0);
        glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT,0);
    }
}
