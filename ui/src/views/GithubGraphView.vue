<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from "@halo-dev/richtext-editor";
import { reactive } from "vue";

const props = defineProps(nodeViewProps as any);

const local = reactive({
  theme: (props.node?.attrs?.theme as string) || "minimal"
});

function sync() {
  props.updateAttributes?.({ theme: local.theme });
}

function handleThemeChange(value: string) {
  local.theme = value;
  sync();
}
</script>

<template>
  <node-view-wrapper as="div" class="github-editor">
    <div class="github-editor__header">
      <span class="github-editor__title">GitHub 活动图表</span>
      <span class="github-editor__subtitle">展示 GitHub 贡献活动热力图</span>
    </div>

    <div class="github-editor__section">
      <label class="github-editor__field-label" for="github-graph-theme">主题</label>
      <select
        id="github-graph-theme"
        class="github-editor__select"
        :value="local.theme"
        @change="handleThemeChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="minimal">Minimal（默认）</option>
        <option value="radical">Radical</option>
        <option value="coral">Coral</option>
        <option value="nord">Nord</option>
        <option value="lucent">Lucent</option>
        <option value="dracula">Dracula</option>
        <option value="gruvbox">Gruvbox</option>
        <option value="chartreuse-dark">Chartreuse Dark</option>
        <option value="github-light">GitHub Light</option>
        <option value="github-dark">GitHub Dark</option>
        <option value="github-dark-dimmed">GitHub Dark Dimmed</option>
        <option value="material-palenight">Material Palenight</option>
        <option value="green">Green</option>
        <option value="gotham">Gotham</option>
        <option value="noctis-minimus">Noctis Minimus</option>
        <option value="monokai">Monokai</option>
        <option value="one-dark">One Dark</option>
        <option value="elegant">Elegant</option>
        <option value="aqua">Aqua</option>
        <option value="synthwave-84">Synthwave 84</option>
        <option value="react">React</option>
        <option value="merko">Merko</option>
        <option value="vue">Vue</option>
        <option value="tokyo-day">Tokyo Day</option>
        <option value="tokyo-night">Tokyo Night</option>
        <option value="high-contrast">High Contrast</option>
        <option value="cobalt">Cobalt</option>
        <option value="material">Material</option>
        <option value="nightowl">Nightowl</option>
        <option value="modern-lilac">Modern Lilac</option>
        <option value="arctic">Arctic</option>
      </select>
    </div>

    <div class="github-editor__preview">
      <div class="github-editor__preview-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <rect x="7" y="7" width="2" height="2"></rect>
          <rect x="11" y="7" width="2" height="2"></rect>
          <rect x="15" y="7" width="2" height="2"></rect>
          <rect x="7" y="11" width="2" height="2"></rect>
          <rect x="11" y="11" width="2" height="2"></rect>
          <rect x="15" y="11" width="2" height="2"></rect>
          <rect x="7" y="15" width="2" height="2"></rect>
          <rect x="11" y="15" width="2" height="2"></rect>
          <rect x="15" y="15" width="2" height="2"></rect>
        </svg>
        <span>GitHub 活动热力图</span>
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

.github-editor__select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  color: #1f2937;
  width: 180px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.github-editor__select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
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

