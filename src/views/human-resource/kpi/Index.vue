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
            <span><i class="si si-plus"></i> Add</span>
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
        <slot name="right"></slot>
      </ul>
    </div>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th>Kpi Category</th>
              <th class="text-center">Total Weight</th>
              <th></th>
            </tr>
            <tr
              v-for="template in templates"
              slot="p-body"
              :key="template.id">
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
                  class="btn btn-sm btn-secondary" @click="$refs.edit.show(template)"><i class="si si-note"></i> Edit</a></td>
            </tr>
          </p-table>
          <nav v-show="pagination.last_page > 1">
            <ul class="pagination justify-content-center">
              <li class="page-item" v-show="pagination.current_page > 1">
                <a class="page-link" href="javascript:void(0)" tabindex="-1" aria-label="Previous" @click="paginate(1)">
                  <span aria-hidden="true">
                    <i class="fa fa-angle-double-left"></i>
                  </span>
                  <span class="sr-only">Previous</span>
                </a>
              </li>
              <li
                class="page-item"
                :class="{ 'active': pagination.current_page === n }"
                v-for="n in pagination.last_page"
                :key="n">
                <a class="page-link" href="javascript:void(0)" @click="paginate(n)">{{ n }}</a>
              </li>
              <li class="page-item" v-show="pagination.current_page < pagination.last_page">
                <a class="page-link" href="javascript:void(0)" aria-label="Next" @click="paginate(pagination.last_page)">
                  <span aria-hidden="true">
                    <i class="fa fa-angle-double-right"></i>
                  </span>
                  <span class="sr-only">Next</span>
                </a>
              </li>
            </ul>
          </nav>
        </p-block-inner>
      </p-block>
    </div>

    <result-modal id="result" ref="result" :title="'Kpi Result'"/>
    <create-modal id="create" ref="create" :title="'KPI CATEGORY'"/>
    <edit-modal id="edit" ref="edit" :title="'KPI CATEGORY'"/>
  </div>
</template>

<script>
import CreateModal from './CreateModal'
import EditModal from './EditModal'
import ResultModal from './ResultModal'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    CreateModal,
    EditModal,
    ResultModal,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      title: 'kpi template',
      loading: false
    }
  },
  computed: {
    ...mapGetters('KpiTemplate', ['templates', 'pagination'])
  },
  methods: {
    ...mapActions('KpiTemplate', { getKpiTemplates: 'get' }),
    paginate (page) {
      this.getKpiTemplates({
        limit: 20,
        page: page
      }).then((response) => {
      }, (errors) => {
        console.log(errors.data)
      })
    }
  },
  created () {
    if (this.templates.length === 0) {
      this.loading = true
    }
    this.getKpiTemplates().then((response) => {
      this.loading = false
    })
  }
}
</script>
