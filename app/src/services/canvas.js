import { store } from "@/store";
import { fabric } from "fabric";

import MediaService from "@/services/media";

export const Context = {
  canvas: null,
};

const CanvasService = {
  drawSelectedModel() {
    const center = Context.canvas.getCenter();
    Context.canvas.setBackgroundImage(
      store.getters["product/selectedModelColorUrl"],
      (data) => {
        Context.canvas.backgroundImage.scaleX =
          (Context.canvas.getWidth() / data.width) * 0.9;
        Context.canvas.backgroundImage.scaleY =
          (Context.canvas.getHeight() / data.height) * 0.9;
        return Context.canvas.renderAll();
      },
      {
        backgroundImageOpacity: 1,
        backgroundImageStretch: false,
        top: center.top,
        left: center.left,
        originX: "center",
        originY: "center",
        crossOrigin: "anonymous",
      }
    );
    Context.canvas.renderAll();
  },

  addTextLayer(text = "RTP Print") {
    let center = Context.canvas.getCenter();
    let textLayer = new fabric.Text(text, {
      layerId: Date.now(),
      layerType: "text",
      mode: store.state.canvas.mode,
      fill: "#000000",
      fontSize: 40,
      fontFamily: "Roboto",
      scaleX: 0.6,
      scaleY: 0.6,
      top: center.top,
      left: center.left,
      originX: "center",
      originY: "center",
      borderColor: "#00d1b2",
      cornerColor: "#3e8ed0",
      strokeWidth: 10,
      globalCompositeOperation: "source-atop",
      _controlsVisibility: {
        mt: false,
        mb: false,
        ml: false,
        mr: false,
        bl: false,
        br: false,
        tl: false,
        tr: false,
      },
    });
    Context.canvas.add(textLayer);
    Context.canvas.setActiveObject(textLayer);
    Context.canvas.renderAll();
  },

  addImageLayer(url) {
    fabric.Image.fromURL(
      url,
      (imageLayer) => {
        imageLayer.set({
          layerId: Date.now(),
          layerType: "image",
          mode: store.state.canvas.mode,
          originX: "middle",
          originY: "middle",
          borderColor: "#00d1b2",
          cornerColor: "#00d1b2",
          strokeWidth: 10,
          _controlsVisibility: {
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          },
        });
        var imageWidth = Context.canvas.getWidth() * 0.35;
        imageLayer.scaleToWidth(imageWidth);
        Context.canvas.add(imageLayer);
        Context.canvas.centerObject(imageLayer);
        imageLayer.setCoords();
        Context.canvas.setActiveObject(imageLayer);
        Context.canvas.renderAll();
      },
      {
        globalCompositeOperation: "source-atop",
        crossOrigin: "anonymous",
      }
    );
  },

  changeMode() {
    Context.canvas.getObjects().forEach((object) => {
      object.visible = object.mode != store.state.canvas.mode ? false : true;
    });
    Context.canvas.discardActiveObject();
    Context.canvas.renderAll();
  },

  selectLayer(layer, callback = () => {}) {
    console.log(layer);
    Context.canvas.getObjects().forEach((object) => {
      if (object.layerId == layer.layerId) {
        Context.canvas.setActiveObject(object);
        Context.canvas.renderAll();
        callback(object);
      }
    });
  },

  removeLayer(layer) {
    Context.canvas.getObjects().forEach((object) => {
      if (object.layerId == layer.layerId) {
        Context.canvas.remove(object);
        Context.canvas.renderAll();
      }
    });
  },

  duplicateLayer(layer) {
    Context.canvas.getObjects().forEach((object) => {
      if (object.layerId == layer.layerId) {
        object.clone((clone) => {
          clone.set({
            layerId: Date.now(),
            layerType: layer.layerType,
            mode: layer.mode,
          });
          Context.canvas.add(clone);
          Context.canvas.renderAll();
        });
      }
    });
  },

  filter(name) {
    return {
      get() {
        return !!this.selectedLayer.filters.filter((f) => f.type == name)
          .length;
      },
      set(value) {
        if (value) {
          this.selectedLayer.filters.push(new fabric.Image.filters[name]());
        } else {
          this.selectedLayer.filters = this.selectedLayer.filters.filter(
            (f) => f.type != name
          );
        }
        this.selectedLayer.applyFilters();
      },
    };
  },

  toJSON() {
    return Context.canvas.toJSON([
      "layerId",
      "layerType",
      "mode",
      "_controlsVisibility",
    ]);
  },

  loadFromJSON(data, callback = () => {}) {
    Context.canvas.loadFromJSON(data, callback);
  },

  deleteAllLayers() {
    Context.canvas.getObjects().forEach((object) => {
      Context.canvas.remove(object);
    });
  },

  async takeVirtualCapture(mode) {
    let canvas = new fabric.Canvas(null, {
      width: Context.canvas.width,
      height: Context.canvas.height,
    });

    return new Promise((resolve) => {
      canvas.loadFromJSON(this.toJSON(), () => {
        canvas.getObjects().forEach((object) => {
          object.visible = object.mode != mode ? false : true;
        });

        const center = canvas.getCenter();

        canvas.setBackgroundImage(
          store.state.product.selectedModelColor[mode].url,
          (data) => {
            canvas.backgroundImage.scaleX =
              (canvas.getWidth() / data.width) * 0.9;
            canvas.backgroundImage.scaleY =
              (canvas.getHeight() / data.height) * 0.9;

            canvas
              .renderAll()
              .getElement()
              .toBlob(
                (blob) => {
                  resolve(blob);
                },
                "image/png",
                1
              );
          },
          {
            backgroundImageOpacity: 1,
            backgroundImageStretch: false,
            scaleX: 0.35,
            scaleY: 0.35,
            top: center.top,
            left: center.left,
            originX: "center",
            originY: "center",
            crossOrigin: "anonymous",
          }
        );
      });
    });
  },

  async capture() {
    let front, back;

    let frontBlob = await this.takeVirtualCapture("front");
    front = await MediaService.uploadBlob(frontBlob);

    if (typeof store.state.product.selectedModelColor.back !== "undefined") {
      let backBlob = await this.takeVirtualCapture("back");
      back = await MediaService.uploadBlob(backBlob);
    }

    return {
      front,
      back,
    };
  },
};

export default CanvasService;
