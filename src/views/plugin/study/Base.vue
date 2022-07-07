<template>
  <div class="block p-4">
    <!-- <div class="row gutters-tiny">
          <p-box
            v-if="$permission.has('read study sheets')"
            :name="$t('study sheet') | titlecase"
            :link="$router.resolve({name: 'PluginStudySheetIndex'}).href"
            icon="fa fa-file-text"
          />
          <p-box
            v-if="$permission.has('read study subjects')"
            :name="$t('study subject') | titlecase"
            :link="$router.resolve({name: 'PluginStudySubject'}).href"
            icon="fa fa-book"
          />
        </div> -->
    <div class="row">
      <div class="col-12 col-md-5">
        <img
          class="logo"
          src="https://i.imgur.com/QlENKNg.png"
        >
      </div>
      <div class="col-12 col-sm">
        <div class="content">
          <h1>
            {{ $t('hi') | capitalize }} {{ userName }} !
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
              <a class="btn btn-danger w-100 btn-lg text-light">
                {{ $t('subject monitoring sheets') | titlecase }}
              </a>
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

/*
Permissions
- menu study
- read study sheets
- create study sheets
- edit study sheets
- delete study sheets
- read study subjects
- create study subjects
- edit study subjects
- delete study subjects
*/
</script>

<style scoped>
.logo {
  display: block;
  width: auto;
  max-width: 360px;
  height: 240px;
  margin-left: auto;
  margin-right: auto;
  object-fit: contain;
  padding: 1rem 2rem;
}
@media only screen and (min-width: 640px)  {
  .logo {
    height: 280px;
  }
}
@media only screen and (min-width: 1024px)  {
  .logo {
    height: 320px;
  }
}
</style>
