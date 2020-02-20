<template>
  <div>
    <button type="button" class="btn btn-sm btn-secondary" @click="show">
      <i class="fa fa-plus"/> Add Unit Converter
    </button>
    <p-modal :ref="'select-' + id" :id="'select-' + id" :title="'unit converter' | uppercase">
      <template slot="content">
        {{ $t('create item helper - unit') }}
        <hr>
        <div v-if="isLoading">
          <h3 class="text-center">Loading ...</h3>
        </div>
        <div v-else class="list-group push">
          <p-table>
            <tr slot="p-head">
              <th class="text-center" width="300px">Unit</th>
              <th class="text-center">Convert To</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Default (Purchase)</th>
              <th class="text-center">Default (Sales)</th>
              <th></th>
            </tr>
            <tr slot="p-body" v-for="(unit, index) in units" :key="index">
              <th>
                <template v-if="index == 0">
                  1 {{ units[index].name | uppercase }}
                </template>
                <template v-else>
                  1 {{ units[index].name | uppercase }} = {{ units[index].converter }} {{ units[0].name | uppercase }}
                </template>
              </th>
              <td class="text-center">
                <p-form-input
                  :id="'id' + index"
                  name="name[]"
                  v-model="unit['name']"
                  :placeholder="$t('convert to') | uppercase"/>
              </td>
              <td class="text-center">
                <p-form-number
                  :id="'converter-' + index"
                  name="converter[]"
                  :readonly="index == 0"
                  v-model="unit['converter']"
                  :is-text-right="true"/>
              </td>
              <td class="text-center">
                <p-form-check-box
                  :id="'default-purchase-' + index"
                  :is-form="false"
                  @click.native="togglePurchase(index)"
                  :checked="units[index].default_purchase">
                </p-form-check-box>
              </td>
              <td class="text-center">
                <p-form-check-box
                  :id="'default-sales-' + index"
                  :is-form="false"
                  @click.native="toggleSales(index)"
                  :checked="units[index].default_sales">
                </p-form-check-box>
              </td>
              <td>
                <i class="clickable fa fa-close" @click="clear(index)"></i>
              </td>
            </tr>
          </p-table>
          <button type="button" class="btn btn-sm btn-secondary" @click="addRow">
            <i class="fa fa-plus"/> {{ $t('add') | uppercase }}
          </button>
        </div>
      </template>
      <template slot="footer">
        <button type="button" @click="update()" class="btn btn-primary">Update</button>
        <button type="button" @click="close()" class="btn btn-sm btn-outline-danger">{{ $t('close') | uppercase }}</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      units: [
        {
          name: 'PCS',
          label: 'PCS',
          converter: 1,
          default_purchase: true,
          default_sales: true
        }
      ],
      isLoading: false
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  watch: {
    'units': {
      handler: function (newValue) {
        this.units.forEach(function (element) {
          element.label = element.name
        })
      },
      deep: true
    }
  },
  methods: {
    addRow () {
      this.units.push({
        label: '',
        name: '',
        converter: 0,
        default_purchase: false,
        default_sales: false
      })
    },
    clear (index) {
      this.units.splice(index, 1)
    },
    togglePurchase (i) {
      for (let j = 0; j < this.units.length; j++) {
        if (i == j) {
          this.units[i].default_purchase = !this.units[i].default_purchase
        } else {
          this.units[j].default_purchase = false
        }
      }
    },
    toggleSales (i) {
      for (let j = 0; j < this.units.length; j++) {
        if (i == j) {
          this.units[i].default_sales = !this.units[i].default_sales
        } else {
          this.units[j].default_sales = false
        }
      }
    },
    update () {
      this.$emit('updated', this.units)
      this.close()
    },
    show () {
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$refs['select-' + this.id].close()
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
