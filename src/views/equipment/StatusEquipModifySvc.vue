<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <!-- 서비스 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">서비스</span>
          <input
            v-model="entrDevInfo.svcCdNm"
            type="text"
            class="form-control"
            title="서비스"
            required
            disabled
          />
        </div>
      </div>
      <div class="form-row row">
        <!-- 장비 유형 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('dev-cls') }}</span>
          <input
            v-model="entrDevInfo.devClsCdNm"
            type="text"
            id="devClsCdNm"
            class="form-control"
            title="장비유형"
            required
            disabled
          />
        </div>
        <!-- 장비 모델 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('dev-mdl') }}</span>
          <input
            v-model="entrDevInfo.devMdlNm"
            type="text"
            id="devMdlNm"
            class="form-control"
            title="장비모델"
            required
            disabled
          />
        </div>
      </div>
      <div class="form-row row">
        <!-- 식별번호(CTN) -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{
            $t('pin') + '(' + $t('ctn') + ')'
          }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.ctn"
              type="text"
              id="ctn"
              class="form-control"
              title="식별번호(ctn)"
              maxlength="20"
              required
              disabled
            />
          </div>
        </div>
        <!-- Entity Id -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('entityId') }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.devUuid"
              type="text"
              class="form-control"
              title="UUID"
              maxlength="50"
              @change="uuidChkFlag = false"
              style="width:100%;"
              required
            />
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray"
                @click="fnUuidDuplChk()"
              >
                {{ $t('duplication-check') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <!-- 사용자번호 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('using-no') }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.usingNo"
              type="text"
              title="사용자번호"
              class="form-control"
              @change="usingNoChkFlag = false"
              maxlength="20"
            />
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray pull-right"
                @click="fnUsingNoDuplChk()"
              >
                {{ $t('duplication-check') }}
              </button>
            </div>
          </div>
        </div>
        <!-- 식별명 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('pin-nm') }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.devUname"
              type="text"
              id="devUname"
              name="devUname"
              class="form-control"
              title="식별명"
              @change="unameChkFlag = false"
              maxlength="20"
            />
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray pull-right"
                @click="fnUnameDuplChk()"
              >
                {{ $t('duplication-check') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <!-- 설치 주소 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('inst-addr') }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.instAddr"
              type="text"
              title="주소"
              class="form-control"
              style="width:85%;"
              maxlength="85"
            />
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray pull-right"
                @click="fnSearchAddr()"
              >
                {{ $t('chg-addr') }}
              </button>
            </div>
          </div>
        </div>
        <!-- 상세 주소 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{
            $t('inst-addr-detail')
          }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.instAddrDetail"
              type="text"
              class="form-control"
              placeholder
              title="상세주소"
              maxlength="85"
            />
          </div>
        </div>
      </div>
      <div class="form-row row">
        <!-- 위치 좌표 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{
            $t('addr-coordinate')
          }}</span>
          <div class="flex form-inline">
            <!-- 위도 -->
            <div class="input-group">
              <span class="w-10">{{ $t('inst-lat') }}</span>
              <input
                v-model="entrDevInfo.instLat"
                type="text"
                id="instLat"
                name="instLat"
                class="form-control"
                title="위도"
                maxlength="10"
                @input="onlyNumDecimalInput('instLat')"
              />
            </div>
            <!-- 경도 -->
            <div class="input-group pl-2">
              <span class="w-10">{{ $t('inst-lon') }}</span>
              <input
                v-model="entrDevInfo.instLon"
                type="text"
                id="instLon"
                name="instLon"
                class="form-control"
                title="경도"
                maxlength="11"
                @input="onlyNumDecimalInput('instLon')"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="form-row row">
        <!-- 시설 번호 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('inst-no') }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.instNo"
              type="text"
              class="form-control"
              title="시설번호"
              @change="instNoChkFlag = false"
              maxlength="20"
            />
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray pull-right"
                @click="fnInstNoDuplChk()"
              >
                {{ $t('duplication-check') }}
              </button>
            </div>
          </div>
        </div>
        <!-- 시설명 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('inst-nm') }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.devBuildingNm"
              type="text"
              class="form-control"
              title="시설명"
              maxlength="33"
            />
          </div>
        </div>
      </div>

      <div class="form-row row">
        <!-- 시설 구분 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('building-type') }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.devBuildingType"
              type="text"
              class="form-control"
              title="시설구분"
              maxlength="20"
            />
          </div>
        </div>
        <!-- 기물 번호 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('machine-no') }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.machineNo"
              type="text"
              class="form-control"
              title="기물번호"
              maxlength="20"
            />
          </div>
        </div>
      </div>
      <div class="form-row row">
        <!-- 장비 사진 -->
        <div class="form-item">
          <span class="form-label w-36">{{ $t('dev-img') }}</span>
          <div class="input-file">
            <input
              v-model="entrDevInfo.devImgFileNm"
              type="text"
              readonly="readonly"
              class="file-name"
              placeholder="선택 없음"
            />
            <label for="devIcoImgFile" class="file-label pull-right">{{
              $t('file-select')
            }}</label>
            <input
              type="file"
              name="devIcoImg"
              id="devIcoImgFile"
              ref="devIcoImg"
              class="file-upload"
              style="display:none;"
              accept=".jpg, .bmp, .ico, .gif, .png"
              @change="fnFileCheck($event)"
            />
          </div>
          <span class="pl-2">{{ '* ' + $t('imgFiletType') }}</span>
        </div>
      </div>
      <div class="form-row row">
        <!-- 장비등록일자 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('dev-regi-dt') }}</span>
          <datetime-picker
            v-model="entrDevInfo.devRegiDt"
            id="devRegiDt"
            :isPair="false"
            :date.sync="entrDevInfo.devRegiDt"
          ></datetime-picker>
        </div>
        <!-- 장비설치일자 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('dev-inst-dt') }}</span>
          <datetime-picker
            v-model="entrDevInfo.instDttm"
            id="instDttm"
            ref="instDttm"
            :isPair="false"
            :date.sync="entrDevInfo.instDttm"
          ></datetime-picker>
        </div>
      </div>
      <div class="form-row row">
        <!-- 관리조직 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('mng-org') }}</span>
          <div class="input-group">
            <input
              v-model="entrDevInfo.orgNm"
              type="text"
              class="form-control"
              title="관리조직순번"
              disabled
            />
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray pull-right"
                @click="fnSelectOrg()"
              >
                {{ $t('org-select') }}
              </button>
            </div>
          </div>
        </div>
        <!-- 장비상태 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('dev-status') }}</span>
          <div class="input-group">
            <select
              v-model="entrDevInfo.statusCd"
              class="form-control"
              ref="statusCd"
              title="장비상태"
            >
              <option
                v-for="status in statusList"
                v-bind:key="status.cdId"
                :value="status.cdId"
                >{{ status.cdNm }}</option
              >
            </select>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <!-- 고객사 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('customer') }}</span>
          <input
            v-model="entrDevInfo.cust"
            type="text"
            class="form-control"
            title="고객사"
            required
            disabled
          >
        </div>
      </div>
      <div class="form-row row">
        <!-- RTSP -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('rtsp') }}</span>
          <input
            v-model="entrDevInfo.rtspUri"
            type="text"
            id="rtspUri"
            name="rtspUri"
            class="form-control"
            title="RTSP 주소"
            maxlength="256"
          />
        </div>
      </div>
      <div class="form-row row">
        <!-- 제어주소 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('accu-uri') }}</span>
          <input
            v-model="entrDevInfo.accuUri"
            type="text"
            id="accuUri"
            name="accuUri"
            class="form-control"
            title="제어 주소"
            maxlength="256"
          />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('modify') }}
        </button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi, requestMultipartJsonObject } from '@/api/ccp/requestApi'
