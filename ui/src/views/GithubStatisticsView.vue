<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from "@halo-dev/richtext-editor";
import { reactive, computed, markRaw } from "vue";
import MdiChartBar from "~icons/mdi/chart-bar";
import MdiCodeTags from "~icons/mdi/code-tags";
import MdiChartTimelineVariant from "~icons/mdi/chart-timeline-variant";
import MdiPin from "~icons/mdi/pin";
import MdiChevronDown from "~icons/mdi/chevron-down";
import MdiChevronUp from "~icons/mdi/chevron-up";

const props = defineProps(nodeViewProps as any);

const githubTypeOptions = [
  { label: "活跃热力表", value: "graph", icon: markRaw(MdiChartTimelineVariant) },
  { label: "贡献工具", value: "stats", icon: markRaw(MdiChartBar) },
  { label: "仓库展示", value: "pin", icon: markRaw(MdiPin) },
  { label: "开发语言统计", value: "top-langs", icon: markRaw(MdiCodeTags) }
];

const local = reactive({
  types: (props.node?.attrs?.types as string[]) || ["graph"],
  // Stats 配置
  statsLocale: (props.node?.attrs?.statsLocale as string) || "",
  statsShowIcons: (props.node?.attrs?.statsShowIcons as string) || "",
  statsTheme: (props.node?.attrs?.statsTheme as string) || "",
  // Pin 配置
  pinRepo: (props.node?.attrs?.pinRepo as string) || "",
  // Top Langs 配置
  topLangsLayout: (props.node?.attrs?.topLangsLayout as string) || "",
  topLangsHideProgress: (props.node?.attrs?.topLangsHideProgress as string) || "",
  topLangsStatsFormat: (props.node?.attrs?.topLangsStatsFormat as string) || "",
  // Graph 配置
  graphTheme: (props.node?.attrs?.graphTheme as string) || "minimal",
  // 折叠状态
  expandedConfigs: {
    stats: false,
    pin: false,
    topLangs: false,
    graph: false
  }
});

function sync() {
  props.updateAttributes?.({
    types: local.types,
    statsLocale: local.statsLocale,
    statsShowIcons: local.statsShowIcons,
    statsTheme: local.statsTheme,
    pinRepo: local.pinRepo,
    topLangsLayout: local.topLangsLayout,
    topLangsHideProgress: local.topLangsHideProgress,
    topLangsStatsFormat: local.topLangsStatsFormat,
    graphTheme: local.graphTheme
  });
}

function handleTypeToggle(value: string) {
  const index = local.types.indexOf(value);
  if (index > -1) {
    local.types.splice(index, 1);
  } else {
    local.types.push(value);
  }
  sync();
}

function toggleConfig(type: string) {
  local.expandedConfigs[type as keyof typeof local.expandedConfigs] = !local.expandedConfigs[type as keyof typeof local.expandedConfigs];
}
</script>

