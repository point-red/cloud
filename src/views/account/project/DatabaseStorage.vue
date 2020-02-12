<template>
  <div>
    <h5>{{ tableName }}</h5>
      <p-block-inner>
        <template :is-loading="isLoading" v-if="rows && rows.length > 0">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th v-for="(row, index) in Object.keys(rows[0])" :key="index">
                {{ row }}
              </th>
            </tr>
            <tr
              v-for="(row, index) in rows"
              :key="index"
              slot="p-body">
              <th>{{ index + 1 }}</th>
              <td v-for="(col, index2) in row" :key="index + '-' + index2">{{ col }}</td>
            </tr>
          </point-table>
        </template>
        <template v-else-if="!isLoading">
          There is no data for table "{{ name }}"
        </template>
      </p-block-inner>
  </div>
</template>

<script>
import PointTable from 'point-table-vue'

export default {
  components: {
    PointTable
  },
  data () {
    return {
      rows: this.data,
      name: this.tableName
    }
  },
  props: {
    data: {
      type: Array
    },
    tableName: {
      type: String
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data () {
      this.rows = this.data
    },
    tableName () {
      this.name = this.tableName
    }
  }
}
</script>
