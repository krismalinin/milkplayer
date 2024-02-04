let camera, scene, renderer, controls, model;

function init() {
    scene = new THREE.Scene();
    
    let width = window.innerWidth;
    let height = window.innerHeight;

  // custom cubemap
    scene.background = new THREE.CubeTextureLoader()
        .setPath('media/milkmap2/')
        .load( [
        'p_F.png', //rightish
        'n_B.png', //left
        'p_U.png', //top
        'p_R.png', //bottom
        'n_L.png', //leftish
        'n_D.png' //right
    ]);
    
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

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);  

    controls.update();
}

function windowResize() {
    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('load', () => {
    init();
    animate();
})

window.addEventListener('resize', windowResize);
