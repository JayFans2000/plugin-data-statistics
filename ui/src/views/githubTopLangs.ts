import { isActive, mergeAttributes, Node, ToolboxItem, VueNodeViewRenderer } from "@halo-dev/richtext-editor";
import { h, markRaw } from "vue";
import MdiGithub from "~icons/mdi/github";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline";
import MdiArrowULeftBottom from "~icons/mdi/arrow-u-left-bottom";
import GithubTopLangsView from "./GithubTopLangsView.vue";
import { deleteNode } from "../utils/delete-node";
type Editor = any;
type EditorState = any;

declare module "@halo-dev/richtext-editor" {
  interface Commands {
    addGithubTopLangs: (attrs?: Partial<GithubTopLangsAttrs>) => any;
    setGithubTopLangsAttrs: (attrs: Partial<GithubTopLangsAttrs>) => any;
  }
}

export interface GithubTopLangsAttrs {
  layout?: string;
  hideProgress?: string;
  statsFormat?: string;
}

const GithubTopLangs = Node.create({
  name: "github-top-langs",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      layout: {
        default: ""
      },
      hideProgress: {
        default: ""
      },
      statsFormat: {
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
          if (element.classList.contains("xhhaocom-dataStatistics-v2-github-top-langs")) {
            return {
              layout: element.getAttribute("data-layout") || "",
              hideProgress: element.getAttribute("data-hide-progress") || "",
              statsFormat: element.getAttribute("data-stats-format") || ""
            };
          }
          return false;
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    const attrs = HTMLAttributes as Partial<GithubTopLangsAttrs> & Record<string, unknown>;
    const layout = (attrs.layout as string) || "";
    const hideProgress = (attrs.hideProgress as string) || "";
    const statsFormat = (attrs.statsFormat as string) || "";
    
    const dataAttrs: Record<string, string> = {};
    if (layout) dataAttrs["data-layout"] = layout;
    if (hideProgress) dataAttrs["data-hide-progress"] = hideProgress;
    if (statsFormat) dataAttrs["data-stats-format"] = statsFormat;

    return [
      "div",
      mergeAttributes({
        class: "xhhaocom-dataStatistics-v2-github-top-langs",
        ...dataAttrs
      })
    ];
  },

  addCommands() {
    return {
      ...(this.parent?.() || {}),
      addGithubTopLangs:
        (attrs?: Partial<GithubTopLangsAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              layout: attrs?.layout || "",
              hideProgress: attrs?.hideProgress || "",
              statsFormat: attrs?.statsFormat || ""
            }
          });
        },
      setGithubTopLangsAttrs:
        (attrs: Partial<GithubTopLangsAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes(this.name, attrs);
        }
    } as any;
  },

  addNodeView() {
    return VueNodeViewRenderer(GithubTopLangsView as any);
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
          priority: 122535,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(MdiGithub),
            title: "插入 GitHub 语言展示卡",
            description: "展示 GitHub 最常用的编程语言",
            action: () => {
              editor.chain().focus().addGithubTopLangs().run();
            }
          }
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "githubTopLangsBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, GithubTopLangs.name);
          },
          items: [
            {
              priority: 122531,
              props: {
                icon: DeleteIcon,
                title: "删除",
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(GithubTopLangs.name, editor);
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

export default GithubTopLangs;

