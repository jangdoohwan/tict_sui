<template>
  <div>
    <div class="map-wrap" style="width:100%; height:100%;min-height:800px;">
      <div class="map-area">
        <div
          id="inaviMap"
          class="map"
          style="z-index:0;min-height:800px;"
        ></div>
        <div id="map" class="map" style="z-index:1;min-height:800px;">
          <div id="popup"></div>
        </div>
        <!--  map-util -->
        <div class="option-wrap">
          <a class="option-open"
            ><span class="glyphicon glyphicon-menu-left"></span
            ><span class="haze">메뉴 열고 닫기</span></a
          >
          <ul class="map-util">
            <li class="reload on form-check">
              <span class="btns"
                ><a
                  href="javascript:void(0)"
                  id="satelite_map"
                  class="satelite_map active"
                  @click="sateliteMap()"
                  ><span>{{ $t('map-normal') }}</span></a
                ></span
              >
              <span class="btns"
                ><a
                  href="javascript:void(0)"
                  id="satelite_sat"
                  class="satelite_sat"
                  @click="sateliteSat()"
                  ><span>{{ $t('satelite') }}</span></a
                ></span
              >
            </li>
          </ul>
        </div>
        <!--  // map-util -->

        <!--  map-control -->
        <div class="map-control">
          <!-- 활성화 class [ on ] -->
          <ul>
            <li class="levelp">
              <button type="button" @click="zoomIn()" title="확대">
                <span></span>
              </button>
            </li>
            <li class="level_18">
              <button type="button" @click="setZoomLevel(18)" title="18레벨">
                <span>18{{ $t('level') }}</span></button
              ><span class="cmdtip lvl1">{{ $t('distance') }}</span>
            </li>
            <li class="level_17">
              <button type="button" @click="setZoomLevel(17)" title="17레벨">
                <span>17{{ $t('level') }}</span>
              </button>
            </li>
            <li class="level_16">
              <button type="button" @click="setZoomLevel(16)" title="16레벨">
                <span>16{{ $t('level') }}</span></button
              ><span class="cmdtip lvl2">{{ $t('address-dong') }}</span>
            </li>
            <li class="level_15">
              <button type="button" @click="setZoomLevel(15)" title="15레벨">
                <span>15{{ $t('level') }}</span>
              </button>
            </li>
            <li class="level_14">
              <button type="button" @click="setZoomLevel(14)" title="14레벨">
                <span>14{{ $t('level') }}</span>
              </button>
            </li>
            <li class="level_13">
              <button type="button" @click="setZoomLevel(13)" title="13레벨">
                <span>13{{ $t('level') }}</span>
              </button>
            </li>
            <li class="level_12">
              <button type="button" @click="setZoomLevel(12)" title="12레벨">
                <span>12{{ $t('level') }}</span></button
              ><span class="cmdtip lvl3">{{ $t('address-sigungu') }}</span>
            </li>
            <li class="level_11">
              <button type="button" @click="setZoomLevel(11)" title="11레벨">
                <span>11{{ $t('level') }}</span>
              </button>
            </li>
            <li class="level_10">
              <button type="button" @click="setZoomLevel(10)" title="10레벨">
                <span>10{{ $t('level') }}</span></button
              ><span class="cmdtip lvl4">{{ $t('address-sido') }}</span>
            </li>
            <li class="level_9">
              <button type="button" @click="setZoomLevel(9)" title="9레벨">
                <span>9{{ $t('level') }}</span>
              </button>
            </li>
            <li class="level_8 on">
              <button type="button" @click="setZoomLevel(8)" title="8레벨">
                <span>8{{ $t('level') }}</span>
              </button>
            </li>
            <!-- <li class="level_7"><button type="button" @click="setZoomLevel(7)" title="7레벨"><span>7{{$t('level')}}</span></button><span class="cmdtip lvl5">{{$t('all-country')}}</span></li> -->
            <li class="levelm">
              <button type="button" @click="zoomOut()" title="축소">
                <span></span>
              </button>
            </li>
          </ul>
        </div>
        <!--  map-control -->

      </div>
    </div>
  </div>
</template>

