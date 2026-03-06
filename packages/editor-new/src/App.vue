<template>
  <div class="app-container">
    <!-- Left Pane: AI Chat -->
    <div class="pane left-pane">
      <div class="pane-header">
        <h3>🤖 AI Assistant</h3>
        <p>Describe what you want to build in Vue.</p>
      </div>
      <div class="pane-content">
        <!-- AI Settings -->
        <div class="settings-box">
          <div class="settings-title">LLM Configuration</div>
          <el-input v-model="llmBaseUrl" placeholder="Base URL (e.g. https://api.openai.com/v1)" size="small" style="margin-bottom: 8px;" />
          <el-input v-model="llmApiKey" type="password" placeholder="API Key" size="small" show-password />
          <el-input v-model="llmModel" placeholder="Model (e.g. gpt-4o)" size="small" style="margin-top: 8px; margin-bottom: 8px;" />
          <el-checkbox v-model="useCorsProxy" size="small">Use Local Proxy (Bypass CORS)</el-checkbox>
        </div>

        <!-- Chat history placeholder -->
      </div>
      <div class="chat-input-area">
        <el-input
          v-model="prompt"
          type="textarea"
          :rows="3"
          placeholder="E.g. Build a beautiful login card using Element Plus components"
          resize="none"
        />
        <el-button type="primary" :loading="isGenerating" class="generate-btn" @click="handleAiGenerate">
          Generate with AI
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
      <div class="pane-header bg-white" style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0;">Code Editor</h3>
        <el-radio-group v-model="codeMode" size="small">
          <el-radio-button label="vue">Vue SFC</el-radio-button>
          <el-radio-button label="json">Raw JSON</el-radio-button>
        </el-radio-group>
      </div>
      <textarea
        v-if="codeMode === 'vue'"
        v-model="code"
        @input="handleCodeChange"
        class="code-editor"
        spellcheck="false"
      ></textarea>
      <textarea
        v-else
        v-model="jsonCode"
        @input="handleJsonChange"
        class="code-editor"
        spellcheck="false"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { JSONNode, createInitialState } from './core/types';
import JsonRenderer from './core/JsonRenderer.vue';
import { CodeGenerator } from './compiler/CodeGenerator';
import { CodeParser } from './compiler/CodeParser';

const dsl = ref<JSONNode>(createInitialState());
const codeMode = ref<'vue' | 'json'>('vue');
const code = ref<string>('');
const jsonCode = ref<string>('');

// AI state
const prompt = ref<string>('');
const isGenerating = ref(false);
const llmApiKey = ref('');
const llmBaseUrl = ref('https://api.openai.com/v1');
const llmModel = ref('gpt-4o');
const useCorsProxy = ref(true);

const codeGen = new CodeGenerator();

// Initial sync
onMounted(() => {
  syncEditors(dsl.value);
});

// Sync code when DSL changes visually or by AI
watch(dsl, (newDsl) => {
  syncEditors(newDsl);
}, { deep: true });

const syncEditors = (node: JSONNode) => {
  if (codeMode.value === 'vue') {
    code.value = codeGen.generateCode(node);
  } else {
    jsonCode.value = JSON.stringify(node, null, 2);
  }
};

// Re-sync when switching tabs
watch(codeMode, () => {
  syncEditors(dsl.value);
});

const handleCodeChange = (e: Event) => {
  const newCode = (e.target as HTMLTextAreaElement).value;
  code.value = newCode;

  const parser = new CodeParser(dsl.value);
  const newDsl = parser.parseCode(newCode);
  if (newDsl) {
    dsl.value = newDsl;
  }
};

const handleJsonChange = (e: Event) => {
  const newJsonStr = (e.target as HTMLTextAreaElement).value;
  jsonCode.value = newJsonStr;
  try {
    const parsed = JSON.parse(newJsonStr);
    if (parsed && parsed.type) {
      dsl.value = parsed;
    }
  } catch (err) {
    // Ignore parse errors while typing
  }
};

const handleAiGenerate = async () => {
  if (!prompt.value.trim()) return;

  if (!llmApiKey.value) {
    ElMessage.warning('Please enter an API Key to use the real LLM.');
    // Simulated fallback behavior
    const simulatedDsl = JSON.parse(JSON.stringify(dsl.value));
    if (!simulatedDsl.children) simulatedDsl.children = [];
    simulatedDsl.children.push({
      id: crypto.randomUUID(),
      type: 'el-alert',
      props: { type: 'success', title: `Simulated: ${prompt.value}` }
    });
    dsl.value = simulatedDsl;
    prompt.value = '';
    return;
  }

  isGenerating.value = true;
  try {
    const systemPrompt = `You are an expert Vue 3 and Element Plus low-code generator.
Your task is to modify or completely replace the provided JSON DSL based on the user's natural language request.

The JSON DSL interface is:
interface JSONNode {
  id: string; // MUST be a UUID or "root"
  type: string; // The HTML or Element Plus tag (e.g. 'div', 'el-button', 'el-card')
  props: Record<string, any>; // Element props and styles. Keep style objects flat, map props to standard vue bindings.
  children?: JSONNode[];
  text?: string; // Inner text content of the element
}

Return ONLY a valid, minified JSON object matching this interface that represents the completely updated screen. Do NOT wrap it in markdown block quotes (\`\`\`json). Just return the raw JSON string starting with { and ending with }.`;

    const targetUrl = `${llmBaseUrl.value.replace(/\/$/, '')}/chat/completions`;
    const fetchUrl = useCorsProxy.value ? '/api/proxy' : targetUrl;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${llmApiKey.value}`
    };

    if (useCorsProxy.value) {
      headers['x-target-url'] = targetUrl;
    }

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: llmModel.value,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Current DSL: ${JSON.stringify(dsl.value)}\n\nUser Request: ${prompt.value}` }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(data.error?.message || 'Invalid response from LLM.');
    }

    let content = data.choices[0].message.content.trim();

    // Clean up potential markdown blocks if the LLM ignores instructions
    if (content.startsWith('```json')) content = content.replace(/^```json\n?/, '');
    else if (content.startsWith('```')) content = content.replace(/^```\n?/, '');
    if (content.endsWith('```')) content = content.replace(/\n?```$/, '');

    const newDsl = JSON.parse(content.trim());

    if (newDsl && newDsl.type) {
      dsl.value = newDsl;
      prompt.value = '';
      ElMessage.success('Generated successfully!');
    } else {
      throw new Error('LLM returned invalid JSON structure.');
    }

  } catch (error: any) {
    ElMessage.error(error.message || 'Failed to generate UI.');
  } finally {
    isGenerating.value = false;
  }
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

.settings-box {
  background-color: #ebeef5;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.settings-title {
  font-size: 12px;
  font-weight: bold;
  color: #606266;
  margin-bottom: 8px;
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