import getRequestFileArray from '@/utils/inputFile'
import DatetimePicker from '@/components/DatetimePicker'
import moment from 'moment'
import { getCustSeq, getCustId } from '@/utils/cookie'

export default {
  name: 'StatusEquipModifySvc',
  components: {
    DatetimePicker
  },
  props: {
    data: Object,
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      xMid: 'P03005',
      entrDevInfo: {},
      devTypes: [],
      devMdls: [],
      devMdlList: [],
      devMdlCd: null,
      sndHPeriodList: [],
      sndMPeriodList: [],
      sndSPeriodList: [],
      colHPeriodList: [],
      colMPeriodList: [],
      colSPeriodList: [],
      colRadioPicked: 'CH',
      sndRadioPicked: 'SH',
      cDevAttbs: [],
      attbList: [],
      attbLen: 0,
      ctnChkFlag: true,
      usingNoChkFlag: true,
      instNoChkFlag: true,
      uuidChkFlag: true,
      unameChkFlag: true,
      periodUnits: {},
      statusList: [
        { cdId: 'A', cdNm: '사용중' },
        { cdId: 'S', cdNm: '정지' },
        { cdId: 'C', cdNm: '해지' },
        { cdId: 'R', cdNm: '예약' }
      ],
      showAttr: false,
      colHPeriod: '',
      colMPeriod: '',
      colSPeriod: '',
      sndHPeriod: '',
      sndMPeriod: '',
      sndSPeriod: '',
      apiHeaders: {
        'Content-Type': 'application/json;charset=UTF-8',
        apiType: '01',
        apiVersion: '1.0.0',
        carrierType: '01',
        clientIp: '192.168.0.1',
        devInfo: '03',
        nwInfo: '02',
        speed: '25',
        validYn: 'Y',
        osInfo: '',
        devModel: '',
        telNo: '',
        xCoord: '',
        yCoord: '',
        gpsTime: '',
        custNm: ''
      }
    }
  },
  created() {
    this.getEntrDevinfo()
  },
  mounted() {},
  methods: {
    onlyNumDecimalInput(nm) {
      var event = window.event
      if (nm === 'instLat') {
        this.entrDevInfo.instLat = event.target.value = event.target.value.replace(
          /[^.0-9_/]/g,
          ''
        )
      } else if (nm === 'instLon') {
        this.entrDevInfo.instLon = event.target.value = event.target.value.replace(
          /[^.0-9_/]/g,
          ''
        )
      }
    },
    setDevClsList() {
      this.devClsList = this.data.devClsList
      this.devClsCd = this.entrDevInfo.devClsCd
      this.devClsCdNm = this.entrDevInfo.devClsCdNm
      var reqData = {}
      reqData.devClsCd = this.entrDevInfo.devClsCd
      reqData.devClsCdNm = this.entrDevInfo.devClsCdNm

      $('#devClsCd').focus()

      this.getModels(reqData)
    },
    setDevCls(event) {
      this.entrDevInfo.devClsCd = event.target.value
      this.entrDevInfo.devClsCdNm =
        event.target.options[event.target.selectedIndex].label
      this.devMdlList = null
      this.entrDevInfo.entrDevEntrAttbs = null
      var reqData = {}
      reqData.devClsCd = event.target.value

      this.getModels(reqData)
    },
    getModels(reqData) {
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevMdlList',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: result => {
          var devModels = result.data
          if (devModels && devModels.length > 0) {
            this.devMdlList = devModels
            this.entrDevInfo.devMdlCd = devModels[0].devMdlCd
            this.entrDevInfo.devMdlNm = devModels[0].devMdlNm
            // this.getSndColList()
          }
        }
      })
    },
    getSndColList() {
      var sndreqData = {}
      sndreqData.devClsCd = this.entrDevInfo.devClsCd
      sndreqData.devMdlCd = this.entrDevInfo.devMdlCd

      requestApi({
        url: '/online/iotsdev/retrieveSDevSndColPeriodList',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: sndreqData,
        callback: result => {
          this.colHPeriodList = result.data.colHPeriodList
          this.colMPeriodList = result.data.colMPeriodList
          this.colSPeriodList = result.data.colSPeriodList
          this.sndHPeriodList = result.data.sndHPeriodList
          this.sndMPeriodList = result.data.sndMPeriodList
          this.sndSPeriodList = result.data.sndSPeriodList
        }
      })
    },
    // 장비 사진 업로드 유효성 검사
    fnFileCheck(event) {
      // jpg, bmp, ico, gif, png 파일 확장자 체크
      if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.devIcoImg.value)) {
        if (this.$refs.devIcoImg.value !== '') {
          this.alert(this.$t('file-type-check'), 'warning')
          this.$refs.devIcoImg.value = null
          this.entrDevInfo.devImgFileNm = null
          this.entrDevInfo.devImgPath = null

          this.fileTypeFlag = false
        }
        // 1MB 파일 사이즈 체크
      } else if (event.target.files[0].size > 1024 * 1024) {
        this.alert(this.$t('max-size').replace('$0', 1), 'warning')
        this.$refs.devIcoImg.value = null
        this.entrDevInfo.devImgFileNm = null
        this.entrDevInfo.devImgPath = null
        this.fileTypeFlag = false
      } else {
        this.entrDevInfo.devImgFileNm = event.target.files[0].name
        this.fileTypeFlag = true
      }
    },
    getEntrDevinfo() {
      var reqData = {}
      reqData.entrDevSeq = this.data.entrDevSeq
      requestApi({
        url: '/online/iotedevregi/retrieveEntrDevInfo',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: result => {
          if (result.data) {
            this.entrDevInfo = result.data
            this.entrDevInfo.cust = this.entrDevInfo.custLoginId + '/' + this.entrDevInfo.custNm
            // 위도, 경도는 화면에 소수점으로 표시해주시기 위해서 10000000 으로 나눈다
            this.entrDevInfo.instLat = result.data.instLat / 10000000
            this.entrDevInfo.instLon = result.data.instLon / 10000000

            if (result.data.instDttm != null && result.data.instDttm !== '') {
              this.entrDevInfo.instDttm = moment(
                result.data.instDttm,
                'YYYY-MM-DD'
              ).toDate()
            } else {
              this.entrDevInfo.instDttm = null
            }

            if (result.data.devRegiDt != null && result.data.devRegiDt !== '') {
              this.entrDevInfo.devRegiDt = moment(
                result.data.devRegiDt,
                'YYYY-MM-DD'
              ).toDate()
            } else {
              this.entrDevInfo.devRegiDt = null
            }

            if (this.entrDevInfo.ctn) this.ctnChkFlag = true
            if (this.entrDevInfo.devUname) this.unameChkFlag = true

            if (this.entrDevInfo.sndUnit === 'DS00000023') {
              this.sndRadioPicked = 'SH'
              this.sndHPeriod = this.entrDevInfo.sndPeriod
            } else if (this.entrDevInfo.sndUnit === 'DS00000016') {
              this.sndRadioPicked = 'SM'
              this.sndMPeriod = this.entrDevInfo.sndPeriod
            } else {
              this.sndRadioPicked = 'SS'
              this.sndSPeriod = this.entrDevInfo.sndPeriod
            }

            if (this.entrDevInfo.colUnit === 'DS00000023') {
              this.colRadioPicked = 'CH'
              this.colHPeriod = this.entrDevInfo.colPeriod
            } else if (this.entrDevInfo.colUnit === 'DS00000016') {
              this.colRadioPicked = 'CM'
              this.colMPeriod = this.entrDevInfo.colPeriod
            } else {
              this.colRadioPicked = 'CS'
              this.colSPeriod = this.entrDevInfo.colPeriod
            }

            for (var ai = 0; ai < this.attbList.length; ai++) {
              for (
                var ei = 0;
                ei < this.entrDevInfo.entrDevCurValues.length;
                ei++
              ) {
                if (
                  this.attbList[ai].devAttbCdId ===
                  this.entrDevInfo.entrDevCurValues[ei].devAttbCdId
                ) {
                  $('#A_' + this.attbList[ai].devAttbCdId).val(
                    this.entrDevInfo.entrDevCurValues[ei].inputValue
                  )
                  break
                }
              }
            }
            this.setAttbsValue()
          }
        }
      })
    },
    setAttbsValue() {
      if (
        this.attbList &&
        this.attbList !== 'undefined' &&
        this.entrDevInfo.entrDevCurValues
      ) {
        var cVals = this.entrDevInfo.entrDevCurValues
        if (cVals.length === this.attbList.length) {
          cVals
            .filter(attr => {
              return true
            })
            .forEach((attr, index) => {
              if (attr.inputType === 'SELECT') {
                if (attr.inputValue && attr.inputValue !== null) {
                  $('#A_' + attr.devAttbCdId).val(attr.inputValue)
                }
              } else if (attr.inputType === 'INPUT') {
                if (attr.inputValue && attr.inputValue !== null) {
                  $('#A_' + attr.devAttbCdId).val(attr.inputValue)
                }
              }
            })
        }
      } else {
        this.showAttr = false
      }
    },
    setDevMdl(event) {
      this.entrDevInfo.devMdlCd = event.target.value
      this.entrDevInfo.devMdlNm =
        event.target.options[event.target.selectedIndex].label
    },
    fnCtnDuplChk() {
      if (!this.entrDevInfo.ctn) {
        this.alert(this.$t('edev-ctn-chk-msg'))
      } else {
        var reqData = {}
        reqData.entrDevSeq = this.entrDevInfo.entrDevSeq
        reqData.devClsCd = this.entrDevInfo.devClsCd
        reqData.devMdlCd = this.entrDevInfo.devMdlCd
        reqData.ctn = this.entrDevInfo.ctn
        requestApi({
          url: '/online/iotedevregi/retrieveCtnDup',
          headers: {
            // 'X-VNAME': 'IOTEDEV',
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            // 중복체크 결과에 대한 헤더값 확인
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.ctnChkFlag = true
            } else {
              this.ctnChkFlag = false
            }
          }
        })
      }
    },
    fnUsingNoDuplChk() {
      if (
        this.entrDevInfo.usingNo === null ||
        this.entrDevInfo.usingNo.trim() === ''
      ) {
        this.alert(this.$t('edev-usingno-chk-msg'))
      } else {
        var reqData = {}
        reqData.entrDevSeq = this.entrDevInfo.entrDevSeq
        reqData.usingNo = this.entrDevInfo.usingNo
        requestApi({
          url: '/online/iotedevregi/retrieveUsingNoDup',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            // 중복체크 결과에 대한 헤더값 확인
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.usingNoChkFlag = true
            } else {
              this.usingNoChkFlag = false
            }
          }
        })
      }
    },
    fnInstNoDuplChk() {
      if (
        this.entrDevInfo.instNo === null ||
        this.entrDevInfo.instNo.trim() === ''
      ) {
        this.alert(this.$t('edev-instno-chk-msg'))
      } else {
        var reqData = {}
        reqData.entrDevSeq = this.entrDevInfo.entrDevSeq
        reqData.instNo = this.entrDevInfo.instNo
        requestApi({
          url: '/online/iotedevregi/retrieveInstNoDup',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            // 중복체크 결과에 대한 헤더값 확인
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.instNoChkFlag = true
            } else {
              this.instNoChkFlag = false
            }
          }
        })
      }
    },
    fnUuidDuplChk() {
      if (
        this.entrDevInfo.devUuid === null ||
        this.entrDevInfo.devUuid.trim() === ''
      ) {
        this.alert(this.$t('edev-entityId-chk-msg'))
      } else {
        var reqData = {}
        reqData.devUuid = this.entrDevInfo.devUuid
        reqData.entrDevSeq = this.entrDevInfo.entrDevSeq
        requestApi({
          url: '/online/iotedevregi/retrieveUuidDup',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.uuidChkFlag = true
            } else {
              this.uuidChkFlag = false
            }
          }
        })
      }
    },
    fnUnameDuplChk() {
      if (
        this.entrDevInfo.devUname === null ||
        this.entrDevInfo.devUname.trim() === ''
      ) {
        this.alert(this.$t('edev-uname-chk-msg'))
      } else {
        var reqData = {}
        reqData.devUname = this.entrDevInfo.devUname
        reqData.entrDevSeq = this.entrDevInfo.entrDevSeq
        requestApi({
          url: '/online/iotedevregi/retrieveUnameDup',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.unameChkFlag = true
            } else {
              this.unameChkFlag = false
            }
          }
        })
      }
    },
    submit() {
      if (this.checkValid()) {
        this.confirm(this.$t('modifyYn'), this.updateEntrDev)
      }
    },
    updateEntrDev() {
      var reqData = {}
      reqData.entrDevSeq = this.entrDevInfo.entrDevSeq
      reqData.svcCd = this.entrDevInfo.svcCd
      reqData.devClsCd = this.entrDevInfo.devClsCd
      reqData.devClsCdNm = this.entrDevInfo.devClsCdNm
      reqData.devMdlCd = this.entrDevInfo.devMdlCd
      reqData.devMdlNm = this.entrDevInfo.devMdlNm
      reqData.ctn = this.entrDevInfo.ctn
      reqData.devUname = this.entrDevInfo.devUname
      reqData.usingNo = this.entrDevInfo.usingNo
      reqData.devUuid = this.entrDevInfo.devUuid
      reqData.instAddr = this.entrDevInfo.instAddr
      reqData.instAddrDetail = this.entrDevInfo.instAddrDetail
      reqData.devBuildingNm = this.entrDevInfo.devBuildingNm
      reqData.devBuildingType = this.entrDevInfo.devBuildingType
      // 위도, 경도는 10000000을 곱해서 저장한다. 소수점은 버림
      reqData.instLat = Math.floor(this.entrDevInfo.instLat * 10000000)
      reqData.instLon = Math.floor(this.entrDevInfo.instLon * 10000000)
      reqData.instNo = this.entrDevInfo.instNo
      reqData.orgSeq = this.entrDevInfo.orgSeq
      reqData.devImgFileNm = this.entrDevInfo.devImgFileNm
      reqData.machineNo = this.entrDevInfo.machineNo
      reqData.devRegiDt = moment(this.entrDevInfo.devRegiDt)
        .format('YYYYMMDD')
        .toString()
      reqData.instDttm = moment(this.entrDevInfo.instDttm)
        .format('YYYYMMDD')
        .toString()
      reqData.colPeriod = this.entrDevInfo.colPeriod
      reqData.colUnit = this.entrDevInfo.colUnit
      reqData.sndPeriod = this.entrDevInfo.sndPeriod
      reqData.sndUnit = this.entrDevInfo.sndUnit
      reqData.statusCd = this.entrDevInfo.statusCd
      reqData.devImgPath = this.entrDevInfo.devImgPath
      reqData.iagStatusCd = this.entrDevInfo.iagStatusCd
      reqData.rtspUri = this.entrDevInfo.rtspUri
      reqData.accuUri = this.entrDevInfo.accuUri

      var entrDevAttbs = []
      if (this.attbList && this.attbList.length > 0) {
        this.attbList
          .filter(attr => {
            return true
          })
          .forEach((attr, index) => {
            var attbCurVal = {}
            attbCurVal.devClsCd = this.entrDevInfo.devClsCd
            attbCurVal.devClsCdNm = this.entrDevInfo.devClsCdNm
            attbCurVal.devMdlCd = this.entrDevInfo.devMdlCd
            attbCurVal.devMdlNm = this.entrDevInfo.devMdlNm
            attbCurVal.devAttbCdId = attr.devAttbCdId
            attbCurVal.devAttbCdNm = attr.devAttbCdNm
            attbCurVal.inputType = attr.inputType
            if (attr.inputType === 'SELECT') {
              attbCurVal.inputValue = $(
                'select[name=' + attr.devAttbCdId + ']'
              ).val()
            } else {
              attbCurVal.inputValue = $(
                'input[name=' + attr.devAttbCdId + ']'
              ).val()
            }
            entrDevAttbs.push(attbCurVal)
          })
        reqData.entrDevCurValues = entrDevAttbs
      }
      this.callRegistApi(reqData)
    },
    // 장비 수정 시 유효성 검사
    checkValid() {
      // Entity Id 빈 값
      if (
        this.entrDevInfo.devUuid === null ||
        this.entrDevInfo.devUuid.trim() === ''
      ) {
        this.alert(this.$t('edev-entityId-chk-msg'))
        return false
      }
      // Entity Id 중복 확인
      if (!this.uuidChkFlag) {
        this.alert(this.$t('edev-entityId-duplchk-msg'))
        return false
      }

      // 사용자번호 빈 값
      if (
        this.entrDevInfo.usingNo === null ||
        this.entrDevInfo.usingNo.trim() === ''
      ) {
        this.alert(this.$t('edev-usingno-chk-msg'))
        return false
      }
      // 사용자번호 중복 확인
      if (!this.usingNoChkFlag) {
        this.alert(this.$t('edev-usingno-duplchk-msg'))
        return false
      }

      // 식별명 빈 값
      if (
        this.entrDevInfo.devUname === null ||
        this.entrDevInfo.devUname.trim() === ''
      ) {
        this.alert(this.$t('edev-uname-chk-msg'))
        return false
      }
      // 식별명 중복 확인
      if (!this.unameChkFlag) {
        this.alert(this.$t('edev-uname-duplchk-msg'))
        return false
      }

      // 설치주소 빈 값
      if (
        this.entrDevInfo.instAddr === null ||
        this.entrDevInfo.instAddr.trim() === ''
      ) {
        this.alert(this.$t('edev-instAddr-chk-msg'))
        return false
      }
      // 상세주소 빈 값
      if (
        this.entrDevInfo.instAddrDetail === null ||
        this.entrDevInfo.instAddrDetail.trim() === ''
      ) {
        this.alert(this.$t('edev-instaddrdetail-chk-msg'))
        return false
      }

      // 위치 좌표
      if (
        this.entrDevInfo.instLat === null ||
        this.entrDevInfo.instLat === '' ||
        this.entrDevInfo.instLat >= 1000 ||
        this.entrDevInfo.instLon === null ||
        this.entrDevInfo.instLat === '' ||
        this.entrDevInfo.instLon >= 1000
      ) {
        this.alert(this.$t('edev-location-chk-msg'))
        return false
      }
      if (!this.isNumberKey()) {
        this.alert(this.$t('edev-reg-instLat-check'))
        return false
      }

      // 시설번호 빈 값
      if (
        this.entrDevInfo.instNo === null ||
        this.entrDevInfo.instNo.trim() === ''
      ) {
        this.alert(this.$t('edev-instno-chk-msg'))
        return false
      }
      // 시설번호 중복 확인
      if (!this.instNoChkFlag) {
        this.alert(this.$t('edev-instno-duplchk-msg'))
        return false
      }

      // 시설명 공백
      if (
        this.entrDevInfo.devBuildingNm !== null &&
        this.entrDevInfo.devBuildingNm !== '' &&
        this.entrDevInfo.devBuildingNm.trim() === ''
      ) {
        this.alert(this.$t('edev-devBuildingNm-chk-msg'))
        return false
      }

      // 시설구분 공백
      if (
        this.entrDevInfo.devBuildingType !== null &&
        this.entrDevInfo.devBuildingType !== '' &&
        this.entrDevInfo.devBuildingType.trim() === ''
      ) {
        this.alert(this.$t('edev-devBuildingType-chk-msg'))
        return false
      }

      // 기물번호 공백
      if (
        this.entrDevInfo.machineNo !== null &&
        this.entrDevInfo.machineNo !== '' &&
        this.entrDevInfo.machineNo.trim() === ''
      ) {
        this.alert(this.$t('edev-machineNo-chk-msg'))
        return false
      }

      // 관리 조직
      if (
        this.entrDevInfo.orgNm === '' ||
        this.entrDevInfo.orgNm === null ||
        this.entrDevInfo.orgSeq === '' ||
        this.entrDevInfo.orgSeq === null
      ) {
        this.alert(this.$t('request-org-select'))
        return false
      }

      // rtsp 주소
      // if (
      //   (this.entrDevInfo.rtspUri !== '' && this.entrDevInfo.rtspUri !== null) &&
      //   !this.entrDevInfo.rtspUri.startsWith('rtsp://')
      // ) {
      //   this.alert(this.$t('error-rtsp-uri'))
      //   return false
      // }

      // 제어 주소
      if (
        (this.entrDevInfo.accuUri !== '' && this.entrDevInfo.accuUri !== null) &&
        !(this.entrDevInfo.accuUri.startsWith('http://') || this.entrDevInfo.accuUri.startsWith('https://'))
      ) {
        this.alert(this.$t('error-accu-uri'))
        return false
      }
      return true
    },
    callRegistApi(reqData) {
      requestMultipartJsonObject({
        url: '/online/iotedevregi/updateEntrDev',
        headers: {
          'X-MID': this.xMid
        },
        // callback 함수 정의 시 화살표 함수를 사용해야 this 객체 사용가능함.
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        },
        data: reqData,
        files: getRequestFileArray([this.$refs.devIcoImg])
      })
    },
    setdevImgFileNm(event) {
      if (event.target.files[0]) {
        this.entrDevInfo.devImgFileNm = event.target.files[0].name
      }
    },
    fnSelectOrg() {
      requestApi({
        url: '/online/iotcust/retrieveIotCustSelect',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {
          custSeq: getCustSeq()
        },
        callback: res => {
          this.custNm = res.data[0].custNm
          this.selectOrgPopup()
        }
      })
    },
    selectOrgPopup() {
      this.popup({
        component: () => import('@/views/custusr/user/UsersOrganizationSvc'),
        title: this.$t('user-org-custnm').replace('$0', getCustId()).replace('$1', this.custNm),
        width: '500',
        height: '450',
        data: {
          custSeq: this.entrDevInfo.custSeq
        },
        callback: data => {
          if (data && data.orgSeq) {
            this.entrDevInfo.orgSeq = data.orgSeq
            this.entrDevInfo.orgNm = data.orgNm
          }
        }
      })
    },
    // 주소검색
    fnSearchAddr() {
      // 설치주소 빈 값 확인
      if (
        !this.entrDevInfo.instAddr ||
        this.entrDevInfo.instAddr.trim() === ''
      ) {
        this.alert(this.$t('edev-instAddr-chk-msg'))
      } else {
        let reqData = {}
        let headers = this.apiHeaders
        let body = {
          cutflag: '0',
          coordtype: '1',
          startposition: '0',
          reqcount: '1',
          depth: '1',
          mode: '3',
          query: this.entrDevInfo.instAddr,
          spopt: '0',
          radius: '',
          admcode: '',
          x1: '',
          y1: '',
          x2: '',
          y2: '',
          sortopt: '4',
          neighboropt: '1'
        }
        reqData.api = 'searchSQE'
        reqData.headers = headers
        reqData.body = body

        requestApi({
          url: '/online/iotmapinfra/getPoi',
          headers: {
            'X-MID': this.xMid,
            'X-VNAME': 'ONLINE',
            'X-CHANNEL': 'UI'
          },
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              if (res.data.result) {
                let admcount = parseInt(res.data.admcount, 10)
                let poicount = parseInt(res.data.poicount, 10)
                let adm = res.data.adm
                let poi = res.data.poi

                if (admcount > 0) {
                  this.entrDevInfo.instAddr =
                    adm[0].roadname + ' ' + adm[0].roadjibun
                  if (adm[0].roadname === '') {
                    this.entrDevInfo.instAddr =
                      adm[0].address + ' ' + adm[0].jibun
                  }
                  // 경도
                  this.entrDevInfo.instLat = adm[0].posy
                  // 위도
                  this.entrDevInfo.instLon = adm[0].posx
                } else if (poicount > 0) {
                  this.entrDevInfo.instAddr =
                    poi[0].roadname + ' ' + poi[0].roadjibun
                  if (poi[0].roadname === '') {
                    this.entrDevInfo.instAddr =
                      poi[0].address + ' ' + poi[0].jibun
                  }
                  // 경도
                  this.entrDevInfo.instLat = poi[0].dpy
                  // 위도
                  this.entrDevInfo.instLon = poi[0].dpx
                } else {
                  this.alert(this.$t('no-address-found'))
                }
              } else {
                this.alert(this.$t('no-address-found'))
              }
            }
          },
          method: 'post',
          data: reqData
        })
      }
    },
    isNumberKey() {
      var _pattern2 = /^-?(\d{1,2}([.]\d{0,7})?)?$/
      if (
        _pattern2.test(this.entrDevInfo.instLat) &&
        this.entrDevInfo.instLat <= 90
      ) {
        // 정수 2자리, 소수점 뒤 일곱자리
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
border-bottom1 {
  border-bottom: 1px solid #d4dce4;
}
</style>
