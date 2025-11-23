<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from "@halo-dev/richtext-editor";
import { reactive } from "vue";

const props = defineProps(nodeViewProps as any);

const local = reactive({
  repo: (props.node?.attrs?.repo as string) || ""
});

function sync() {
  props.updateAttributes?.({ repo: local.repo });
}

function handleRepoChange(value: string) {
  local.repo = value;
  sync();
}
</script>

<template>
  <node-view-wrapper as="div" class="github-editor">
    <div class="github-editor__header">
      <span class="github-editor__title">GitHub 仓库展示</span>
      <span class="github-editor__subtitle">展示指定 GitHub 仓库的统计信息卡片</span>
    </div>

    <div class="github-editor__section">
      <label class="github-editor__field-label" for="github-pin-repo">仓库名称（可选）</label>
      <input
        id="github-pin-repo"
        class="github-editor__input"
        type="text"
        placeholder="例如: username/repo-name"
        :value="local.repo"
        @input="handleRepoChange(($event.target as HTMLInputElement).value)"
      />
      <div class="github-editor__help">
        留空则显示默认仓库。格式：username/repo-name
      </div>
    </div>

    <div class="github-editor__preview">
      <div class="github-editor__preview-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
        <span>GitHub 仓库统计卡片</span>
      </div>
    </div>
  </node-view-wrapper>
</template>

<style scoped>
.github-editor {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.github-editor__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.github-editor__title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.github-editor__subtitle {
  font-size: 12px;
  color: #6b7280;
}

.github-editor__section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.github-editor__field-label {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
}

.github-editor__input {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  color: #1f2937;
  transition: all 0.2s ease;
}

.github-editor__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.github-editor__help {
  font-size: 11px;
  color: #6b7280;
}

.github-editor__preview {
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.github-editor__preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
}

.github-editor__preview-placeholder svg {
  width: 32px;
  height: 32px;
}

.github-editor__preview-placeholder span {
  font-size: 12px;
}
</style>

