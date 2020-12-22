<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <span class="breadcrumb-item active">{{ $t('kpi') | titlecase }}</span>
    </breadcrumb>

    <div class="mb-20">
      <ul
        class="nav nav-tabs nav-tabs-alt"
        data-toggle="tabs"
        role="tablist"
      >
        <slot />
        <li
          v-if="$permission.has('create employee kpi')"
          class="nav-item ml-auto"
        >
          <router-link
            to=""
            class="nav-link"
            @click.native="$refs.create.show()"
          >
            <span>{{ $t('add') | uppercase }}</span>
          </router-link>
        </li>
        <li
          v-if="$permission.has('create employee kpi')"
          class="nav-item"
        >
          <a
            href="javascript:void(0)"
            class="nav-link"
            @click="addFiles()"
          ><i class="si si-cloud-upload" /> {{ $t('import') | uppercase }}</a>
          <input
            id="file"
            ref="file"
            type="file"
            style="display:none"
            @change="onFileChange"
          >
        </li>
        <slot name="right" />
      </ul>
    </div>

    <div class="row">
      <p-block
        :title="title"
        :header="true"
      >
        <!-- Search -->
        <div class="input-group block mb-5">
          <p-form-input
            id="search-text"
            ref="searchText"
            v-model="searchText"
            name="search-text"
            placeholder="Search"
            class="btn-block"
            @input="filterSearch"
          />
        </div>
        <!-- End Search -->
        <hr>
        <div class="text-center font-size-sm mb-10">
          <a
            href="javascript:void(0)"
            @click="isAdvanceFilter = !isAdvanceFilter"
          >
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
          </a>
        </div>
        <div
          v-show="isAdvanceFilter"
          class="card"
          :class="{ 'fadeIn': isAdvanceFilter }"
        >
          <div class="row">
            <div class="col-sm-3 text-center">
              <p-form-row
                id="status"
                name="status"
                :label="$t('status')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.status.open({ id: statusId, label: statusLabel })"
                  >
                    {{ statusLabel || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
          </div>
        </div>
        <hr>
        <div
          v-show="checkedRow.length > 0"
          class="mr-15 animated fadeIn"
        >
          <button
            type="button"
            class="btn btn-secondary mr-5"
            @click="bulkArchiveKpiTemplate()"
          >
            {{ $t('archive') | uppercase }}
          </button>
          <button
            type="button"
            class="btn btn-secondary mr-5"
            @click="bulkActivateKpiTemplate()"
          >
            {{ $t('activate') | uppercase }}
          </button>
        </div>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>
                <p-form-check-box
                  id="subscibe"
                  name="subscibe"
                  :is-form="false"
                  :checked="isRowsChecked(templates, checkedRow)"
                  class="text-center"
                  @click.native="toggleCheckRows()"
                />
              </th>
              <th>Kpi Category</th>
              <th class="text-center">
                Total Weight
              </th>
              <th class="text-right" />
            </tr>
            <tr
              v-for="(template, index) in templates"
              slot="p-body"
              :key="template.id"
            >
              <th>{{ ( page - 1 ) * limit + index + 1 }}</th>
              <td>
                <p-form-check-box
                  id="subscibe"
                  :is-form="false"
                  :checked="isRowChecked(template.id)"
                  name="subscibe"
                  class="text-center"
                  @click.native="toggleCheckRow(template.id)"
                />
              </td>
              <td>
                <router-link :to="{ name: 'KpiShow', params: { id: template.id }}">
                  {{ template.name }}
                </router-link>
              </td>
              <td class="text-center">
                {{ template.weight | numberFormat }}%
              </td>
              <td>
                <a
                  v-if="$permission.has('update employee kpi')"
                  href="javascript:void(0)"
                  class="btn btn-sm btn-secondary"
                  @click="$refs.edit.show(template)"
                >
                  {{ $t('rename') | uppercase }}
                </a>
                <button
                  :disabled="isExporting.includes(template.id)"
                  type="submit"
                  class="btn btn-sm btn-secondary"
                  style="margin-left:12px"
                  @click="exportData(template.id)"
                >
                  <i
                    v-show="isExporting.includes(template.id)"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('export') | uppercase }}
                </button>
                <button
                  v-if="$permission.has('create employee kpi')"
                  :disabled="isDuplicating"
                  type="submit"
                  class="btn btn-sm btn-secondary"
                  style="margin-left:12px"
                  @click="duplicate(template.id)"
                >
                  <i
                    v-show="isDuplicating"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('duplicate') | uppercase }}
                </button>
                <button
                  v-if="$permission.has('delete employee kpi')"
                  :disabled="isRemoving"
                  type="submit"
                  class="btn btn-sm btn-secondary"
                  style="margin-left:12px"
                  @click="remove(template.id)"
                >
                  <i
                    v-show="isRemoving"
                    class="fa fa-spinner fa-spin"
                  /> {{ $t('remove') | uppercase }}
                </button>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>

    <result-modal
      id="result"
      ref="result"
      :title="'KPI RESULT'"
    />
    <create-modal
      id="create"
      ref="create"
      :title="'KPI CATEGORY'"
    />
    <edit-modal
      id="edit"
      ref="edit"
      :title="'KPI CATEGORY'"
    />
    <m-status
      ref="status"
      @choosen="onChoosenStatus"
    />
  </div>
