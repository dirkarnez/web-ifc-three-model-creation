// import { ThreeScene } from './scene';
// import { IfcManager } from './ifc-manager';
import  * as  WebIFC from 'web-ifc';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function extractIndexedFaceSet(geometry) {
    const vertices = [];
    const indices = [];

    // Extract vertex positions
    const positionAttribute = geometry.getAttribute('position');
    for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);
    vertices.push(x, y, z);
    }

    // Extract face indices
    const indexAttribute = geometry.getIndex();
    if (indexAttribute) {
    for (let i = 0; i < indexAttribute.count; i += 3) {
        const a = indexAttribute.getX(i);
        const b = indexAttribute.getX(i + 1);
        const c = indexAttribute.getX(i + 2);
        indices.push(a, b, c);
    }
    } else {
    for (let i = 0; i < positionAttribute.count; i += 3) {
        indices.push(i, i + 1, i + 2);
    }
    }

    // Create IndexedFaceSet
    const indexedFaceSet = {
        coord: vertices,
        coordIndex: indices
    };

    return indexedFaceSet;
}

function CreateFace(numbers) {
    const positiveIntegers = numbers.map(num => new WebIFC.IFC4.IfcPositiveInteger(num));
    return new WebIFC.IFC4.IfcIndexedPolygonalFace(positiveIntegers)
}


function CreateFaceSet(node) {
    const geometry = extractIndexedFaceSet(node.geometry);

    const x = geometry.coord.reduce((prev, current, currentIndex) => {
        if (currentIndex % 3 == 0) {
            return [...prev, [current]];
        } else {
            return prev.map((ele, i) => i == prev.length - 1 ? [...ele, current] : ele)
        }
    }, []);

    const y = geometry.coordIndex.map(a => a + 1).reduce((prev, current, currentIndex) => {
        if (currentIndex % 3 == 0) {
            return [...prev, [current]];
        } else {
            return prev.map((ele, i) => i == prev.length - 1 ? [...ele, current] : ele)
        }
    }, []);

    // [[-1.,-1.,-1.],[-1.,-1.,1.],[-1.,1.,-1.],[-1.,1.,1.],[1.,-1.,-1.],[1.,-1.,1.],[1.,1.,-1.],[1.,1.,1.]]
    const coordinates = new WebIFC.IFC4.IfcCartesianPointList3D(x.map(a => a.map(b => new WebIFC.IFC4.IfcLengthMeasure(b))));
    // [
    //     CreateFace([1,2,4,3]),
    //     CreateFace([3,4,8,7]),
    //     CreateFace([7,8,6,5]),
    //     CreateFace([5,6,2,1]),
    //     CreateFace([3,7,5,1]),
    //     CreateFace([8,4,2,6])
    // ]
    const faceSet = new WebIFC.IFC4.IfcPolygonalFaceSet(coordinates, null, y.map(yy => CreateFace(yy)), null);
    ifcApi.WriteLine(modelID, faceSet);
    return faceSet;
}

