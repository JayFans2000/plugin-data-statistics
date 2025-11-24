import { isActive, mergeAttributes, Node, ToolboxItem, VueNodeViewRenderer } from "@halo-dev/richtext-editor";
import { h, markRaw } from "vue";
import MdiGithub from "~icons/mdi/github";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline";
import MdiArrowULeftBottom from "~icons/mdi/arrow-u-left-bottom";
import GithubStatisticsView from "./GithubStatisticsView.vue";
import { deleteNode } from "../utils/delete-node";
type Editor = any;
type EditorState = any;

declare module "@halo-dev/richtext-editor" {
  interface Commands {
    addGithubStatistics: (attrs?: Partial<GithubStatisticsAttrs>) => any;
    setGithubStatisticsAttrs: (attrs: Partial<GithubStatisticsAttrs>) => any;
  }
}

export interface GithubStatisticsAttrs {
  types: string[];
  statsLocale?: string;
  statsShowIcons?: string;
  statsTheme?: string;
  pinRepo?: string;
  topLangsLayout?: string;
  topLangsHideProgress?: string;
  topLangsStatsFormat?: string;
  graphTheme?: string;
}

const GithubStatistics = Node.create({
  name: "github-statistics",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      types: {
        default: ["graph"]
      },
      statsLocale: {
        default: ""
      },
      statsShowIcons: {
        default: ""
      },
      statsTheme: {
        default: ""
      },
      pinRepo: {
        default: ""
      },
      topLangsLayout: {
        default: ""
      },
      topLangsHideProgress: {
        default: ""
      },
      topLangsStatsFormat: {
        default: ""
      },
      graphTheme: {
        default: "minimal"
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "div",
        getAttrs: (element: string | HTMLElement) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }
          // 检查是否是 GitHub 统计容器
          if (element.classList.contains("github-statistics-container")) {
            const dataTypes = element.getAttribute("data-types");
            const types = dataTypes ? dataTypes.split(",").filter(Boolean) : ["graph"];
            return {
              types,
              statsLocale: element.getAttribute("data-stats-locale") || "",
              statsShowIcons: element.getAttribute("data-stats-show-icons") || "",
              statsTheme: element.getAttribute("data-stats-theme") || "",
              pinRepo: element.getAttribute("data-pin-repo") || "",
              topLangsLayout: element.getAttribute("data-top-langs-layout") || "",
              topLangsHideProgress: element.getAttribute("data-top-langs-hide-progress") || "",
              topLangsStatsFormat: element.getAttribute("data-top-langs-stats-format") || "",
              graphTheme: element.getAttribute("data-graph-theme") || "minimal"
            };
          }
          // 兼容旧格式：单个 GitHub 组件
          const isGithubStats = element.classList.contains("xhhaocom-dataStatistics-v2-github-stats");
          const isGithubPin = element.classList.contains("xhhaocom-dataStatistics-v2-github-pin");
          const isGithubTopLangs = element.classList.contains("xhhaocom-dataStatistics-v2-github-top-langs");
          const isGithubGraph = element.classList.contains("xhhaocom-dataStatistics-v2-github-graph");

          if (isGithubStats || isGithubPin || isGithubTopLangs || isGithubGraph) {
            const types: string[] = [];
            if (isGithubStats) types.push("stats");
            if (isGithubPin) types.push("pin");
            if (isGithubTopLangs) types.push("top-langs");
            if (isGithubGraph) types.push("graph");

            return {
              types: types.length > 0 ? types : ["stats"],
              statsLocale: element.getAttribute("data-locale") || "",
              statsShowIcons: element.getAttribute("data-show-icons") || "",
              statsTheme: element.getAttribute("data-theme") || "",
              pinRepo: element.getAttribute("data-repo") || "",
              topLangsLayout: element.getAttribute("data-layout") || "",
              topLangsHideProgress: element.getAttribute("data-hide-progress") || "",
              topLangsStatsFormat: element.getAttribute("data-stats-format") || "",
              graphTheme: element.getAttribute("data-theme") || "minimal"
            };
          }
          return false;
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    const attrs = HTMLAttributes as Partial<GithubStatisticsAttrs> & Record<string, unknown>;
    const types = (attrs.types as string[]) || ["graph"];
    const typeOrder = ['graph', 'stats', 'pin', 'top-langs'];
    const sortedTypes = types.sort((a, b) => {
      const indexA = typeOrder.indexOf(a);
      const indexB = typeOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const dataAttrs: Record<string, string> = {
      class: "github-statistics-container",
      "data-types": sortedTypes.join(",")
    };

    if (attrs.statsLocale) dataAttrs["data-stats-locale"] = attrs.statsLocale as string;
    if (attrs.statsShowIcons) dataAttrs["data-stats-show-icons"] = attrs.statsShowIcons as string;
    if (attrs.statsTheme) dataAttrs["data-stats-theme"] = attrs.statsTheme as string;
    if (attrs.pinRepo) dataAttrs["data-pin-repo"] = attrs.pinRepo as string;
    if (attrs.topLangsLayout) dataAttrs["data-top-langs-layout"] = attrs.topLangsLayout as string;
    if (attrs.topLangsHideProgress) dataAttrs["data-top-langs-hide-progress"] = attrs.topLangsHideProgress as string;
    if (attrs.topLangsStatsFormat) dataAttrs["data-top-langs-stats-format"] = attrs.topLangsStatsFormat as string;
    if (attrs.graphTheme) dataAttrs["data-graph-theme"] = attrs.graphTheme as string;

    return ["div", mergeAttributes(dataAttrs)];
  },

  addCommands() {
    return {
      ...(this.parent?.() || {}),
      addGithubStatistics:
        (attrs?: Partial<GithubStatisticsAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              types: attrs?.types || ["graph"],
              statsLocale: attrs?.statsLocale || "",
              statsShowIcons: attrs?.statsShowIcons || "",
              statsTheme: attrs?.statsTheme || "",
              pinRepo: attrs?.pinRepo || "",
              topLangsLayout: attrs?.topLangsLayout || "",
              topLangsHideProgress: attrs?.topLangsHideProgress || "",
              topLangsStatsFormat: attrs?.topLangsStatsFormat || "",
              graphTheme: attrs?.graphTheme || "minimal"
            }
          });
        },
      setGithubStatisticsAttrs:
        (attrs: Partial<GithubStatisticsAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes(this.name, attrs);
        }
    } as any;
  },

  addNodeView() {
    return VueNodeViewRenderer(GithubStatisticsView as any);
  },

  addOptions() {
    const DeleteIcon = markRaw({
      setup() {
        return () =>
          h(MdiDeleteForeverOutline as any, {
            style: {
              color: "#ef4444"
            }
          });
      }
    });

    return {
      ...this.parent?.(),
      getToolboxItems({ editor }: { editor: Editor }) {
        return {
          priority: 122534,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(MdiGithub),
            title: "插入 GitHub 统计",
            description: "展示 GitHub 用户统计、仓库统计、语言统计和贡献图",
            action: () => {
              editor.chain().focus().addGithubStatistics().run();
            }
          }
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "githubStatisticsBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, GithubStatistics.name);
          },
          items: [
            {
              priority: 122531,
              props: {
                icon: DeleteIcon,
                title: "删除",
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(GithubStatistics.name, editor);
                }
              }
            },
            {
              priority: 122532,
              props: {
                icon: markRaw(MdiArrowULeftBottom),
                title: "换行",
                action: ({ editor }: { editor: Editor }) => {
                  editor.commands.insertContentAt(
                    editor.state.selection.$from.pos + 1,
                    [{ type: "paragraph", content: "" }],
                    { updateSelection: true }
                  );
                  editor.commands.focus(editor.state.selection.$from.pos, { scrollIntoView: true });
                }
              }
            }
          ]
        };
      },
      getDraggable() {
        return {
          getRenderContainer({ dom }: { dom: HTMLElement }) {
            let container = dom;
            while (container && !container.hasAttribute("data-node-view-wrapper")) {
              container = container.parentElement as HTMLElement;
            }
            return { el: container };
          },
          allowPropagationDownward: true
        };
      }
    };
  }
});

export default GithubStatistics;

