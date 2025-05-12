import YooptaEditor, { createYooptaEditor, SlateElement, YooptaContentValue, YooptaOnChangeOptions, YooptaPlugin } from '@yoopta/editor';

import Accordion from '@yoopta/accordion';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Blockquote from '@yoopta/blockquote';
import Divider from '@yoopta/divider';
import File from '@yoopta/file';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';
import { Bold, Highlight, Italic, Strike, Underline } from '@yoopta/marks';
import Paragraph from '@yoopta/paragraph';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import Video from '@yoopta/video';

import { TypographyBlockquote } from '@/components/libraries/shadcn/TypographyBlockquote';
import { TypographyH1 } from '@/components/libraries/shadcn/TypographyH1';
import { TypographyH2 } from '@/components/libraries/shadcn/TypographyH2';
import { TypographyH3 } from '@/components/libraries/shadcn/TypographyH3';
import { TypographyLink } from '@/components/libraries/shadcn/TypographyLink';
import { TypographyP } from '@/components/libraries/shadcn/TypographyP';
import { useMemo, useRef } from 'react';


import { UploadFile } from '@/api/upload';
import {
    AccordionList,
    AccordionListItem,
    AccordionListItemContent,
    AccordionListItemHeading,
} from '@/components/libraries/shadcn/Accordion';

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
                UploadFile(file)
                return {
                    src: `/api/files/?filename=${file.name}`,
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
                UploadFile(file)
                return {
                    src: `/api/files/?filename=${file.name}`,
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
            async onUpload(file) {
                UploadFile(file)
                return {
                    src: `/api/files/?filename=${file.name}`,
                    alt: 'not implemented yet',
                    sizes: {
                        width: 500,
                        height: 500,
                    },
                };
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


interface YooptaCnProps {
    value: object
    setValue: React.Dispatch<React.SetStateAction<object>>
}

export const YooptaCn = ({ value, setValue }: YooptaCnProps) => {
    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);


    const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
        setValue(value);
        console.log(value)
    };

    const plugins = useMemo(() => getPlugins(), []);

    return (
        <div
            className="mt-4 mx-1 flex justify-center w-full"
            ref={selectionRef}
        >
            <YooptaEditor
                value={value as YooptaContentValue}
                width={"100%"}
                editor={editor}
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                onChange={onChange}
                selectionBoxRoot={selectionRef}
                autoFocus
                placeholder='нажмите / для выбора оформления или пишите простым текстом'
            />
        </div>
    );
}


export const ReadOnlyYoopta = ({ value, className }: { value: Object, className: string }) => {
    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);


    const plugins = useMemo(() => getPlugins(), []);

    return (
        <div
            className={className}
            ref={selectionRef}
        >
            <YooptaEditor
                width="full"
                editor={editor}
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                selectionBoxRoot={selectionRef}
                value={value as YooptaContentValue}
                autoFocus
                readOnly
            />
        </div>
    );
}