<template>
  <node-view-wrapper as="div" class="github-stats-editor">
    <div class="github-stats-editor__header">
      <span class="github-stats-editor__title">GitHub 统计</span>
      <span class="github-stats-editor__subtitle">
        选择要展示的 GitHub 统计类型，发布后系统会自动从 API 获取实时数据。
      </span>
    </div>

    <div class="github-stats-editor__section">
      <label class="github-stats-editor__field-label">选择统计类型</label>
      <div class="github-stats-editor__type-grid">
        <div
          v-for="option in githubTypeOptions"
          :key="option.value"
          class="github-stats-editor__type-item"
          :class="{ 'github-stats-editor__type-item--active': local.types.includes(option.value) }"
          @click="handleTypeToggle(option.value)"
        >
          <span class="github-stats-editor__type-icon">
            <component :is="option.icon" />
          </span>
          <span class="github-stats-editor__type-label">{{ option.label }}</span>
        </div>
      </div>
    </div>

    <!-- Graph 配置 -->
    <div v-if="local.types.includes('graph')" class="github-stats-editor__config-section">
      <div class="github-stats-editor__config-header" @click="toggleConfig('graph')">
        <span class="github-stats-editor__config-title">活跃热力表配置</span>
        <component :is="local.expandedConfigs.graph ? MdiChevronUp : MdiChevronDown" class="github-stats-editor__config-toggle" />
      </div>
      <div v-show="local.expandedConfigs.graph" class="github-stats-editor__config-content">
        <div class="github-stats-editor__config-row">
          <div class="github-stats-editor__config-field">
            <label class="github-stats-editor__field-label">主题</label>
            <select
              class="github-stats-editor__select"
              :value="local.graphTheme"
              @change="local.graphTheme = ($event.target as HTMLSelectElement).value; sync()"
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
        </div>
      </div>
    </div>

    <!-- Stats 配置 -->
    <div v-if="local.types.includes('stats')" class="github-stats-editor__config-section">
      <div class="github-stats-editor__config-header" @click="toggleConfig('stats')">
        <span class="github-stats-editor__config-title">贡献工具配置</span>
        <component :is="local.expandedConfigs.stats ? MdiChevronUp : MdiChevronDown" class="github-stats-editor__config-toggle" />
      </div>
      <div v-show="local.expandedConfigs.stats" class="github-stats-editor__config-content">
        <div class="github-stats-editor__config-row">
          <div class="github-stats-editor__config-field">
            <label class="github-stats-editor__field-label">语言</label>
            <select
              class="github-stats-editor__select"
              :value="local.statsLocale"
              @change="local.statsLocale = ($event.target as HTMLSelectElement).value; sync()"
            >
              <option value="">默认</option>
              <option value="cn">中文</option>
              <option value="zh-tw">繁体</option>
              <option value="en">英语</option>
            </select>
          </div>
          <div class="github-stats-editor__config-field">
            <label class="github-stats-editor__field-label">显示图标</label>
            <select
              class="github-stats-editor__select"
              :value="local.statsShowIcons"
              @change="local.statsShowIcons = ($event.target as HTMLSelectElement).value; sync()"
            >
              <option value="">默认</option>
              <option value="true">是</option>
              <option value="false">否</option>
            </select>
          </div>
          <div class="github-stats-editor__config-field">
            <label class="github-stats-editor__field-label">主题</label>
            <select
              class="github-stats-editor__select"
              :value="local.statsTheme"
              @change="local.statsTheme = ($event.target as HTMLSelectElement).value; sync()"
            >
              <option value="">默认</option>
              <option value="dark">暗色</option>
              <option value="radical">激进</option>
              <option value="merko">Merko</option>
              <option value="gruvbox">Gruvbox</option>
              <option value="dracula">Dracula</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Pin 配置 -->
    <div v-if="local.types.includes('pin')" class="github-stats-editor__config-section">
      <div class="github-stats-editor__config-header" @click="toggleConfig('pin')">
        <span class="github-stats-editor__config-title">仓库展示配置</span>
        <component :is="local.expandedConfigs.pin ? MdiChevronUp : MdiChevronDown" class="github-stats-editor__config-toggle" />
      </div>
      <div v-show="local.expandedConfigs.pin" class="github-stats-editor__config-content">
        <div class="github-stats-editor__config-row">
          <div class="github-stats-editor__config-field">
            <label class="github-stats-editor__field-label">仓库名称（可选）</label>
            <input
              class="github-stats-editor__input"
              type="text"
              placeholder="例如: username/repo-name"
              :value="local.pinRepo"
              @input="local.pinRepo = ($event.target as HTMLInputElement).value; sync()"
            />
            <div class="github-stats-editor__help">留空则显示默认仓库</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Langs 配置 -->
    <div v-if="local.types.includes('top-langs')" class="github-stats-editor__config-section">
      <div class="github-stats-editor__config-header" @click="toggleConfig('topLangs')">
        <span class="github-stats-editor__config-title">开发语言统计配置</span>
        <component :is="local.expandedConfigs.topLangs ? MdiChevronUp : MdiChevronDown" class="github-stats-editor__config-toggle" />
      </div>
      <div v-show="local.expandedConfigs.topLangs" class="github-stats-editor__config-content">
        <div class="github-stats-editor__config-row">
          <div class="github-stats-editor__config-field">
            <label class="github-stats-editor__field-label">布局方式</label>
            <select
              class="github-stats-editor__select"
              :value="local.topLangsLayout"
              @change="local.topLangsLayout = ($event.target as HTMLSelectElement).value; sync()"
            >
              <option value="">默认</option>
              <option value="compact">紧凑</option>
              <option value="donut">甜甜圈</option>
              <option value="pie">饼图</option>
            </select>
          </div>
          <div class="github-stats-editor__config-field">
            <label class="github-stats-editor__field-label">隐藏进度条</label>
            <select
              class="github-stats-editor__select"
              :value="local.topLangsHideProgress"
              @change="local.topLangsHideProgress = ($event.target as HTMLSelectElement).value; sync()"
            >
              <option value="">显示</option>
              <option value="true">隐藏</option>
            </select>
          </div>
          <div class="github-stats-editor__config-field">
            <label class="github-stats-editor__field-label">统计格式</label>
            <select
              class="github-stats-editor__select"
              :value="local.topLangsStatsFormat"
              @change="local.topLangsStatsFormat = ($event.target as HTMLSelectElement).value; sync()"
            >
              <option value="">百分比</option>
              <option value="bytes">字节</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </node-view-wrapper>