// new WebIFC.IfcAPI().CreateModel();
function CreateAHU(ifcApi, modelID) {
    return new Promise((rs, rj) => {
        new GLTFLoader()
        .load(
            // resource URL
            'models/model.glb',
            // called when the resource is loaded
            function ( gltf ) {
                const contextLocation = new WebIFC.IFC4.IfcCartesianPoint([new WebIFC.IFC4.IfcLengthMeasure(0), new WebIFC.IFC4.IfcLengthMeasure(0), new WebIFC.IFC4.IfcLengthMeasure(0)]);
                ifcApi.WriteLine(modelID, contextLocation);
            
                const contextAxis = new WebIFC.IFC4.IfcDirection([new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(1)]);
                ifcApi.WriteLine(modelID, contextAxis);
            
                const contextRefDirection = new WebIFC.IFC4.IfcDirection([new WebIFC.IFC4.IfcReal(1), new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(0)]);
                ifcApi.WriteLine(modelID, contextRefDirection);
                
                const context = new WebIFC.IFC4.IfcGeometricRepresentationContext(null, new WebIFC.IFC4.IfcLabel("Model"), new WebIFC.IFC4.IfcDimensionCount(3), new WebIFC.IFC4.IfcReal(1.E-05), new WebIFC.IFC4.IfcAxis2Placement3D(contextLocation, contextAxis, contextRefDirection));
                ifcApi.WriteLine(modelID, context);
            
                const subContext = new WebIFC.IFC4.IfcGeometricRepresentationSubContext(new WebIFC.IFC4.IfcLabel("Body"), new WebIFC.IFC4.IfcLabel("Model"), context, null, WebIFC.IFC4.IfcGeometricProjectionEnum.MODEL_VIEW, null);
                ifcApi.WriteLine(modelID, subContext);
                // working
                // const raw = JSON.parse('{"coord":[0.5,0.5,0.5,0.5,0.5,-0.5,0.5,-0.5,0.5,0.5,-0.5,-0.5,-0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,-0.5,-0.5,-0.5,-0.5,0.5,-0.5,0.5,-0.5,0.5,0.5,-0.5,-0.5,0.5,0.5,0.5,0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,0.5,-0.5,-0.5,-0.5,0.5,-0.5,-0.5,-0.5,0.5,0.5,0.5,0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,0.5,0.5,0.5,-0.5,-0.5,0.5,-0.5,0.5,-0.5,-0.5,-0.5,-0.5,-0.5],"coordIndex":[0,2,1,2,3,1,4,6,5,6,7,5,8,10,9,10,11,9,12,14,13,14,15,13,16,18,17,18,19,17,20,22,21,22,23,21]}');
                
                let faceSetList = [];
                const model = gltf.scene;
                // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                model.traverse(function(node) {
                    if (node.isMesh) {
                        const faceSet = CreateFaceSet(node);
                        
                        if (!!node.material.color.isColor) {
                            const color = CreateColor(node.material.color.r, node.material.color.g, node.material.color.b);
                            ColorFaceSet(faceSet, color);
                        }
                        faceSetList.push(faceSet);
                    }
                });

                //const aaaa = gltf.scene.children[0].children.map(v => v.geometry);
    
                //const a = BufferGeometryUtils.mergeGeometries(aaaa);
               
                const shapeRepresentation = new WebIFC.IFC4.IfcShapeRepresentation(subContext, new WebIFC.IFC4.IfcLabel("Body"), new WebIFC.IFC4.IfcLabel("Tessellation"), faceSetList);
                ifcApi.WriteLine(modelID, shapeRepresentation);
        
                const productDefinitionShape = new WebIFC.IFC4.IfcProductDefinitionShape(null, null, [shapeRepresentation]);
                ifcApi.WriteLine(modelID, productDefinitionShape);
            
                const ahuLocation = new WebIFC.IFC4.IfcCartesianPoint([new WebIFC.IFC4.IfcLengthMeasure(0), new WebIFC.IFC4.IfcLengthMeasure(0), new WebIFC.IFC4.IfcLengthMeasure(0)]);
                ifcApi.WriteLine(modelID, ahuLocation);
            
                const ahuAxis = new WebIFC.IFC4.IfcDirection([new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(1)]);
                ifcApi.WriteLine(modelID, ahuAxis);
            
                const ahuRefDirection = new WebIFC.IFC4.IfcDirection([new WebIFC.IFC4.IfcReal(1), new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(0)]);
                ifcApi.WriteLine(modelID, ahuRefDirection);
                
                const equipment = new WebIFC.IFC4.IfcUnitaryEquipment(new WebIFC.IFC4.IfcGloballyUniqueId('1$_tbZa5f5ce0wIPpJZNKH'), null, new WebIFC.IFC4.IfcLabel("AHU"), null, null, 
                        new WebIFC.IFC4.IfcLocalPlacement(null, new WebIFC.IFC4.IfcAxis2Placement3D(ahuLocation, ahuAxis, ahuRefDirection)), 
                        productDefinitionShape, null, WebIFC.IFC4.IfcUnitaryEquipmentTypeEnum.AIRHANDLER);
                ifcApi.WriteLine(modelID, equipment);
                rs();
            },
            // called while loading is progressing
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
                rj(error);
            }
        )
    });
}

function generateColorName(r, g, b) {
    // e.material.color.r
    const normalized = v => String(((v) * 255).toFixed(3)).replace(".", "_")
    return `${normalized(r)}+${normalized(g)}+${normalized(b)}`
    
}
function coloring() {
    // IFCSTYLEDITEM to a  IFCPOLYGONALFACESET
    /*
    #1940=IFCSHAPEREPRESENTATION(#15,'Body','Tessellation',(#1939));

    #999=IFCMATERIAL('Material',$,$);
    #1000=IFCSURFACESTYLE('Material',.BOTH.,(#1001));
    #1001=IFCSURFACESTYLESHADING(#1002,0.);
    #1002=IFCCOLOURRGB($,0.65837424993515,0.610495209693909,0.496932983398438);
    #1003=IFCSTYLEDITEM($,(#1000),'Material');
    #1004=IFCSTYLEDREPRESENTATION(#15,'Body',$,(#1003));
    #1005=IFCMATERIALDEFINITIONREPRESENTATION($,$,(#1004),#999);
    */
}

function downloadString(text, fileType, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(new Blob([text], { type: fileType }));
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
  
    a.addEventListener("click", () => {
        setTimeout(function() { URL.revokeObjectURL(a.href); }, 0);
    })
    a.click();
    document.body.removeChild(a);
}

export default {
    WebIFC,
    CreateAHU:  (ifcApi, modelID, file) => CreateAHU(ifcApi, modelID, file),
    DownloadAsIFCFile: (ifcApi, modelID) => {
        let data= ifcApi.SaveModel(modelID);
        downloadString(new TextDecoder().decode(data), "application/x-step", "model.ifc")
    },
    createScene: htmlElement => new IfcManager(new ThreeScene(htmlElement).scene)
}
