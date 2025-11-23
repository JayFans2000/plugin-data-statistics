<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from "@halo-dev/richtext-editor";
import { reactive } from "vue";

const props = defineProps(nodeViewProps as any);

const local = reactive({
  locale: (props.node?.attrs?.locale as string) || "cn",
  showIcons: (props.node?.attrs?.showIcons as string) || "",
  theme: (props.node?.attrs?.theme as string) || ""
});

function sync() {
  props.updateAttributes?.({
    locale: local.locale,
    showIcons: local.showIcons,
    theme: local.theme
  });
}

function handleLocaleChange(value: string) {
  local.locale = value;
  sync();
}

function handleShowIconsChange(value: string) {
  local.showIcons = value;
  sync();
}

function handleThemeChange(value: string) {
  local.theme = value;
  sync();
}
</script>

<template>
  <node-view-wrapper as="div" class="github-editor">
    <div class="github-editor__header">
      <span class="github-editor__title">GitHub 统计卡</span>
      <span class="github-editor__subtitle">展示 GitHub 账户的统计信息</span>
    </div>

    <div class="github-editor__section">
      <label class="github-editor__field-label" for="github-stats-locale">语言设置</label>
      <select
        id="github-stats-locale"
        class="github-editor__select"
        :value="local.locale"
        @change="handleLocaleChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="cn">中文</option>
        <option value="zh-tw">繁体</option>
        <option value="en">英语</option>
      </select>
    </div>

    <div class="github-editor__section">
      <label class="github-editor__field-label" for="github-stats-show-icons">显示图标（可选）</label>
      <select
        id="github-stats-show-icons"
        class="github-editor__select"
        :value="local.showIcons"
        @change="handleShowIconsChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="">默认</option>
        <option value="true">是</option>
        <option value="false">否</option>
      </select>
    </div>

    <div class="github-editor__section">
      <label class="github-editor__field-label" for="github-stats-theme">主题</label>
      <select
        id="github-stats-theme"
        class="github-editor__select"
        :value="local.theme"
        @change="handleThemeChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="">默认主题（蓝色）</option>
        <option value="dark">暗色</option>
        <option value="radical">激进</option>
        <option value="merko">Merko</option>
        <option value="gruvbox">Gruvbox</option>
        <option value="tokyonight">东京之夜</option>
        <option value="onedark">One Dark</option>
        <option value="cobalt">钴蓝</option>
        <option value="synthwave">合成波</option>
        <option value="highcontrast">高对比度</option>
        <option value="dracula">德古拉</option>
      </select>
    </div>

    <div class="github-editor__preview">
      <div class="github-editor__preview-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="9"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
        <span>GitHub 统计卡片</span>
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

.github-editor__input,
.github-editor__select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  color: #1f2937;
  transition: all 0.2s ease;
}

.github-editor__input:focus,
.github-editor__select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.github-editor__select {
  width: 180px;
  cursor: pointer;
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

