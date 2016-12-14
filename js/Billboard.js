class Billboards {
    constructor(x, y, objFileName, mtlFileName) {
        this.x = x;
        this.y = y;
        this.objFileName = objFileName;
        this.mtlFileName = mtlFileName;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.colorBuffer = null;
        this.indices = [];
        this.vertices = [];
        this.colors = [];   // Might not be used
        this.faces = [];    // Contains indices, texture index and normal index
        this.normals = [];
        this.textureCoords = [];
        this.facesMaterialsIndex = [];
        this.materials = [];
        this.mvMatrix = mat4.create();
        this.init();
    }
}
