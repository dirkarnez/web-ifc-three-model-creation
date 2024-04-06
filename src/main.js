import { ThreeScene } from './scene';
import { IfcManager } from './ifc-manager';
import * as WebIFC from 'web-ifc';

const {
    IFCLOCALPLACEMENT, IfcLocalPlacement,
    IFCDIRECTION, IfcDirection,
    IFCAXIS2PLACEMENT3D, IfcAxis2Placement3D,
    IFCCIRCLEPROFILEDEF, IfcCircleProfileDef,
    IfcProfileTypeEnum,
    IFCEXTRUDEDAREASOLID, IfcExtrudedAreaSolid,
    IFCCARTESIANPOINT, IfcCartesianPoint,
    IFCCOLUMN, IfcColumn, IfcAPI 
} = WebIFC;

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
    let ID = EID++;
    new WebIFC.IFC4.IfcPolygonalFaceSet(ID, WebIFC.IFCINDEXEDPOLYGONALFACE, numbers.map(num => new WebIFC.IfcPositiveInteger(new WebIFC.IfcInteger(num))))
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