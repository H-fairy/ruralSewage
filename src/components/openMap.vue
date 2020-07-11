<template>
<div>
  <!-- <div id="map" class="map"></div> -->
  <div id="map" ref="rootmap" style="width:100%;height:500px;"></div>
</div>
  
</template>
<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {easeIn, easeOut} from 'ol/easing';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import mapconfig from '../config/mapconfig'
export default {
  data() {
    return {
      map: null
    };
  },
  mounted() {
    var mapcontainer = this.$refs.rootmap;
    this.map = new Map({
      target: mapcontainer,
      layers: mapconfig.streetmap(),
      view: new View({
        projection: "EPSG:4326",    //使用这个坐标系
        center: [mapconfig.x,mapconfig.y],  //深圳
        zoom: mapconfig.zoom
      })
    });
  }
};
</script>
<style lang="less" scoped>
  
</style>