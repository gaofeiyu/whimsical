<template>
  <div class="app-container">
    <!-- Left Pane: AI Chat -->
    <div class="pane left-pane">
      <div class="pane-header">
        <h3>🤖 AI Assistant</h3>
        <p>Describe what you want to build in Vue.</p>
      </div>
      <div class="pane-content">
        <!-- Chat history placeholder -->
      </div>
      <div class="chat-input-area">
        <el-input
          v-model="prompt"
          type="textarea"
          :rows="3"
          placeholder="E.g. Add a red primary Element button"
          resize="none"
        />
        <el-button type="primary" class="generate-btn" @click="handleAiSimulate">
          Generate
        </el-button>
      </div>
    </div>

    <!-- Center Pane: Visual Preview -->
    <div class="pane center-pane">
      <div class="pane-header bg-white">
        <h3>画布 Preview (Vue + Element)</h3>
      </div>
      <div class="preview-content">
        <JsonRenderer :node="dsl" />
      </div>
    </div>

    <!-- Right Pane: Code Editor -->
    <div class="pane right-pane">
      <div class="pane-header bg-white">
        <h3>Vue SFC Code (Bidirectional)</h3>
      </div>
      <textarea
        v-model="code"
        @input="handleCodeChange"
        class="code-editor"
        spellcheck="false"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { JSONNode, createInitialState } from './core/types';
import JsonRenderer from './core/JsonRenderer.vue';
import { CodeGenerator } from './compiler/CodeGenerator';
import { CodeParser } from './compiler/CodeParser';

const dsl = ref<JSONNode>(createInitialState());
const code = ref<string>('');
const prompt = ref<string>('');

const codeGen = new CodeGenerator();

// Initialize code on mount
onMounted(() => {
  code.value = codeGen.generateCode(dsl.value);
});

// Sync code when DSL changes from AI
watch(dsl, (newDsl) => {
  code.value = codeGen.generateCode(newDsl);
}, { deep: true });

const handleCodeChange = (e: Event) => {
  const newCode = (e.target as HTMLTextAreaElement).value;
  code.value = newCode;

  // Parse Vue code back to DSL
  const parser = new CodeParser(dsl.value);
  const newDsl = parser.parseCode(newCode);
  if (newDsl) {
    dsl.value = newDsl;
  }
};

const handleAiSimulate = () => {
  if (!prompt.value.trim()) return;

  const simulatedDsl = JSON.parse(JSON.stringify(dsl.value));

  if (!simulatedDsl.children) simulatedDsl.children = [];

  // Simulate AI generating an Element Plus button
  simulatedDsl.children.push({
    id: crypto.randomUUID(),
    type: 'el-button',
    props: {
      type: 'danger', // Use element plus semantic type
    },
    text: prompt.value
  });

  dsl.value = simulatedDsl;
  prompt.value = '';
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.pane {
  display: flex;
  flex-direction: column;
}

.pane-header {
  padding: 16px;
  border-bottom: 1px solid #dcdfe6;
}

.pane-header h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.pane-header p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.bg-white {
  background-color: #fff;
}

.left-pane {
  width: 300px;
  background-color: #f5f7fa;
  border-right: 1px solid #dcdfe6;
}

.pane-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.chat-input-area {
  padding: 16px;
  border-top: 1px solid #dcdfe6;
  background-color: #fff;
}

.generate-btn {
  width: 100%;
  margin-top: 12px;
}

.center-pane {
  flex: 1;
  background-color: #e4e7ed;
}

.preview-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.right-pane {
  width: 500px;
  border-left: 1px solid #dcdfe6;
  background-color: #1e1e1e;
}

.right-pane .pane-header {
  background-color: #252526;
  color: #cccccc;
  border-bottom: 1px solid #3c3c3c;
}

.right-pane .pane-header h3 {
  color: #cccccc;
}

.code-editor {
  flex: 1;
  padding: 16px;
  border: none;
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  resize: none;
  outline: none;
}
</style>

<style>
/* Global reset inside the app */
body {
  margin: 0;
}
</style>
