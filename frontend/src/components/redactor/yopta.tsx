import YooptaEditor, { createYooptaEditor, SlateElement, YooptaPlugin, } from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Image from '@yoopta/image';
import Video from '@yoopta/video';
import Link from '@yoopta/link';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import { useMemo, useRef } from 'react';
import { TypographyP } from '@/components/libraries/shadcn/TypographyP';
import { TypographyH1 } from '@/components/libraries/shadcn/TypographyH1';
import { TypographyH2 } from '@/components/libraries/shadcn/TypographyH2';
import { TypographyH3 } from '@/components/libraries/shadcn/TypographyH3';
import { TypographyBlockquote } from '@/components/libraries/shadcn/TypographyBlockquote';
import { TypographyLink } from '@/components/libraries/shadcn/TypographyLink';



import {
    AccordionList,
    AccordionListItem,
    AccordionListItemContent,
    AccordionListItemHeading,
} from '@/components/libraries/shadcn/Accordion';
import { Slate } from 'slate-react';

const getPlugins = (): readonly YooptaPlugin<Record<string, SlateElement>, Record<string, unknown>>[] => [
    Paragraph.extend({
        renders: {
            paragraph: TypographyP,
        },
    }),
    HeadingOne.extend({
        renders: {
            'heading-one': TypographyH1,
        },
    }),
    HeadingTwo.extend({
        renders: {
            'heading-two': TypographyH2,
        },
    }),
    HeadingThree.extend({
        renders: {
            'heading-three': TypographyH3,
        },
    }),
    Blockquote.extend({
        renders: {
            blockquote: TypographyBlockquote,
        },
    }),
    Link.extend({
        renders: {
            link: TypographyLink,
        },
    }),
    Accordion.extend({
        renders: {
            'accordion-list': AccordionList,
            'accordion-list-item': AccordionListItem,
            'accordion-list-item-content': AccordionListItemContent,
            'accordion-list-item-heading': AccordionListItemHeading,
        },
    }),
    NumberedList,
    BulletedList,
    TodoList,
    Divider.extend({
        elementProps: {
            divider: (props) => ({
                ...props,
                color: 'hsl(240 3.7% 15.9%)',
            }),
        },
    }),
    Image.extend({
        options: {
            async onUpload(file) {
                return {
                    src: "",
                    alt: 'not implemented yet',
                    sizes: {
                        width: 500,
                        height: 500,
                    },
                };
            },
        },
    }),
    Video.extend({
        options: {
            onUpload: async (file) => {
                return {
                    src: "",
                    alt: 'not implemented yet',
                    sizes: {
                        width: 500,
                        height: 500,
                    },
                };
            },
            onUploadPoster: async (file) => {
                return "";
            },
        },
    }),
    File.extend({
        options: {
            onUpload: async (file) => {
                return { src: "", format: "", name: "", size: "" };
            },
        },
    }),
].filter(Boolean) as readonly YooptaPlugin<Record<string, SlateElement>, Record<string, unknown>>[];





const TOOLS = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList,
    },
    Toolbar: {
        render: DefaultToolbarRender,
        tool: Toolbar,
    },
    LinkTool: {
        render: DefaultLinkToolRender,
        tool: LinkTool,
    },
};

const MARKS = [Bold, Italic, Underline, Strike, Highlight];

export const YooptaCn = () => {
    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);

    const plugins = useMemo(() => getPlugins(), []);

    return (
        <div
            className=" flex justify-center w-full"
            ref={selectionRef}
        >
            <YooptaEditor
                width={"100%"}
                editor={editor}
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                selectionBoxRoot={selectionRef}
                autoFocus
                placeholder='нажмите / для выбора оформления или пишите простым текстом'
            />
        </div>
    );
}

