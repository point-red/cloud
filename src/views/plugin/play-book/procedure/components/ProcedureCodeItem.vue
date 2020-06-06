<template>
  <div :class="{ parent: !procedure.procedure_id || isParent }">
    <div class="d-flex procedure" :class="{ 'ml-3': !i }">
      <div class="no ml-2" v-if="i">{{ i }}</div>
      <div class="code">
        <div>
          <small class="text-mode">Code</small>
        </div>
        <router-link :to="`/plugin/play-book/procedure/${procedure.id}`">{{ procedure.code }}</router-link>
      </div>
      <div class="name">
        <div>
          <small class="text-mode">Name</small>
        </div>
        {{ procedure.name }}
      </div>
      <div class="purpose">
        <div>
          <small class="text-mode">Purpose</small>
        </div>
        {{ procedure.purpose || '-' | capitalize }}
      </div>
      <div class="purpose" v-if="procedure.procedure_id">
        <div>
          <small class="text-mode">Content</small>
        </div>
        {{ procedure.content || '-' }}
      </div>
      <div class="note">
        <div>
          <small class="text-mode">Note</small>
        </div>
        {{ procedure.note || '-' }}
      </div>
      <div class="action d-flex">
        <button
          class="btn btn-sm btn-light mr-2"
          v-if="withAddButton && $permission.has('create play book procedures code')"
          @click="$refs.modalAddProcedure.open()">
          <i class="fa fa-plus"></i>
        </button>
        <router-link
          class="btn btn-sm btn-light"
          title="SEE HISTORY"
          :to="`/plugin/play-book/procedure/${procedure.id}/histories`"
        ><i class="fa fa-history"></i></router-link>
      </div>
    </div>
    <div
      class="procedures pl-4"
      v-if="procedure.procedures && procedure.procedures.length && !noChilds">
      <procedure-code-item
        v-for="sub of procedure.procedures"
        :key="sub.id"
        :procedure="sub"
        :with-add-button="!!withAddButton"
        @added="$emit('added')"
        ></procedure-code-item>
    </div>

    <m-add-procedure
      ref="modalAddProcedure"
      :parent-id="procedure.id"
      @added="$emit('added')"></m-add-procedure>
  </div>
</template>

<script>
export default {
  props: ['i', 'procedure', 'noChilds', 'withAddButton', 'isParent'],
  name: 'procedure-code-item'
}
</script>

<style lang="scss" scoped>
.procedure {
  align-items: flex-start;
  align-content: center;
  margin-bottom: .5rem;
  border-radius: .4rem;
  padding-bottom: .4rem;
  padding-top: .4rem;
  transition: all .3s ease;
  -webkit-user-select: none !important;
  -webkit-touch-callout: none !important;
  touch-action: none;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .no {
    width: 2rem;
    align-self: center;
  }

  .code {
    min-width: 6rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .name {
    width: 15rem;
  }

  .purpose {
    width: 25rem;
    margin-right: 1rem;
  }

  .note {
    flex-grow: 1;
  }

  .action {
    width: fit-content;
    padding-left: 1rem;
  }
}

.parent {
  .procedures {
    margin-left: .75rem;
  }

  > .procedures {
    border-left: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>
