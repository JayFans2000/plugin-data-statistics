<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from "@halo-dev/richtext-editor";
import { reactive } from "vue";

const props = defineProps(nodeViewProps as any);

const local = reactive({
  layout: (props.node?.attrs?.layout as string) || "",
  hideProgress: (props.node?.attrs?.hideProgress as string) || "",
  statsFormat: (props.node?.attrs?.statsFormat as string) || ""
});

function sync() {
  props.updateAttributes?.({
    layout: local.layout,
    hideProgress: local.hideProgress,
    statsFormat: local.statsFormat
  });
}

function handleLayoutChange(value: string) {
  local.layout = value;
  sync();
}

function handleHideProgressChange(value: string) {
  local.hideProgress = value;
  sync();
}

function handleStatsFormatChange(value: string) {
  local.statsFormat = value;
  sync();
}
</script>

<template>
  <node-view-wrapper as="div" class="github-editor">
    <div class="github-editor__header">
      <span class="github-editor__title">GitHub 语言展示卡</span>
      <span class="github-editor__subtitle">展示 GitHub 账户最常用的编程语言</span>
    </div>

    <div class="github-editor__section">
      <label class="github-editor__field-label" for="github-top-langs-layout">布局方式</label>
      <select
        id="github-top-langs-layout"
        class="github-editor__select"
        :value="local.layout"
        @change="handleLayoutChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="">默认</option>
        <option value="compact">紧凑</option>
        <option value="donut">甜甜圈</option>
        <option value="donut-vertical">垂直甜甜圈</option>
        <option value="pie">饼图</option>
      </select>
      <div class="github-editor__help">
        选择不同的布局方式来展示语言统计
      </div>
    </div>

    <div class="github-editor__section">
      <label class="github-editor__field-label" for="github-top-langs-hide-progress">隐藏进度条</label>
      <select
        id="github-top-langs-hide-progress"
        class="github-editor__select"
        :value="local.hideProgress"
        @change="handleHideProgressChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="">显示</option>
        <option value="true">隐藏</option>
      </select>
      <div class="github-editor__help">
        隐藏百分比和进度条（布局将自动设置为紧凑）
      </div>
    </div>

    <div class="github-editor__section">
      <label class="github-editor__field-label" for="github-top-langs-stats-format">统计格式</label>
      <select
        id="github-top-langs-stats-format"
        class="github-editor__select"
        :value="local.statsFormat"
        @change="handleStatsFormatChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="">百分比</option>
        <option value="bytes">字节</option>
      </select>
      <div class="github-editor__help">
        选择以百分比或字节形式显示统计数据
      </div>
    </div>

    <div class="github-editor__preview">
      <div class="github-editor__preview-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>GitHub 语言统计卡片</span>
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

