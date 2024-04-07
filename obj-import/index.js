


// instantiate a loader
const loader = new OBJLoader();

// load a resource
loader.load(
	// resource URL
	'models/monster.obj',
	// called when resource is loaded
	function ( object ) {
const object = new THREE.Object3D();

// Set the initial scale
object.scale.set(1, 1, 1);

// Scale up the object
object.scale.multiplyScalar(2); // Scale up by a factor of 2
		scene.add( object );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);