<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/job-value/master"
        class="breadcrumb-item"
      >
        {{ $t("master job value") | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ criteria.criteria_factor | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create employee master job value')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addJobValueCriteria.open()"
          >
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            v-if="$permission.has('update employee master job value')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editJobValueCriteria.open(criteria)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete employee master job value')"
            type="button"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary"
            @click="onDelete()"
          >
            <i
              v-show="isDeleting"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="category"
            v-model="criteria.category.category"
            label="Category"
            name="category"
            readonly
          />
          <p-form-row
            id="criteria_factor"
            v-model="criteria.criteria_factor"
            label="Criteria Factor"
            name="criteria_factor"
            readonly
          />
          <p-form-row
            id="total_score"
            v-model="criteria.total_score"
            label="Total Score"
            name="total_score"
            readonly
          />
          <div class="form-group row">
            <label
              for="area-value"
              class="col-form-label col-lg-3"
            >
              {{ $t("Skala") | uppercase }}
            </label>
            <div class="col-lg-9">
              <point-table
                class="w-full"
              >
                <tr slot="p-head">
                  <th>Skala</th>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
                <tr
                  v-for="(row, index) in criteria.scales"
                  slot="p-body"
                  :key="index"
                >
                  <td>
                    {{ index + 1 }}
                  </td>
                  <td>
                    <p-form-input
                      :id="'description-' + index"
                      v-model="row.description"
                      :name="'description-' + index"
                      readonly
                    />
                  </td>
                  <td>
                    <p-form-number
                      :id="'value-' + index"
                      v-model="row.value"
                      :name="'value-' + index"
                      readonly
                    />
                  </td>
                </tr>
              </point-table>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <m-add-job-value-criteria
      ref="addJobValueCriteria"
      @added="onAdded($event)"
    />
    <m-edit-job-value-criteria
      ref="editJobValueCriteria"
      @updated="onUpdated($event)"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/job-value/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import PointTable from 'point-table-vue'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueCriteria', ['criteria'])
  },
  created () {
    if (this.$permission.has('read employee master job value')) {
      this.findCriteria()
    } else {
      this.$router.push('/403')
    }
  },
  methods: {
    ...mapActions('humanResourceJobValueCriteria', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAdded (criteria) {
      this.$router.push('/human-resource/job-value/master/' + criteria.id)
      this.id = criteria.id
      this.findCriteria()
    },
    onUpdated (criteria) {
      this.findCriteria()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/human-resource/job-value/master')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('job location already used')
        })
      })
    },
    findCriteria () {
      this.isLoading = true
      this.find({
        id: this.id
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