</template>

<style scoped>
.github-stats-editor {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  max-width: 520px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.github-stats-editor__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f3f4f6;
}

.github-stats-editor__title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.01em;
}

.github-stats-editor__subtitle {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
}

.github-stats-editor__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.github-stats-editor__field-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 2px;
}

.github-stats-editor__type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.github-stats-editor__type-item {
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  overflow: hidden;
}

.github-stats-editor__type-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.github-stats-editor__type-item:hover {
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.12);
}

.github-stats-editor__type-item:hover::before {
  opacity: 1;
}

.github-stats-editor__type-item--active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  box-shadow: 0 1px 4px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.github-stats-editor__type-item--active::before {
  opacity: 1;
}

.github-stats-editor__type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #6b7280;
  position: relative;
  z-index: 1;
  transition: color 0.2s ease, transform 0.2s ease;
}

.github-stats-editor__type-icon svg {
  width: 16px;
  height: 16px;
}

.github-stats-editor__type-item:hover .github-stats-editor__type-icon {
  color: #3b82f6;
  transform: scale(1.1);
}

.github-stats-editor__type-item--active .github-stats-editor__type-icon {
  color: #2563eb;
}

.github-stats-editor__type-label {
  font-size: 10px;
  font-weight: 500;
  color: #4b5563;
  text-align: center;
  position: relative;
  z-index: 1;
  transition: color 0.2s ease, font-weight 0.2s ease;
  line-height: 1.2;
}

.github-stats-editor__type-item:hover .github-stats-editor__type-label {
  color: #1f2937;
}

.github-stats-editor__type-item--active .github-stats-editor__type-label {
  color: #1d4ed8;
  font-weight: 600;
}

.github-stats-editor__config-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
}

.github-stats-editor__config-header {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s ease;
  user-select: none;
}

.github-stats-editor__config-header:hover {
  background: #f9fafb;
}

.github-stats-editor__config-title {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.github-stats-editor__config-toggle {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.github-stats-editor__config-content {
  padding: 0 12px 12px;
  border-top: 1px solid #f3f4f6;
}

.github-stats-editor__config-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.github-stats-editor__config-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.github-stats-editor__input,
.github-stats-editor__select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  color: #1f2937;
  transition: all 0.2s ease;
  width: 100%;
}

.github-stats-editor__input:focus,
.github-stats-editor__select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.github-stats-editor__select {
  cursor: pointer;
}

.github-stats-editor__help {
  font-size: 11px;
  color: #6b7280;
}
</style>