<script>
import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlOverlay from 'ol/Overlay'
import { Vector as OlLayerVector } from 'ol/layer'
import { Vector as OlSourceVector, Cluster as OlSourceCluster } from 'ol/source'
import {
  Style as OlStyleStyle,
  Icon as OlStyleIcon
} from 'ol/style'
import OlGeomPoint from 'ol/geom/Point'
import OlFeature from 'ol/Feature'
import * as proj from 'ol/proj'
import * as interaction from 'ol/interaction'
import MapInfraMap from 'mapInfraMap'
import MapInfraPoint from 'mapInfraPoint'
import envs from '@/envs'

export default {
  name: 'DetectionMapPopSvc',
  components: {},
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      xMid: 'P13001',
      map: {},
      mapView: {},
      inaviMap: {},
      clusters: {},
      features: [],
      freaturesOri: [],
      source: null,
      WGS84: 'EPSG:4326',
      MERCATOR: 'EPSG:3857',
      popupOverlay: null,
      instLon: null,
      instLat: null,
      instLonIndex: '',
      instLatIndex: ''
    }
  },
  created() {},
  mounted() {
    this.init()

    this.clusters = new OlLayerVector({ id: 'clusters' })

    // 아이나비 지도 생성
    this.inaviMap = new MapInfraMap('inaviMap', {
      center: new MapInfraPoint(this.instLat, this.instLon),
      zoom: envs.gZoomLevel - 5,
      mapTypeId: 0,
      minLevel: 2,
      maxLevel: 13
    })
    this.inaviMap.setMinLevel(2)

    this.mapView = new OlView({
      center: proj.transform([this.instLon, this.instLat], this.WGS84, this.MERCATOR),
      maxZoom: 18,
      minZoom: 8,
      zoom: 18
    })

    this.map = new OlMap({
      target: document.getElementById('map'),
      layers: [],
      view: this.mapView,
      interactions: interaction
        .defaults({
          dragPan: false,
          mouseWheelZoom: false
        })
        .extend([
          new interaction.DragPan({ kinetic: false }),
          new interaction.MouseWheelZoom({ duration: 0 })
        ])
    })

    this.levelChangeHandler()
    // 지도 가운데 변경 이벤트 핸들러
    this.map.getView().on('change:center', this.centerChangeHandler, this)
    // 지도 축척 변경 이벤트 핸들러
    this.map.getView().on('change:resolution', this.levelChangeHandler, this)

    $('.option-open').bind('click', function() {
      $('.option-wrap').toggleClass('satmap')
    })
    this.setDevMap(false)

    this.popupOverlay = new OlOverlay({
      element: document.getElementById('popup'),
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -30]
    })
    this.map.addOverlay(this.popupOverlay)

    // change mouse cursor when over marker
    this.map.on('pointermove', this.pointerMoveEventHandler)
  },
  beforeDestroy() {
    this.inaviMap.detach('zoomend')
  },
  computed: {
    featureCtnDetail(data) {
      return {
        template: '',
        data() {}
      }
    }
  },
  methods: {
    // 위도 경도 설정
    init() {
      let latLon = null
      this.data.colModelData.forEach(row => {
        if (row.type === 'map') {
          latLon = row.index
        }
      })
      let indexOf = latLon.indexOf(',')
      this.instLonIndex = latLon.substring(indexOf + 1)
      this.instLatIndex = latLon.substring(0, indexOf)

      this.instLat = Number(this.data.detList[this.data.id][this.instLatIndex])
      this.instLon = Number(this.data.detList[this.data.id][this.instLonIndex])
    },
    fnCheckOverlay(firstFlag) {
      let element = document.getElementById('popup')
      $(element).popover('destroy')

      this.features = this.featuresOri

      $('input.2depth:not(:checked)').each((index, item) => {
        let id = $(item).attr('id')

        this.features = $.grep(this.features, feature => {
          return feature.get('featureCd') !== id
        })
      })

      this.fnDrawFeatures(true)
    },
    pointerMoveEventHandler(e) {
      if (e.dragging) {
        // let element = document.getElementById('popup')
        // $(element).popover('destroy')
        return
      }
      let pixel = this.map.getEventPixel(e.originalEvent)
      let hit = this.map.hasFeatureAtPixel(pixel)

      let feature = this.map.forEachFeatureAtPixel(e.pixel, function(feature) {
        return feature
      })
      let size = 0
      if (feature) {
        size = feature.get('features').length
      }

      this.map.getTarget().style.cursor =
        hit && (this.getZoomLevel() >= 16 || size === 1) ? 'pointer' : ''
    },
    // 지도 확대
    zoomIn() {
      if (this.getZoomLevel() < 18) {
        this.setZoomLevel(this.getZoomLevel() + 1)
      }
      return this.getZoomLevel()
    },
    // 지도 축소
    zoomOut() {
      if (this.getZoomLevel() > 8) {
        this.setZoomLevel(this.getZoomLevel() - 1)
      }
      return this.getZoomLevel()
    },
    // 현재 지도 레벨 확인
    getZoomLevel() {
      return this.map.getView().getZoom()
    },
    // 지도 레벨 변경
    setZoomLevel(lv) {
      this.map.getView().setZoom(lv)
      this.inaviMap.setZoom(parseInt(lv, 10) - 5)
    },
    isMaxLevel() {
      return (
        this.map.getView().getResolution() ===
        this.map.getView().getMinResolution()
      )
    },
    isMinLevel() {
      return (
        this.map.getView().getResolution() ===
        this.map.getView().getMaxResolution()
      )
    },
    // 일반맵으로 전환
    changeTileSateliteMap() {
      this.inaviMap.setMapTypeId(0)
    },
    // 위성맵으로 전환
    changeTileSateliteSat() {
      this.inaviMap.setMapTypeId(2)
    },
    // 지도 버튼 클릭 이벤트 핸들러
    sateliteMap() {
      if (!$('#satelite_map').hasClass('active')) {
        $('#satelite_map').addClass('active')
        $('#satelite_sat').removeClass('active')

        this.changeTileSateliteMap()
        // 수치지도일시 배경 지우기
        $('#inaviMap').css('background-color', '')
      }
    },
    // 위성 버튼 클릭 이벤트 핸들러
    sateliteSat() {
      if (!$('#satelite_sat').hasClass('active')) {
        $('#satelite_map').removeClass('active')
        $('#satelite_sat').addClass('active')

        // 위성으로만 전환
        this.changeTileSateliteSat()
        // 위성지도일시 배경 바다색
        $('#inaviMap').css('background-color', 'rgba(16,49,97,1)')
      }
    },
    // 지도 축척 바뀌는 것 감지 하는 핸들러
    levelChangeHandler(evt) {
      this.inaviMap.setZoom(this.getZoomLevel() - 5)
      // 오른쪽 슬라이드 바 변경 부분
      $('.map-control ul li[class^=level_]').removeClass('on')
      var currentLevel = this.getZoomLevel()
      currentLevel = Math.floor(currentLevel)
      $('.map-control ul li[class=level_' + currentLevel + ']').addClass('on')
    },
    // 지도 가운데 처리 감지 핸들러
    centerChangeHandler(evt) {
      let center = proj.transform(
        this.mapView.getCenter(),
        this.MERCATOR,
        this.WGS84
      )
      this.inaviMap.setCenter(new MapInfraPoint(center[1], center[0]))
    },
    setDevMap() {
      this.features = []
      this.featuresOri = []

      let coordinates = proj.transform(
        [this.instLon, this.instLat],
        this.WGS84,
        this.MERCATOR
      )
      this.featuresOri.push(
        new OlFeature({
          geometry: new OlGeomPoint(coordinates),
          icon: 'assets/location' + '.png'
        })
      )
      this.fnCheckOverlay()
    },
    // marker 처리
    fnDrawFeatures(flag) {
      // // 기존 layer 는 삭제처리
      this.map.removeLayer(this.clusters)

      let source = new OlSourceVector({
        features: this.features
      })

      let clusterSource = new OlSourceCluster({
        distance: 100,
        source: source
      })

      this.clusters.setSource(clusterSource)
      this.clusters.setStyle(this.clusterLayerStyle)
      this.clusters.setVisible(flag)
      this.map.addLayer(this.clusters)
    },
    clusterLayerStyle(feature) {
      let clusterImg
      let style

      clusterImg = new OlStyleIcon({
        src: feature.get('features')[0].get('icon')
      })
      style = new OlStyleStyle({
        image: clusterImg
      })
      return style
    }
  }
}
</script>

<style lang="less" scoped></style>
