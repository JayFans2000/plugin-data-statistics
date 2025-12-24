import { isActive, mergeAttributes, Node, ToolboxItem, VueNodeViewRenderer } from "@halo-dev/richtext-editor";
import { h, markRaw } from "vue";
import MdiChartBar from "~icons/mdi/chart-bar";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline";
import MdiArrowULeftBottom from "~icons/mdi/arrow-u-left-bottom";
import SiteStatisticsView from "./SiteStatisticsView.vue";
import { deleteNode } from "../utils/delete-node";
type Editor = any;
type EditorState = any;

declare module "@halo-dev/richtext-editor" {
  interface Commands {
    addSiteStatistics: (attrs?: Partial<SiteStatisticsAttrs>) => any;
    setSiteStatisticsAttrs: (attrs: Partial<SiteStatisticsAttrs>) => any;
  }
}

export interface SiteStatisticsAttrs {
  types: string[];
}

const SiteStatistics = Node.create({
  name: "site-statistics",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      types: {
        default: ["tags", "categories", "articles", "comments", "topArticles"]
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
          if (element.classList.contains("xhhaocom-chartboard")) {
            const dataTypes = element.getAttribute("data-types");
            const types = dataTypes ? dataTypes.split(",").filter(Boolean) : ["tags", "categories", "articles", "comments", "topArticles"];
            return { types };
          }
          return false;
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    const attrs = HTMLAttributes as Partial<SiteStatisticsAttrs> & Record<string, unknown>;
    const types = (attrs.types as string[]) || ["tags", "categories", "articles", "comments", "topArticles"];
    return [
      "div",
      mergeAttributes({
        class: "xhhaocom-chartboard",
        "data-types": types.join(",")
      })
    ];
  },

  addCommands() {
    return {
      ...(this.parent?.() || {}),
      addSiteStatistics:
        (attrs?: Partial<SiteStatisticsAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              types: attrs?.types || ["tags", "categories", "articles", "comments", "topArticles"]
            }
          });
        },
      setSiteStatisticsAttrs:
        (attrs: Partial<SiteStatisticsAttrs>) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes(this.name, attrs);
        }
    } as any;
  },

  addNodeView() {
    return VueNodeViewRenderer(SiteStatisticsView as any);
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
          priority: 122529,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(MdiChartBar),
            title: "插入网站统计图表",
            description: "展示标签、分类、文章、评论等站内统计图表",
            action: () => {
              editor.chain().focus().addSiteStatistics().run();
            }
          }
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "siteStatisticsBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, SiteStatistics.name);
          },
          items: [
            {
              priority: 122531,
              icon: DeleteIcon,
              title: "删除",
              action: () => {
                deleteNode(SiteStatistics.name, editor);
              }
            },
            {
              priority: 122532,
              icon: markRaw(MdiArrowULeftBottom),
              title: "换行",
              action: () => {
                editor.commands.insertContentAt(
                  editor.state.selection.$from.pos + 1,
                  [{ type: "paragraph", content: "" }],
                  { updateSelection: true }
                );
                editor.commands.focus(editor.state.selection.$from.pos, { scrollIntoView: true });
              }
            }
          ]
        };
      }
    };
  }
});

export default SiteStatistics;
