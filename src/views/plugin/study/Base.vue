<template>
  <div class="block p-4">
    <div class="row">
      <div class="col-12 col-md-5">
        <img
          id="logo"
          src="https://i.imgur.com/QlENKNg.png"
        >
      </div>
      <div class="col-12 col-sm">
        <div id="content">
          <h1>
            {{ $t('hi') | capitalize }} {{ userName | capitalize }} !
          </h1>
          <div class="d-flex align-items-center font-size-h4">
            <i class="fa fa-lightbulb-o text-danger fa-lg mr-3" />
            <a
              target="_blank"
              href="https://www.youtube.com/c/MerlionSchool"
            >
              {{ $t('click here for the guidance') | capitalize }}
            </a>
          </div>

          <div class="menu-button">
            <div class="menu-button-1">
              <router-link
                :to="{name: 'PluginStudySheetIndex'}"
                class="btn btn-danger w-100 btn-lg text-white"
              >
                {{ $t('subject monitoring sheets') | titlecase }}
              </router-link>
            </div>
            <div class="menu-button-1">
              <button class="btn btn-secondary w-100 btn-lg">
                {{ $t('strength mapping') | titlecase }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PluginStudyHome',
  data () {
    return {
      userName: localStorage.getItem('userName')
    }
  }
}
</script>

<style scoped>
#logo {
  display: block;
  width: auto;
  max-width: 360px;
  height: 240px;
  margin-left: auto;
  margin-right: auto;
  object-fit: contain;
  padding: 1rem 2rem;
}
#content {
  width: 100%;
  max-width: 360px;
  margin-top: 2rem;
  margin-left: auto;
  margin-right: auto;
}
.menu-button {
  margin-top: 4rem;
}
.menu-button-1 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
@media only screen and (min-width: 640px)  {
  #logo {
    height: 280px;
  }
}
@media only screen and (min-width: 768px)  {
  #content {
    margin-left: 0;
  }
}
@media only screen and (min-width: 1024px)  {
  #logo {
    height: 320px;
  }
}
</style>
