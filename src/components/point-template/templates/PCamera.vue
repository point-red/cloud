<template>
  <div>
    <web-cam
      v-show="!mutableImage"
      ref="webcam"
      :device-id="deviceId"
      width="100%"
      @started="onStarted"
      @stopped="onStopped"
      @error="onError"
      @cameras="onCameras"
      @camera-change="onCameraChange"
    />
    <img
      v-show="mutableImage"
      :src="mutableImage"
      width="100%"
      class="img-responsive"
    >
    <hr>
    <select v-model="camera">
      <option
        v-for="device in devices"
        :key="device.deviceId"
        :value="device.deviceId"
      >
        {{ device.label }}
      </option>
    </select>
    <hr>
    <button
      v-show="!mutableImage"
      type="button"
      class="btn btn-primary mr-5"
      @click="onCapture"
    >
      Capture
    </button>
    <button
      v-show="mutableImage"
      type="button"
      class="btn btn-primary mr-5"
      @click="onRecapture"
    >
      Recapture
    </button>
    <!-- <button type="button" class="btn btn-danger mr-5" @click="onStop">Stop Camera</button> -->
    <!-- <button type="button" class="btn btn-success" @click="onStart">Start Camera</button> -->
    <hr>
  </div>
</template>

<script>
import { WebCam } from 'vue-web-cam'

export default {
  components: {
    WebCam
  },
  props: {
    image: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      mutableImage: null,
      camera: null,
      deviceId: null,
      devices: []
    }
  },
  watch: {
    camera (id) {
      this.deviceId = id
    },
    image (value) {
      this.mutableImage = value
    },
    devices () {
      // Once we have a list select the first one
      const [first] = this.devices
      if (first) {
        this.camera = first.deviceId
        this.deviceId = first.deviceId
        this.onCameraChange(this.deviceId)
      }
    }
  },
  methods: {
    onCapture () {
      this.mutableImage = this.$refs.webcam.capture()
      this.$emit('onCaptured', this.mutableImage)
    },
    onRecapture () {
      this.mutableImage = null
    },
    onStarted (stream) {
      console.log('On Started Event', stream)
    },
    onStopped (stream) {
      console.log('On Stopped Event', stream)
    },
    onStop () {
      this.$refs.webcam.stop()
    },
    onStart () {
      this.$refs.webcam.start()
    },
    onError (error) {
      console.log('On Error Event', error)
    },
    onCameras (cameras) {
      this.devices = cameras
      console.log('On Cameras Event', cameras)
    },
    onCameraChange (deviceId) {
      this.deviceId = deviceId
      this.camera = deviceId
      console.log('On Camera Change Event', deviceId)
    }
  }
}
</script>