</template>

<script>
import CreateModal from './CreateModal'
import EditModal from './EditModal'
import ResultModal from './ResultModal'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
import axios from '@/axios'
import debounce from 'lodash/debounce'

export default {
  components: {
    CreateModal,
    EditModal,
    ResultModal,
    Breadcrumb,
    BreadcrumbHumanResource,
    PointTable
  },
  data () {
    return {
      title: 'kpi template',
      isLoading: false,
      isDuplicating: false,
      isRemoving: false,
      isExporting: [],
      checkedRow: [],
      page: this.$route.query.page * 1 || 1,
      limit: 10,
      lastPage: 1,
      isAdvanceFilter: false,
      statusId: this.$route.query.statusId,
      statusLabel: null,
      searchText: ''
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplate', ['templates', 'pagination'])
  },
  created () {
    this.getKpiTemplatesRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('humanResourceKpiTemplate', {
      getKpiTemplates: 'get',
      export: 'export',
      duplicateKpiTemplate: 'duplicate',
      deleteKpiTemplate: 'delete',
      bulkArchive: 'bulkArchive',
      bulkActivate: 'bulkActivate',
      bulkDelete: 'bulkDelete'
    }),
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.templates, this.checkedRow)) {
        this.templates.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            const id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.templates.forEach(element => {
          this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(element.id), 1)
        })
      }
    },
    isRowChecked (id) {
      return this.checkedRow.some(element => {
        return element.id == id
      })
    },
    isRowsChecked (haystack, needles) {
      if (needles.length == 0) {
        return false
      }
      for (let i = 0; i < haystack.length; i++) {
        const found = needles.some(element => {
          return element.id == haystack[i].id
        })
        if (!found) {
          return false
        }
      }
      return true
    },
    duplicate (id) {
      console.log('duplicate kpi template')
      this.isDuplicating = true
      this.duplicateKpiTemplate({
        kpi_template_id: id
      }).then((response) => {
        this.isDuplicating = false
        this.getKpiTemplatesRequest()
      }, (error) => {
        console.log(error)
      })
    },
    remove (id) {
      console.log('removing kpi template')
      if (confirm('do you want remove ?')) {
        this.isRemoving = true
        this.deleteKpiTemplate({
          id: id
        }).then((response) => {
          this.isRemoving = false
          this.getKpiTemplatesRequest()
        })
      }
    },
    exportData (value) {
      this.isExporting.push(value)
      this.export({
        id: value
      }).then((response) => {
        this.isExporting.splice(this.isExporting.indexOf(value), 1)
        this.downloadLink = response.data.url
        window.open(response.data.url, '_blank')
      }, (error) => {
        this.isExporting.splice(this.isExporting.indexOf(value), 1)
        console.log(error)
      })
    },
    addFiles () {
      this.$refs.file.click()
    },
    onFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        console.log('no files')
      }

      const data = new FormData()
      data.append('file', files[0])
      var self = this
      self.isLoading = true
      axios.post('/human-resource/kpi/templates/import/check', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response, data) {
        if (response.data.message == 'exist') {
          if (confirm('Data KPI ' + response.data.name + ' exist, do you want replace ?')) {
            const data = new FormData()
            data.append('file', files[0])
            data.append('replace', response.data.replace)
            axios.post('/human-resource/kpi/templates/import', data, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
              .then(function (response) {
                document.getElementById('file').value = ''
                self.getKpiTemplatesRequest()
                self.isLoading = false
              })
              .catch(function (error) {
                console.log(error)
              })
          } else {
            document.getElementById('file').value = ''
            self.isLoading = false
          }
        } else {
          document.getElementById('file').value = ''
          self.getKpiTemplatesRequest()
          self.isLoading = false
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    paginate (page) {
      this.getKpiTemplatesRequest()
    },
    bulkArchiveKpiTemplate () {
      this.bulkArchive({
        templates: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getKpiTemplatesRequest()
      })
    },
    bulkActivateKpiTemplate () {
      this.bulkActivate({
        templates: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getKpiTemplatesRequest()
      })
    },
    bulkDeleteKpiTemplate () {
      this.bulkDelete({
        templates: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getKpiTemplatesRequest()
      })
    },
    onChoosenStatus (option) {
      this.statusId = option.id
      this.statusLabel = option.label
      this.$router.push({
        query: {
          search: this.searchText,
          statusId: this.statusId
        }
      })
      this.getKpiTemplatesRequest()
    },
    getKpiTemplatesRequest () {
      this.isLoading = true
      console.log('statusId : ' + this.statusId)
      this.getKpiTemplates({
        is_archived: this.statusId,
        limit: this.limit,
        page: this.page
      }).then((response) => {
        this.isLoading = false
      }, (errors) => {
        this.isLoading = false
        console.log(errors.data)
      })
    },
    updatePage (value) {
      this.page = value
      this.getKpiTemplatesRequest()
    },
    filterSearch: debounce(function (value) {
      this.isLoading = true
      this.getKpiTemplates({
        search: this.searchText,
        limit: this.limit,
        page: this.page
      }).then((response) => {
        this.isLoading = false
      }, (errors) => {
        this.isLoading = false
        console.log(errors.data)
      })
    }, 300)
  }
}
</script>
