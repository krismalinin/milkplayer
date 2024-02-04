const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const background = document.querySelector('body');

let camera, scene, renderer, controls, model;

let albumArt = document.querySelector('#freqArt');

const audio = document.getElementById('audio');
const auContext = new AudioContext();

let src = auContext.createMediaElementSource(audio);

const analyser = auContext.createAnalyser();

src.connect(analyser);
analyser.connect(auContext.destination)

analyser.smoothingTimeConstant = 0.5;

audio.addEventListener('play', function() {
    auContext.resume();
});

analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);

const dataArray = new Uint8Array(bufferLength);
console.log(dataArray);

randomColor = () => {
    let randomNumber = Math.floor(Math.random() * 360);
    background.style.backgroundColor = "hsl(" + randomNumber + ", 100%, 50%)";
}

//mapping color to X/Y
let hueBrowserRatio;
let lightnessBrowserRatio;

let width;
let height;

// set the number of canvas pixels, scaled for screen resolution
let pxScale = window.devicePixelRatio;

let clear = document.getElementById('clearBtn');
let stopDraw = document.getElementById('toggleOffBtn');
let startDraw = document.getElementById('toggleOnBtn');

let imageDraw = true;

clear.onclick = function(){
    context.clearRect(0, 0, width, height);
    draw();
    vertices();
    animate();
}

stopDraw.onclick = function(){
    imageDraw = false;
    stopDraw.style.display = "none";
    startDraw.style.display = "block";
}

startDraw.onclick = function(){
    draw();
    imageDraw = true;
    startDraw.style.display = "none";
    stopDraw.style.display = "block";
}

            
function colorScale() {
    let browserWidth = window.innerWidth;
    let browserHeight = window.innerHeight;
                
    hueBrowserRatio = browserWidth / 360;
    lightnessBrowserRatio = browserHeight / 100;
}
            
function getPosition(event) {
    let xPos = event.clientX;
    let yPos = event.clientY;
    updateColor(xPos, yPos);
}
            
function updateColor(xPos, yPos) {
    let hue = Math.ceil(xPos / hueBrowserRatio);
    let lightness = 100 - Math.ceil(yPos / lightnessBrowserRatio);
                
    if (lightness < 50) {
        lightness += 50 - lightness
    }
                
    if (lightness > 90) {
        lightness -= lightness - 90
    }
    
    background.style.backgroundColor = "hsl(" + hue + ", 100%, " + lightness + "%)";
}

function init() {
    scene = new THREE.Scene();
    
        // full browser canvas
    width = window.innerWidth;
    height = window.innerHeight;

        // fixed canvas size
        // width = canvas.width;
        // height = canvas.height;


    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    canvas.width = width * pxScale;
    canvas.height = height * pxScale;

        // normalize the coordinate system
    context.scale(pxScale, pxScale);
    
    camera = new THREE.PerspectiveCamera(80, width/height, 1, 1000);
    camera.position.set(10, 10, 10);
    scene.add(camera);
    
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 0);
    scene.add(light);
    
    renderer = new THREE.WebGLRenderer({alpha: 1, antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    document.body.appendChild(renderer.domElement);
}

function draw() {
        let pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        let pixelData = pixels.data;
}

function depthMap() {
    const auCanvas = document.getElementById('drawing');
    console.log (auCanvas);
    const auContext = auCanvas.getContext('2d');
    
    auContext.drawImage(albumArt, 0, 0, 200, 200);
    
    let imageData = auContext.getImageData(0, 0, auCanvas.width, auCanvas.height);
    
    let data = imageData.data;
    
    return data;
}

function vertices() {
    data = depthMap();
    
    let loader = new THREE.TextureLoader();
    
    let material = new THREE.MeshLambertMaterial({map: loader.load('media/milkfeettextflash-sq-green.jpg'), side: THREE.DoubleSide});
    
    let geometry = new THREE.PlaneGeometry(800, 800, bufferLength - 1, bufferLength - 1);
    mesh = new THREE.Mesh(geometry, material);
    
    console.log(mesh.geometry.attributes.position.array.length);
    
    for (let i = 0; i <= data.length; i += 4) {
        let vertex = (i / 4) * 3;
        mesh.geometry.attributes.position.array[vertex + 2] = data[i];
    }
    
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = Math.PI / 2;
    
    geometry.computeVertexNormals();
    
    scene.add(mesh);
    
    renderer.render(scene, camera);
}

function animate() {
    renderer.render(scene, camera);  
    if (model) {
        model.rotation.y += 0.07;
    }
    controls.update();
    
    analyser.getByteTimeDomainData(dataArray);
    
    for (let y = 0; y < bufferLength; y++) {
        let height = dataArray[y] - 1000;
        for (let x = 0; x < bufferLength; x++) {
            let index = x + y * bufferLength;
            let vertex = index * 3
            mesh.geometry.attributes.position.array[vertex + 2] = height;
        }
    }
    
    mesh.geometry.attributes.position.needsUpdate = true;
    
    requestAnimationFrame(animate);
}

      // when the whole page has loaded, including all dependent resources
window.addEventListener('load', () => {
    randomColor();
    colorScale();
    init();
    vertices();
    draw();
    animate();
});

      // resize canvas when window is resized (for full browser canvas only)
function windowResize() {
    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', () => {
    windowResize;
    colorScale();
    init();
    draw();
      });

window.addEventListener('mousemove', getPosition);

const image = document.createElement("img");
image.src = "media/milkfeet_cartonface_nobg.png";
document.addEventListener("mousemove", function(event){
	if (image.complete) {
        if (imageDraw == true) {
            context.drawImage(image, event.pageX - 50, event.pageY - 50, 100, 150)
        }
	}
});