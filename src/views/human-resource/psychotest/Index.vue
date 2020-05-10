<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <span class="breadcrumb-item active">{{
        $t("psychotest") | titlecase
      }}</span>
    </breadcrumb>
    <div class="row gutters-tiny">
      <p-box
        :name="$t('candidate') | titlecase"
        v-if="$permission.has('read employee')"
        link="/human-resource/psychotest/candidate"
        icon="si si-user"
      />
      <p-box
        :name="$t('candidate position') | titlecase"
        v-if="$permission.has('read employee')"
        link="/human-resource/psychotest/candidate-position"
        icon="si si-user"
      />
      <p-box
        :name="$t('kraepelin') | titlecase"
        v-if="$permission.has('read employee')"
        link="/human-resource/psychotest/kraepelin"
        icon="si si-calculator"
      />
      <p-box
        :name="$t('papikostick category') | titlecase"
        v-if="$permission.has('read employee')"
        link="/human-resource/psychotest/papikostick-category"
        icon="si si-list"
      />
      <p-box
        :name="$t('position category') | titlecase"
        v-if="$permission.has('read employee')"
        link="/human-resource/psychotest/position-category"
        icon="si si-list"
      />
      <!-- <p-box
        :name="$t('papikostick question') | titlecase"
        v-if="$permission.has('read employee')"
        link="/human-resource/psychotest/papikostick-question"
        icon="si si-list"/>
      <p-box
        :name="$t('papikostick option') | titlecase"
        v-if="$permission.has('read employee')"
        link="/human-resource/psychotest/papikostick-option"
        icon="si si-list"/> -->
      <p-box
        :name="$t('papikostick') | titlecase"
        v-if="$permission.has('read employee')"
        link="/human-resource/psychotest/papikostick"
        icon="si si-list"
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'

export default {
  components: {
    Breadcrumb,
    BreadcrumbHumanResource
  }
}
</script>
