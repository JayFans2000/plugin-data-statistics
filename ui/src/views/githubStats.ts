import { isActive, mergeAttributes, Node, ToolboxItem, VueNodeViewRenderer } from "@halo-dev/richtext-editor";
import { h, markRaw } from "vue";
import MdiGithub from "~icons/mdi/github";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline";
import MdiArrowULeftBottom from "~icons/mdi/arrow-u-left-bottom";
import GithubStatsView from "./GithubStatsView.vue";
import { deleteNode } from "../utils/delete-node";
type Editor = any;
type EditorState = any;

declare module "@halo-dev/richtext-editor" {
  interface Commands {
    addGithubStats: (attrs?: Partial<GithubStatsAttrs>) => any;
    setGithubStatsAttrs: (attrs: Partial<GithubStatsAttrs>) => any;
  }
}

export interface GithubStatsAttrs {
  locale?: string;
  showIcons?: string;
  theme?: string;
}

const GithubStats = Node.create({
  name: "github-stats",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      locale: {
        default: "cn"
      },
      showIcons: {
        default: ""
      },
      theme: {
        default: ""
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
          if (element.classList.contains("xhhaocom-dataStatistics-v2-github-stats")) {
            return {
              locale: element.getAttribute("data-locale") || "",
              showIcons: element.getAttribute("data-show-icons") || "",
              theme: element.getAttribute("data-theme") || ""
            };
          }
          return false;
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    const attrs = HTMLAttributes as Partial<GithubStatsAttrs> & Record<string, unknown>;
    const locale = (attrs.locale as string) || "";
    const showIcons = (attrs.showIcons as string) || "";
    const theme = (attrs.theme as string) || "";
    
    const dataAttrs: Record<string, string> = {};
    if (locale) dataAttrs["data-locale"] = locale;
    if (showIcons) dataAttrs["data-show-icons"] = showIcons;
    if (theme) dataAttrs["data-theme"] = theme;

    return [
      "div",
      mergeAttributes({
        class: "xhhaocom-dataStatistics-v2-github-stats",
        ...dataAttrs
      })
    ];
  },

  addCommands() {
    return {
      ...(this.parent?.() || {}),
      addGithubStats:
        (attrs?: Partial<GithubStatsAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              locale: attrs?.locale || "",
              showIcons: attrs?.showIcons || "",
              theme: attrs?.theme || ""
            }
          });
        },
      setGithubStatsAttrs:
        (attrs: Partial<GithubStatsAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes(this.name, attrs);
        }
    } as any;
  },

  addNodeView() {
    return VueNodeViewRenderer(GithubStatsView as any);
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
            title: "插入 GitHub 统计卡",
            description: "展示 GitHub 账户统计信息",
            action: () => {
              editor.chain().focus().addGithubStats().run();
            }
          }
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "githubStatsBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, GithubStats.name);
          },
          items: [
            {
              priority: 122531,
              props: {
                icon: DeleteIcon,
                title: "删除",
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(GithubStats.name, editor);
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

export default GithubStats;

