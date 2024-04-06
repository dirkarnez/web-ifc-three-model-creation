import { ThreeScene } from './scene';
import { IfcManager } from './ifc-manager';
import  * as  WebIFC from 'web-ifc';

function CreateFace(numbers) {
    const positiveIntegers = numbers.map(num => new WebIFC.IFC4.IfcPositiveInteger(num));
    return new WebIFC.IFC4.IfcIndexedPolygonalFace(positiveIntegers)
}

// new WebIFC.IfcAPI().CreateModel();
function CreateAHU(ifcApi, modelID) {
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
    
    const coordinates = new WebIFC.IFC4.IfcCartesianPointList3D([[-1.,-1.,-1.],[-1.,-1.,1.],[-1.,1.,-1.],[-1.,1.,1.],[1.,-1.,-1.],[1.,-1.,1.],[1.,1.,-1.],[1.,1.,1.]].map(a => a.map(b => new WebIFC.IFC4.IfcLengthMeasure(b))));
    const faceSet = new WebIFC.IFC4.IfcPolygonalFaceSet(coordinates, null, [
        CreateFace([1,2,4,3]),
        CreateFace([3,4,8,7]),
        CreateFace([7,8,6,5]),
        CreateFace([5,6,2,1]),
        CreateFace([3,7,5,1]),
        CreateFace([8,4,2,6])
    ], null);

    ifcApi.WriteLine(modelID, faceSet);

    const shapeRepresentation = new WebIFC.IFC4.IfcShapeRepresentation(subContext, new WebIFC.IFC4.IfcLabel("Body"), new WebIFC.IFC4.IfcLabel("Tessellation"), [faceSet]);
    ifcApi.WriteLine(modelID, shapeRepresentation);

    const productDefinitionShape = new WebIFC.IFC4.IfcProductDefinitionShape(null, null, [shapeRepresentation]);
    ifcApi.WriteLine(modelID, productDefinitionShape);

    const ahuLocation = new WebIFC.IFC4.IfcCartesianPoint([new WebIFC.IFC4.IfcLengthMeasure(0), new WebIFC.IFC4.IfcLengthMeasure(0), new WebIFC.IFC4.IfcLengthMeasure(0)]);
    ifcApi.WriteLine(modelID, ahuLocation);

    const ahuAxis = new WebIFC.IFC4.IfcDirection([new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(1)]);
    ifcApi.WriteLine(modelID, ahuAxis);

    const ahuRefDirection = new WebIFC.IFC4.IfcDirection([new WebIFC.IFC4.IfcReal(1), new WebIFC.IFC4.IfcReal(0), new WebIFC.IFC4.IfcReal(0)]);
    ifcApi.WriteLine(modelID, ahuRefDirection);
    
    const equipment = new WebIFC.IFC4.IfcUnitaryEquipment(new WebIFC.IFC4.IfcGloballyUniqueId('1$_tbZa5f5ce0wIPpJZNKH'), null, new WebIFC.IFC4.IfcLabel("AHU"), null, null, new WebIFC.IFC4.IfcLocalPlacement(null, new WebIFC.IFC4.IfcAxis2Placement3D(ahuLocation, ahuAxis, ahuRefDirection)), productDefinitionShape, null, WebIFC.IFC4.IfcUnitaryEquipmentTypeEnum.AIRHANDLER);
    ifcApi.WriteLine(modelID, equipment);
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
    CreateAHU:  (ifcApi, modelID) => CreateAHU(ifcApi, modelID),
    DownloadAsIFCFile: (ifcApi, modelID) => {
        let data= ifcApi.SaveModel(modelID);
        downloadString(new TextDecoder().decode(data), "application/x-step", "model.ifc")
    },
    createScene: htmlElement => new IfcManager(new ThreeScene(htmlElement).scene)
}