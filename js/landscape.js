let camera, scene, renderer, controls, model;

let image = document.querySelector('#freqArt');

const audio = document.getElementById('audio');

const context = new AudioContext();

let src = context.createMediaElementSource(audio);

const analyser = context.createAnalyser();

src.connect(analyser);
analyser.connect(context.destination);

analyser.smoothingTimeConstant = 0.5;

audio.addEventListener('play', function() {
    context.resume();
});

analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);

const dataArray = new Uint8Array(bufferLength);
console.log(dataArray);

function init() {
    scene = new THREE.Scene();
    
    let width = window.innerWidth;
    let height = window.innerHeight;

  // custom cubemap
    scene.background = new THREE.CubeTextureLoader()
        .setPath('media/milkmap/')
        .load( [
        'n_D.png', //rightish
        'p_U.png', //left
        'p_R.png', //top
        'n_B.png', //bottom
        'n_L.png', //leftish
        'p_F.png' //right
    ]);
    
    camera = new THREE.PerspectiveCamera(80, width/height, 1, 1000);
    camera.position.set(10, 10, 10); //was 10/10/10
    scene.add(camera);
    
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 0);
    scene.add(light);
    
    let loader = new THREE.GLTFLoader();
    
    loader.load(
        'media/scene.gltf',
        function (gltf) {
            model = gltf.scene;
            let cartonMaterial = new THREE.MeshBasicMaterial({envMap: scene.background, side: THREE.DoubleSide});
            model.traverse((o) => {
                if (o.isMesh) o.material = cartonMaterial;
            });
            scene.add(model);
            
            gltf.animations;
            gltf.scene;
            gltf.scenes;
            gltf.cameras;
            gltf.asset;
        }
    );
    
    //let material = new THREE.MeshBasicMaterial({envMap: scene.background, side: THREE.DoubleSide});
  
    //let sphereGeometry = new THREE.SphereGeometry(height/3, 30, 30);
    //let sphere = new THREE.Mesh(sphereGeometry, material);
    //sphere.position.y = 5;
    //sphere.castShadow = true;
    //scene.add(sphere);

    
  renderer = new THREE.WebGLRenderer({alpha: 1, antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);
}

function depthMap() {
    const canvas = document.getElementById('drawing');
    console.log (canvas);
    const context = canvas.getContext('2d');
    
    context.drawImage(image, 0, 0, 200, 200);
    
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    let data = imageData.data;
    
    return data;
}

function vertices() {
    data = depthMap();
    
    let loader = new THREE.TextureLoader();
    
    let material = new THREE.MeshLambertMaterial({map: loader.load('media/milkfeettextflash-sq-pink.jpg'), side: THREE.DoubleSide});
    
    let geometry = new THREE.PlaneGeometry(800, 800, bufferLength -1, bufferLength -1);
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

function windowResize() {
    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('load', () => {
    init();
    vertices();
    animate();
})

window.addEventListener('resize', windowResize);
