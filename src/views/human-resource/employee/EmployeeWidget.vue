<template>
  <div class="row">
    <div
      v-if="$plugin.has('KPI') && ($permission.has('create employee assessment') && isShow(employee.scorers) || $permission.has('read employee assessment'))"
      class="col-sm-6 col-xl-3"
    >
      <div class="block block-themed text-center">
        <div class="block-content block-content-full block-content-sm bg-gray-lighter">
          <div class="font-w600">
            KPI
          </div>
          <div class="font-size-sm">
            {{ $t('key performance indicator') | uppercase }}
          </div>
        </div>
        <div class="block-content">
          <div class="row items-push">
            <div
              v-if="($permission.has('create employee assessment') && isShow(employee.scorers))"
              class="col-6"
            >
              <router-link
                :to="'/human-resource/employee/' + id + '/assessment/create'"
                exact
                active-class="active"
              >
                <div class="mb-5">
                  <i class="si si-note fa-2x" />
                </div>
                <div class="font-size-sm text-muted">
                  Assessment
                </div>
              </router-link>
            </div>
            <div
              v-if="$permission.has('read employee assessment')"
              class="col-6"
            >
              <router-link
                :to="'/human-resource/employee/' + id + '/assessment'"
                exact
                active-class="active"
              >
                <div class="mb-5">
                  <i class="si si-bar-chart fa-2x" />
                </div>
                <div class="font-size-sm text-muted">
                  History
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      v-if="$permission.has('create employee salary') || $permission.has('read employee salary')"
      class="col-sm-6 col-xl-3"
    >
      <div class="block block-themed text-center">
        <div class="block-content block-content-full block-content-sm bg-gray-lighter">
          <div class="font-w600">
            SALARY
          </div>
          <div class="font-size-sm">
            SALARY CALCULATION
          </div>
        </div>
        <div class="block-content">
          <div class="row items-push">
            <div
              v-if="$permission.has('create employee salary')"
              class="col-6"
            >
              <router-link
                :to="'/human-resource/employee/' + id + '/salary/create'"
                exact
                active-class="active"
              >
                <div class="mb-5">
                  <i class="si si-note fa-2x" />
                </div>
                <div class="font-size-sm text-muted">
                  New
                </div>
              </router-link>
            </div>
            <div
              v-if="$permission.has('read employee salary')"
              class="col-6"
            >
              <router-link
                :to="'/human-resource/employee/' + id + '/salary'"
                exact
                active-class="active"
              >
                <div class="mb-5">
                  <i class="si si-bar-chart fa-2x" />
                </div>
                <div class="font-size-sm text-muted">
                  History
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('humanResourceEmployee', ['employee'])
  },
  methods: {
    isShow (scorers) {
      if (!scorers) {
        return false
      }
      return scorers.some(element => {
        return element.id == this.authUser.id
      })
    }
  }
}
</script>
