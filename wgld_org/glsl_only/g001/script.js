window.onload = main;

function main() {
  const C = document.getElementById("canvas");
  const CW = 512;
  const CH = 512;
  const FPS = 1000 / 30;

  let MX = 0.5;
  let MY = 0.5;
  let time;
  let tempTime = 0.0;

  C.width = CW;
  C.height = CH;

  // Add event
  C.addEventListener("mousemove", mouseMove, true);
  // C.addEventListener("change", checkChange, true);

  /** @type {WebGLRenderingContext} */
  const GL = C.getContext("webgl");

  console.log(create_shader(GL, "vs"))
  // Program
  const program = create_program(
    GL,
    create_shader(GL, "vs"),
    create_shader(GL, "fs")
  );
  const uniLocation = [
    GL.getUniformLocation(program, "time"),
    GL.getUniformLocation(program, "mouse"),
    GL.getUniformLocation(program, "resolution"),
  ];

  // prettier-ignore
  const position = [
    -1.0,  1.0,  0.0,
     1.0,  1.0,  0.0,
    -1.0, -1.0,  0.0,
     1.0, -1.0,  0.0,
  ]
  // prettier-ignore
  const index = [
    0, 2, 1,
    1, 2, 3
  ]

  const vPosition = create_vbo(position);
  const vIndex = create_ibo(index);
  const vAttLocation = GL.getAttribLocation(program, "position");
  GL.bindBuffer(GL.ARRAY_BUFFER, vPosition);
  GL.enableVertexAttribArray(vAttLocation);
  GL.vertexAttribPointer(vAttLocation, 3, GL.FLOAT, false, 0, 0);
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vIndex);

  // init
  GL.clearColor(0.0, 0.0, 0.0, 1.0);
  const startTime = new Date().getTime();

  render();

  function render() {
    time = (new Date().getTime() - startTime) * 0.001;

    // カラーバッファをクリア
    GL.clear(GL.COLOR_BUFFER_BIT);

    // time
    GL.uniform1f(uniLocation[0], time + tempTime);
    // mouse
    GL.uniform2fv(uniLocation[1], [MX, MY]);
    //resolution
    GL.uniform2fv(uniLocation[2], [CW, CH]);

    GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
    GL.flush();

    setTimeout(render);
  }

  function create_vbo(data) {
    return create_buffer_object(GL, GL.ARRAY_BUFFER, new Float32Array(data));
  }

  function create_ibo(data) {
    return create_buffer_object(
      GL,
      GL.ELEMENT_ARRAY_BUFFER,
      new Int16Array(data)
    );
  }

  function mouseMove(e) {
    mx = e.offsetX / CW;
    my = e.offsetY / CH;
  }
}

function create_program(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(param));
    console.error("Could not initialize shaders");
  }
  gl.useProgram(program);
  return program;
}
/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} id
 */
function create_shader(gl, id) {
  const scriptElement = document.getElementById(id);

  if (!scriptElement) {
    console.error("Shader script is none");
    return;
  }

  let shader;
  switch (scriptElement.type) {
    case "x-shader/x-vertex":
      shader = gl.createShader(gl.VERTEX_SHADER);
      break;
    case "x-shader/x-fragment":
      shader = gl.createShader(gl.FRAGMENT_SHADER);
      break;
    default:
      return;
  }

  gl.shaderSource(shader, scriptElement.text);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function create_buffer_object(gl, glEnum, typedArrayData) {
  const bufferObject = gl.createBuffer();
  gl.bindBuffer(glEnum, bufferObject);
  gl.bufferData(glEnum, typedArrayData, gl.STATIC_DRAW);
  gl.bindBuffer(glEnum, null);
  return bufferObject;
}
