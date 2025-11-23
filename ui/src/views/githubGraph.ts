import { isActive, mergeAttributes, Node, ToolboxItem, VueNodeViewRenderer } from "@halo-dev/richtext-editor";
import { h, markRaw } from "vue";
import MdiGithub from "~icons/mdi/github";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline";
import MdiArrowULeftBottom from "~icons/mdi/arrow-u-left-bottom";
import GithubGraphView from "./GithubGraphView.vue";
import { deleteNode } from "../utils/delete-node";
type Editor = any;
type EditorState = any;

declare module "@halo-dev/richtext-editor" {
  interface Commands {
    addGithubGraph: (attrs?: Partial<GithubGraphAttrs>) => any;
    setGithubGraphAttrs: (attrs: Partial<GithubGraphAttrs>) => any;
  }
}

export interface GithubGraphAttrs {
  theme?: string;
}

const GithubGraph = Node.create({
  name: "github-graph",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      theme: {
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
          if (element.classList.contains("xhhaocom-dataStatistics-v2-github-graph")) {
            return {
              theme: element.getAttribute("data-theme") || "minimal"
            };
          }
          return false;
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    const attrs = HTMLAttributes as Partial<GithubGraphAttrs> & Record<string, unknown>;
    const theme = (attrs.theme as string) || "minimal";

    return [
      "div",
      mergeAttributes({
        class: "xhhaocom-dataStatistics-v2-github-graph",
        "data-theme": theme
      })
    ];
  },

  addCommands() {
    return {
      ...(this.parent?.() || {}),
      addGithubGraph:
        (attrs?: Partial<GithubGraphAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              theme: attrs?.theme || "minimal"
            }
          });
        },
      setGithubGraphAttrs:
        (attrs: Partial<GithubGraphAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes(this.name, attrs);
        }
    } as any;
  },

  addNodeView() {
    return VueNodeViewRenderer(GithubGraphView as any);
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
          priority: 122536,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(MdiGithub),
            title: "插入 GitHub 活动图表",
            description: "展示 GitHub 贡献活动热力图",
            action: () => {
              editor.chain().focus().addGithubGraph().run();
            }
          }
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "githubGraphBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, GithubGraph.name);
          },
          items: [
            {
              priority: 122531,
              props: {
                icon: DeleteIcon,
                title: "删除",
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(GithubGraph.name, editor);
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

export default GithubGraph;

