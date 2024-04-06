import { ThreeScene } from './scene';
import { IfcManager } from './ifc-manager';
import  * as  WebIFC from 'web-ifc';

const { IfcAPI } = WebIFC;

let EID = 1;

function real(v/*: number*/)
{
    return { type: 4, value: v}
}

function ref(v/*: number*/)
{
    return { type: 5, value: v}
}

function empty()
{
    return { type: 6}
}

function str(v/*: string*/)
{
    return { type: 1, value: v}
}

function enm(v/*: string*/)
{
    return { type: 3, value: v}
}

function makePt(x, y, z) {
    return {
        x: x/*: number*/, 
        y: y/*number*/,
        z: z/*number*/
    }
}

function makePt2D(x, y) {
    return {
        x: x/*: number*/, 
        y: y/*number*/
    }
}

function CreateLocation(model/*: number*/, api/*: IfcAPI*/, o/*: pt*/)
{
    let ID = EID++;
    api.WriteLine(model, new IfcCartesianPoint(ID, IFCCARTESIANPOINT, [real(o.x), real(o.y), real(o.z)]));
    return ref(ID);
}

function CreatePlacement(model/*: number*/, api/*: IfcAPI*/, location)
{
    let ID = EID++;
    api.WriteLine(model, new IfcAxis2Placement3D(ID, IFCAXIS2PLACEMENT3D, location/*Location(model, api, o)*/, empty(), empty()));
    return ref(ID);
}


function CreateIndexedPolygonalFace(numbers) {

    const contextLocation = new WebIFC.IFC4.IfcCartesianPoint([new WebIFC.IFC4.IfcLengthMeasure(0), new WebIFC.IFC4.IfcLengthMeasure(0), new WebIFC.IFC4.IfcLengthMeasure(0)]);
    const contextAxis = new WebIFC.IFC4.IfcDirection([new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(1)]);
    const contextRefDirection = new WebIFC.IFC4.IfcDirection([new WebIFC.IFC4.IfcReal(1), new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(0)]);
    
    const context = new WebIFC.IFC4.IfcGeometricRepresentationContext(null, new WebIFC.IFC4.IfcLabel("Model"), new WebIFC.IFC4.IfcDimensionCount(3), new WebIFC.IFC4.IfcReal(1.E-05), new WebIFC.IFC4.IfcAxis2Placement3D(contextLocation, contextAxis, contextRefDirection));
    const subContext = new WebIFC.IFC4.IfcGeometricRepresentationSubContext(new WebIFC.IFC4.IfcLabel("Body"), new WebIFC.IFC4.IfcLabel("Model"), context, null, WebIFC.IFC4.IfcGeometricProjectionEnum.MODEL_VIEW, null);
    
    const faceSet = new WebIFC.IFC4.IfcPolygonalFaceSet(new WebIFC.IFC4.IfcCartesianPointList3D(), null, [new WebIFC.IFC4.IfcIndexedPolygonalFace(numbers.map(num => new WebIFC.IfcPositiveInteger(new WebIFC.IfcInteger(num))))])
    const shapeRepresentation = new WebIFC.IFC4.IfcShapeRepresentation(subContext, new WebIFC.IFC4.IfcLabel("Body"), new WebIFC.IFC4.IfcLabel("Tessellation"), [faceSet]);
    
    
    #81=IFCPRODUCTDEFINITIONSHAPE($,$,(#80));

}

function CreateIndexedPolygonalFaceSet() {
}


export default {
    WebIFC,
    getModel: async () => {

        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        let modelID = ifcApi.CreateModel();

        new IfcAxis2Placement3D();
        
    },
    createScene: htmlElement => new IfcManager(new ThreeScene(htmlElement).scene)
}