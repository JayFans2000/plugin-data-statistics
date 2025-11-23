import { isActive, mergeAttributes, Node, ToolboxItem, VueNodeViewRenderer } from "@halo-dev/richtext-editor";
import { h, markRaw } from "vue";
import MdiGithub from "~icons/mdi/github";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline";
import MdiArrowULeftBottom from "~icons/mdi/arrow-u-left-bottom";
import GithubPinView from "./GithubPinView.vue";
import { deleteNode } from "../utils/delete-node";
type Editor = any;
type EditorState = any;

declare module "@halo-dev/richtext-editor" {
  interface Commands {
    addGithubPin: (attrs?: Partial<GithubPinAttrs>) => any;
    setGithubPinAttrs: (attrs: Partial<GithubPinAttrs>) => any;
  }
}

export interface GithubPinAttrs {
  repo?: string;
}

const GithubPin = Node.create({
  name: "github-pin",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      repo: {
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
          if (element.classList.contains("xhhaocom-dataStatistics-v2-github-pin")) {
            const repo = element.getAttribute("data-repo") || "";
            return { repo };
          }
          return false;
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    const attrs = HTMLAttributes as Partial<GithubPinAttrs> & Record<string, unknown>;
    const repo = (attrs.repo as string) || "";
    return [
      "div",
      mergeAttributes({
        class: "xhhaocom-dataStatistics-v2-github-pin",
        "data-repo": repo
      })
    ];
  },

  addCommands() {
    return {
      ...(this.parent?.() || {}),
      addGithubPin:
        (attrs?: Partial<GithubPinAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              repo: attrs?.repo || ""
            }
          });
        },
      setGithubPinAttrs:
        (attrs: Partial<GithubPinAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes(this.name, attrs);
        }
    } as any;
  },

  addNodeView() {
    return VueNodeViewRenderer(GithubPinView as any);
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
          priority: 122533,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(MdiGithub),
            title: "插入 GitHub 仓库展示",
            description: "展示 GitHub 仓库的统计信息",
            action: () => {
              editor.chain().focus().addGithubPin().run();
            }
          }
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "githubPinBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, GithubPin.name);
          },
          items: [
            {
              priority: 122531,
              props: {
                icon: DeleteIcon,
                title: "删除",
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(GithubPin.name, editor);
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

export default GithubPin;

