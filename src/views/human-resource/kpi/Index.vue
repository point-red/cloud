<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <span class="breadcrumb-item active">{{ $t('kpi') | titlecase }}</span>
    </breadcrumb>

    <div class="mb-20">
      <ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" role="tablist">
        <slot></slot>
        <li class="nav-item ml-auto" v-if="$permission.has('create employee kpi')">
          <router-link
            to=""
            @click.native="$refs.create.show()"
            class="nav-link">
            <span><i class="si si-plus"></i> {{ $t('add') | uppercase }}</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="$permission.has('create employee kpi') || $permission.has('update employee kpi')">
          <router-link
            to=""
            @click.native="$refs.result.show()"
            class="nav-link">
            <span><i class="si si-magic-wand"></i> KPI Result</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="$permission.has('create employee kpi')">
          <a href="javascript:void(0)" class="nav-link" @click="addFiles()"><i class="si si-cloud-upload"></i> Import</a>
          <input type="file" id="file" ref="file" v-on:change="onFileChange" style="display:none" />
        </li>
        <slot name="right"></slot>
      </ul>
    </div>

    <div class="row">
      <p-block :title="title" :header="true">
        <hr>
        <div class="text-center font-size-sm mb-10">
          <a href="javascript:void(0)" @click="isAdvanceFilter = !isAdvanceFilter">
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down"></i>
          </a>
        </div>
        <div class="card" :class="{ 'fadeIn': isAdvanceFilter }" v-show="isAdvanceFilter">
          <div class="row">
            <div class="col-sm-3 text-center">
              <p-form-row id="status" name="status" :label="$t('status')" :is-horizontal="false">
                <div slot="body">
                  <span @click="$refs.status.open({ id: statusId, label: statusLabel })" class="select-link">
                    {{ statusLabel || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
          </div>
        </div>
        <hr>
        <div class="mr-15 animated fadeIn" v-show="checkedRow.length > 0">
          <button type="button" class="btn btn-secondary mr-5" @click="bulkArchiveKpiTemplate()">
            {{ $t('archive') | uppercase }}
          </button>
          <button type="button" class="btn btn-secondary mr-5" @click="bulkActivateKpiTemplate()">
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
                  @click.native="toggleCheckRows()"
                  :checked="isRowsChecked(templates, checkedRow)"
                  class="text-center"/>
              </th>
              <th>Kpi Category</th>
              <th class="text-center">Total Weight</th>
              <th class="text-right"></th>
            </tr>
            <tr
              v-for="(template, index) in templates"
              slot="p-body"
              :key="template.id">
              <th>{{ ++index }}</th>
              <td>
                <p-form-check-box
                  :is-form="false"
                  id="subscibe"
                   @click.native="toggleCheckRow(template.id)"
                  :checked="isRowChecked(template.id)"
                  name="subscibe"
                  class="text-center"/></td>
              <td>
                <router-link :to="{ name: 'KpiShow', params: { id: template.id }}">
                  {{ template.name }}
                </router-link>
              </td>
              <td class="text-center">{{ template.weight | numberFormat }}%</td>
              <td>
                  <a
                    href="javascript:void(0)"
                    v-if="$permission.has('update employee kpi')"
                    class="btn btn-sm btn-secondary" @click="$refs.edit.show(template)">
                    {{ $t('rename') | uppercase }}
                  </a>
                  <button :disabled="isExporting.includes(template.id)" type="submit" class="btn btn-sm btn-secondary" @click="exportData(template.id)" style="margin-left:12px">
                    <i v-show="isExporting.includes(template.id)" class="fa fa-asterisk fa-spin" /> {{ $t('export') | uppercase }}
                  </button>
                  <button :disabled="isDuplicating" type="submit" class="btn btn-sm btn-secondary" @click="duplicate(template.id)" style="margin-left:12px" v-if="$permission.has('create employee kpi')">
                    <i v-show="isDuplicating" class="fa fa-asterisk fa-spin" /> {{ $t('duplicate') | uppercase }}
                  </button>
                  <button :disabled="isRemoving" type="submit" class="btn btn-sm btn-secondary" @click="remove(template.id)" style="margin-left:12px" v-if="$permission.has('delete employee kpi')">
                    <i v-show="isRemoving" class="fa fa-spinner fa-spin" /> {{ $t('remove') | uppercase }}
                  </button>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage">
        </p-pagination>
      </p-block>
    </div>

    <result-modal id="result" ref="result" :title="'KPI RESULT'"/>
    <create-modal id="create" ref="create" :title="'KPI CATEGORY'"/>
    <edit-modal id="edit" ref="edit" :title="'KPI CATEGORY'"/>
    <m-status ref="status" @choosen="onChoosenStatus"></m-status>
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
      statusLabel: null
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplate', ['templates', 'pagination'])
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
            let id = element.id
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
        let found = needles.some(element => {
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
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        console.log('no files')
      }

      let data = new FormData()
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
            let data = new FormData()
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
    }
  },
  created () {
    this.getKpiTemplatesRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
