<template>
  <div>
    <div id="map" ref="map">
      <!-- <div id="map1"></div>
      <div id="map2"></div>-->
    </div>
    <button id="rotate-left" title="Rotate clockwise">↻</button>
    <button id="rotate-right" title="Rotate counterclockwise">↺</button>
    <button id="pan-to-london">Pan to London</button>
    <button id="elastic-to-moscow">Elastic to Moscow</button>
    <button id="bounce-to-istanbul">Bounce to Istanbul</button>
    <button id="spin-to-rome">Spin to Rome</button>
    <button id="fly-to-bern">Fly to Bern</button>
    <button id="rotate-around-rome">Rotate around Rome</button>
    <button id="tour">Take a tour</button>
  </div>
</template>
<script>
import Map from "ol/Map.js";
import "ol/ol.css";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile";
import { getLayers } from "ol/Map.js";
import View from "ol/View.js";
import { fromLonLat, toLonLat } from "ol/proj.js";
export default {
  name: "index",
  data() {
    return {
      map: null,
      london: fromLonLat([-0.12755, 51.507222]),
      moscow: fromLonLat([37.6178, 55.7517]),
      istanbul: fromLonLat([28.9744, 41.0128]),
      rome: fromLonLat([12.5, 41.9]),
      bern: fromLonLat([7.4458, 46.95])
    };
  },
  mounted() {
    this.mapint();
    // var map1= new Map({
    //     target: "map1",
    //     layers: [
    //       new TileLayer({
    //         source: new OSM()
    //       })
    //     ],
    //     view: new View({
    //       projection: "EPSG:4326",    //使用这个坐标系
    //       center: [104.704968,31.540962],  //西南科技大学
    //       zoom: 15
    //     })
    //   });

    //  var map2=new Map({
    //     target: "map2",
    //     layers: [
    //       new TileLayer({
    //         source: new OSM()
    //       })
    //     ],
    //     view:map1.getView()
    //   });
  },
  methods: {
    mapint() {
      function bounce(t) {
        var s = 7.5625;
        var p = 2.75;
        var l;
        if (t < 1 / p) {
          l = s * t * t;
        } else {
          if (t < 2 / p) {
            t -= 1.5 / p;
            l = s * t * t + 0.75;
          } else {
            if (t < 2.5 / p) {
              t -= 2.25 / p;
              l = s * t * t + 0.9375;
            } else {
              t -= 2.625 / p;
              l = s * t * t + 0.984375;
            }
          }
        }
        return l;
      }
      var map = this.$refs.map;
      var layer = new TileLayer({
        source: new OSM(),
        wrapX: false
      });
      this.map = new Map({
        target: "map",
        layers: [layer],
        view: new View({
          center: fromLonLat([119.24132496, 31.38064496]),
          zoom: 12
        })
      });
      function elastic(t) {
        return (
          Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) +
          1
        );
      }

      function onClick(id, callback) {
        document.getElementById(id).addEventListener("click", callback);
      }

      onClick("rotate-left", function() {
        this.view =new View.animate({
          rotation: new View.getRotation() + Math.PI / 2
        });
      });

      onClick("rotate-right", function() {
        new View.animate({
          rotation: new View.getRotation() - Math.PI / 2
        });
      });

      onClick("rotate-around-rome", function() {
        // Rotation animation takes the shortest arc, so animate in two parts
        var rotation = new View.getRotation();
        new View.animate(
          {
            rotation: rotation + Math.PI,
            anchor: rome,
            easing: easeIn
          },
          {
            rotation: rotation + 2 * Math.PI,
            anchor: rome,
            easing: easeOut
          }
        );
      });

      onClick("pan-to-london", function() {
        view :new View.animate({
          center: this.london,
          duration: 2000
        });
      });

      onClick("elastic-to-moscow", function() {
        new View.animate({
          center: moscow,
          duration: 2000,
          easing: elastic
        });
      });

      onClick("bounce-to-istanbul", function() {
        new View.animate({
          center: istanbul,
          duration: 2000,
          easing: bounce
        });
      });

      onClick("spin-to-rome", function() {
        // Rotation animation takes the shortest arc, so animate in two parts
        var center = new View.getCenter();
        new View.animate(
          {
            center: [
              center[0] + (rome[0] - center[0]) / 2,
              center[1] + (rome[1] - center[1]) / 2
            ],
            rotation: Math.PI,
            easing: easeIn
          },
          {
            center: rome,
            rotation: 2 * Math.PI,
            easing: easeOut
          }
        );
      });

      function flyTo(location, done) {
        var duration = 2000;
        var zoom = view.getZoom();
        var parts = 2;
        var called = false;
        function callback(complete) {
          --parts;
          if (called) {
            return;
          }
          if (parts === 0 || !complete) {
            called = true;
            done(complete);
          }
        }
        view.animate(
          {
            center: location,
            duration: duration
          },
          callback
        );
        view.animate(
          {
            zoom: zoom - 1,
            duration: duration / 2
          },
          {
            zoom: zoom,
            duration: duration / 2
          },
          callback
        );
      }

      onClick("fly-to-bern", function() {
        flyTo(bern, function() {});
      });

      function tour() {
        var locations = [this.london, this.bern, this.rome, moscow, istanbul];
        var index = -1;
        function next(more) {
          if (more) {
            ++index;
            if (index < locations.length) {
              var delay = index === 0 ? 0 : 750;
              setTimeout(function() {
                flyTo(locations[index], next);
              }, delay);
            } else {
              alert("Tour complete");
            }
          } else {
            alert("Tour cancelled");
          }
        }
        next(true);
      }

      onClick("tour", tour);
    }
  }
};
</script>
 <style lang="less" scoped>
#map {
  // position: absolute;
  // top: 0px;
  width: 1200px;
  height: 700px;
}
#map {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  //  border: 1px solid red;
  #map1 {
    border: 1px solid rgb(122, 116, 116);

    display: flex;
    width: 50%;
    background-color: rgb(121, 119, 119);
    margin-right: 10px;
  }
  #map2 {
    border: 1px solid rgb(122, 116, 116);

    display: flex;
    flex: auto;
    background-color: rgb(121, 119, 119);
  }
}
</style>
