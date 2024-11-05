let scene, camera, renderer;
let arm, forearm, hand;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create robotic arm parts
    const armGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    const armMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.y = 1;

    const forearmGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
    const forearmMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    forearm = new THREE.Mesh(forearmGeometry, forearmMaterial);
    forearm.position.y = 1.75;

    const handGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const handMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    hand = new THREE.Mesh(handGeometry, handMaterial);
    hand.position.y = 0.9;

    // Assemble the arm
    arm.add(forearm);
    forearm.add(hand);
    scene.add(arm);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the arm parts
    arm.rotation.y += 0.01;
    forearm.rotation.x += 0.02;
    hand.rotation.z += 0.03;

    renderer.render(scene, camera);
}

init();

// Handle window resizing
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});