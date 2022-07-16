import { store } from '@/store'
import { fabric } from 'fabric';

export const Context = {
    canvas: null
}

const CanvasService = {

  drawSelectedModel(){
    const center = Context.canvas.getCenter();
    Context.canvas.setBackgroundImage(
        store.getters['product/selectedModelColorUrl'], 
        Context.canvas.renderAll.bind(
          Context.canvas
        ), {
        backgroundImageOpacity: 1,
        backgroundImageStretch: false,
        scaleX: 0.35,
        scaleY: 0.35,
        top: center.top,
        left: center.left,
        originX: 'center',
        originY: 'center',
    });
    Context.canvas.renderAll();
  },

  addTextLayer(text = 'RTP Print'){
    let center = Context.canvas.getCenter();
    let textLayer = new fabric.Text(text, { 
        layerId: Date.now(),
        layerType: 'text',
        mode: store.state.canvas.mode,
        fill: '#000000',
        fontSize: 40,
        fontFamily: 'Roboto',
        scaleX:0.60,
        scaleY:0.60,
        top: center.top,
        left: center.left,
        originX: 'center',
        originY: 'center',
        borderColor: '#00d1b2',
        cornerColor: '#3e8ed0',
        strokeWidth: 10,
        globalCompositeOperation: 'source-atop',
        _controlsVisibility:{
          mt: false, mb: false, ml: false, 
          mr: false, bl: false, br: false, 
          tl: false, tr: false,
        }
    });
    Context.canvas.add(textLayer);
    Context.canvas.setActiveObject(textLayer);
    Context.canvas.renderAll();
  },

  addImageLayer(url){
    fabric.Image.fromURL(url, (imageLayer) => {
      imageLayer.set({
        layerId: Date.now(),
        layerType: 'image',
        mode: store.state.canvas.mode,
        originX: 'middle',
        originY: 'middle',
        borderColor: '#00d1b2',
        cornerColor: '#00d1b2',
        strokeWidth: 10,
        _controlsVisibility: {
            mt: false, mb: false, 
            ml: false, mr: false, 
        }
      });
      var imageWidth = Context.canvas.getWidth() * 0.35;
      imageLayer.scaleToWidth(imageWidth);
      Context.canvas.add(imageLayer);
      Context.canvas.centerObject(imageLayer);
      imageLayer.setCoords();
      Context.canvas.setActiveObject(imageLayer);
      Context.canvas.renderAll();
    }, {
        globalCompositeOperation: 'source-atop',
        crossOrigin: 'anonymous'
    });
  },

  changeMode(){
    Context.canvas.getObjects().forEach(object => {
      if(object.mode != store.state.canvas.mode){
        object.visible = false;
      } else{
        object.visible = true;
      }
    });
    Context.canvas.discardActiveObject();
    Context.canvas.renderAll();
  },

  selectLayer(layer, callback = () => {}){
    console.log(layer)
    Context.canvas.getObjects().forEach((object) => {
      if(object.layerId == layer.layerId){
        Context.canvas.setActiveObject(object);
        Context.canvas.renderAll();
        callback(object);
      }
    })
  },

  removeLayer(layer){
    Context.canvas.getObjects().forEach((object) => {
      if(object.layerId == layer.layerId){
        Context.canvas.remove(object);
        Context.canvas.renderAll();
      }
    })
  },

  duplicateLayer(layer){
    Context.canvas.getObjects().forEach((object) => {
      if(object.layerId == layer.layerId){
        object.clone(clone => {
          clone.set({
            layerId: Date.now(),
            layerType: layer.layerType, 
            mode: layer.mode, 
          });
          Context.canvas.add(clone);
          Context.canvas.renderAll();  
        })
      }
    })
  },

  filter(name){
    return {
      get() {
        return !! this.selectedLayer.filters.filter(
          (f) => f.type == name
        ).length
      },
      set(value) {
        if(value){
          this.selectedLayer.filters.push(
            new fabric.Image.filters[name]()
          );
        } else {
          this.selectedLayer.filters = this.selectedLayer.filters.filter(
            (f) => f.type != name
          )
        }
        this.selectedLayer.applyFilters();
      }
    }
  },

  toJSON(){
    return Context.canvas.toJSON(['layerId', 'layerType', 'mode'])
  },

  loadFromJSON(data, callback = () => {}){
    Context.canvas.loadFromJSON(data, callback)
  }

}

export default CanvasService;