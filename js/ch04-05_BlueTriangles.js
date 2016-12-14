var vertexBuffer=null;
var indexBuffer=null;
var colorBuffer=null;
var indices=[];
var vertices=[];
var colors=[];
var mvMatrix=mat4.create();
var pMatrix=mat4.create();
var translationMat=mat4.create();
function initShaderParameters(a){
	a.vertexPositionAttribute=glContext.getAttribLocation(a,"aVertexPosition");
	glContext.enableVertexAttribArray(a.vertexPositionAttribute);
	a.colorAttribute=glContext.getAttribLocation(a,"aColor");
	glContext.enableVertexAttribArray(a.colorAttribute);
	a.pMatrixUniform=glContext.getUniformLocation(a,"uPMatrix");
	a.mvMatrixUniform=glContext.getUniformLocation(a,"uMVMatrix")
}

var rotationAroundZ=0;
var indexCounter=0;
var withPerspective=0;
function rotateOnYEverySecond(){
	rotationAroundZ+=0.1;
	indexCounter++;
	setTimeout(rotateOnYEverySecond,16)
}

function initBuffers(){
	var a=[];
	var k=[];
	var i=[];
	a.push(-1,-1,0);
	k.push(1,-1,0);
	i.push(0,0.707,0);
	var b=[];
	b.push(0,0,0);
	var f=[];
	f.push(0,0,0);
	var d=[];
	d.push(0,0,0);
	var j=0;
	var g=0;
	const c=7;
	const e=0.156;
	for(var h=0;h<c;++h){
		j=h/(c-1);
		console.log(a[0],a[1],a[2]);
		console.log(k[0],k[1],k[2]);
		console.log(i[0],i[1],i[2]);
		b[0]=a[0]*(1-e)+k[0]*e;
		b[1]=a[1]*(1-e)+k[1]*e;
		f[0]=k[0]*(1-e)+i[0]*e;
		f[1]=k[1]*(1-e)+i[1]*e;
		d[0]=i[0]*(1-e)+a[0]*e;
		d[1]=i[1]*(1-e)+a[1]*e;
		g=-j/2;vertices.push(a[0],a[1],g);
		vertices.push(k[0],k[1],g);
		vertices.push(i[0],i[1],g);
		indices.push(0+h*3,1+h*3,2+h*3);
		colors.push(j,j,1,1);
		colors.push(j,j,1,1);
		colors.push(j,j,1,1);
		a[0]=b[0];a[1]=b[1];
		k[0]=f[0];k[1]=f[1];
		i[0]=d[0];i[1]=d[1]
	}
	vertexBuffer=getVertexBufferWithVertices(vertices);
	colorBuffer=getVertexBufferWithVertices(colors);
	indexBuffer=getIndexBufferWithIndices(indices);
	rotateOnYEverySecond()
}

function drawScene(){
	glContext.clearColor(0.9,0.9,0.9,1);
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clear(glContext.COLOR_BUFFER_BIT|glContext.DEPTH_BUFFER_BIT);
	glContext.viewport(0,0,c_width,c_height);
	mat4.identity(pMatrix);
	mat4.identity(mvMatrix);
	if(withPerspective){
		mat4.perspective(pMatrix,degToRad(60),c_width/c_height,0.1,10000);
		var b=0+0.1*Math.cos(rotationAroundZ);
		var a=0.3+0.1*Math.sin(rotationAroundZ);
		var c=-2;translationMat=mat4.create();
		mat4.identity(translationMat);
		mat4.translate(translationMat,translationMat,[b,a,c]);
		mat4.multiply(mvMatrix,translationMat,mvMatrix);
		mvMatrix=mat4.rotateY(mvMatrix,mvMatrix,3.14159265358)
	}else{
		var b=0+0.1*Math.cos(rotationAroundZ);
		var a=0.3+0.1*Math.sin(rotationAroundZ);
		var c=0;
		translationMat=mat4.create();
		mat4.identity(translationMat);
		mat4.translate(translationMat,translationMat,[b,a,c]);mat4.multiply(mvMatrix,translationMat,mvMatrix)
	}

	glContext.uniformMatrix4fv(prg.pMatrixUniform,false,pMatrix);
	glContext.uniformMatrix4fv(prg.mvMatrixUniform,false,mvMatrix);
	glContext.bindBuffer(glContext.ARRAY_BUFFER,vertexBuffer);
	glContext.vertexAttribPointer(prg.vertexPositionAttribute,3,glContext.FLOAT,false,0,0);
	glContext.bindBuffer(glContext.ARRAY_BUFFER,colorBuffer);
	glContext.vertexAttribPointer(prg.colorAttribute,4,glContext.FLOAT,false,0,0);
	glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER,indexBuffer);
	glContext.drawElements(glContext.TRIANGLES,indices.length,glContext.UNSIGNED_SHORT,0)
}
function initWebGL(){
	glContext=getGLContext("webgl-canvas");
	initProgram();
	initBuffers();
	renderLoop()
	}
function changeProjectionMode(){
	if(withPerspective){
		withPerspective=0
		}else{
			withPerspective=1
		}
	};