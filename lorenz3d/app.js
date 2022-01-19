//scene camera & renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let alpha = 0;
let dist = 90;
camera.position.set(dist*Math.sin(alpha),10,dist*Math.cos(alpha));
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.querySelector(".scene").appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

//here lorenz code starts
const sigma = 10;
const rho = 28;
const beta = 8/3;
//parameters
let time = 0.0001;

let color_list = [
                "#32535f",
                "#0a777a",
                "#4aa881",
                "#73efe8",
                "#ecf3b0"];

class ball {
constructor(x, y, z, color) {
    this.x = x;
    this.y = y;
    this.z = z;

    //mesh creation
    this.material = new THREE.MeshBasicMaterial({
        color: color,
        //wireframe: true
    });

    this.head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5,0), this.material);
    this.line = new THREE.Line(0, new THREE.LineBasicMaterial({color: color}));
    scene.add(this.head, this.line);
    //mesh end

    this.list = [];
    }

    upball(){
    this.list.push(new THREE.Vector3(this.x, this.y, this.z-25));
    if (this.list.length > 30){
        this.list.shift();
    }
    let dy = (this.x * (rho - this.z) - this.y) * time;
    let dx = (sigma * (this.y - this.x)) * time;
    let dz = (this.x * this.y - beta * this.z) * time;
    this.x += dx
    this.y += dy
    this.z += dz
    }

    updateball() {
        this.head.position.set(this.x, this.y, this.z-25);
    }

    updateLine(){
        this.line.geometry = new THREE.BufferGeometry().setFromPoints(this.list);
    }

    bigupdate(){
        this.updateball();
        this.updateLine();
        this.upball();
    }
}
//here Lorenz code ends

const array_balls = [];

//a = new ball(0.03, 0, 0, color_list[0]);

function arrayfill(a){
    for(let i = 0; i < a; i++){
    newBall = new ball((Math.random()-0.5)*300, (Math.random()-0.5)*300, Math.random()*200-100, color_list[Math.floor(Math.random()*(color_list.length))])
    array_balls.push(newBall);
    };
};
arrayfill(50);


//letter
let letter;
const loader = new THREE.GLTFLoader();
loader.load("./letter/lorenzA.gltf", (a)=>{
    letter = a.scene.children[0];
    scene.add(letter);
    letter.material = new THREE.MeshBasicMaterial({color: "white"});
    letter.position.set(-50,0,-50);
})
//letter

//stars start
const particlegeometry = new THREE.BufferGeometry;
const particlesamount = 5000;

const particlesarray = new Float32Array(particlesamount * 3);


for(let i = 0; i < particlesamount*3; i++){
    particlesarray[i] = (Math.random() - 0.5)*300
}

particlegeometry.setAttribute("position", new THREE.BufferAttribute(particlesarray, 3))

const particles = new THREE.Points(particlegeometry, new THREE.PointsMaterial({color: "#234a5e",size: (Math.random()*0.5)+0.1}));
scene.add(particles);
//stars end


//helper grid!
const gridHelper = new THREE.GridHelper(100, 10, "#0d2531", "#0d2531");
scene.add(gridHelper);


function animate(){
    requestAnimationFrame(animate);
    //update
    
    array_balls.forEach( x => {
        x.bigupdate();
    });

    scene.rotation.y += 0.008;

    if (time < 0.005){
        time += 0.00001;
    }

    if (dist > 30){
        dist -= 0.1;
        camera.position.set(dist*Math.sin(alpha),10,dist*Math.cos(alpha));
    }
    controls.update();
    renderer.render(scene, camera);
};
animate();
