<template>
  <component :is="node.type" v-bind="node.props" :data-w-id="node.id">
    {{ node.text }}
    <JsonRenderer
      v-for="child in node.children"
      :key="child.id"
      :node="child"
    />
  </component>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { JSONNode } from './types';

defineProps({
  node: {
    type: Object as PropType<JSONNode>,
    required: true
  }
});
</script>
