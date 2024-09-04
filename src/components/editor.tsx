import Quill, { QuillOptions } from 'quill';
import { PiTextAa } from 'react-icons/pi';
import "quill/dist/quill.snow.css";
import { MutableRefObject, useEffect, useLayoutEffect, useRef } from 'react';
import { Button } from './ui/button';
import { ImageIcon, Smile } from 'lucide-react';
import { MdSend } from 'react-icons/md';
import { Hint } from './hint';
import { Delta, Op } from 'quill/core';

type EditorValue = {
    image: File | null;
    body: string;
};

interface editorProps {
    onSubmit: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    disabled?: boolean;
    defaultValue?: Delta | Op[];
    innerRef?: MutableRefObject<Quill | null>;
    variant?: 'create' | 'update';
};

const Editor = ({
    onSubmit, onCancel, placeholder="Write something", defaultValue=[], innerRef, variant = 'create', disabled = false
}: editorProps) => {
    const continerRef = useRef<HTMLDivElement>(null);

    const submitRef= useRef(onSubmit);
    const placeholderRef= useRef(placeholder);
    const defaultValueRef= useRef(defaultValue);
    const quillRef = useRef<Quill | null>(null);
    const disabledRef= useRef(disabled);
    // const innerRef= useRef(innerRef);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if (!continerRef.current) return;

        const container = continerRef.current;
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

        const options : QuillOptions = {
            theme: 'snow',
            placeholder: placeholderRef.current,

        };
        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        // if {innerRef} {
        //     innerRef.current = quill;
        // };

        return () => {
            if (container){
                container.innerHTML = '';
            }
        };
    }, []); 

    return (
        <div className="flex flex-col">
            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
                <div ref= {continerRef} className='h-full ql-custom'/>
                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label="Hide Formatting">
                    <Button
                        disabled={false}
                        size="iconSm"
                        variant="ghost"
                        onClick={() => {}}
                    >
                        <PiTextAa className='size-4' />
                    </Button></Hint>
                    <Hint label="Add Emoji">
                    <Button
                        disabled={false}
                        size="iconSm"
                        variant="ghost"
                        onClick={() => {}}
                    >
                        <Smile className='size-4' />
                    </Button></Hint>
                    <Hint label="Add Image">
                    <Button
                        disabled={false}
                        size="iconSm"
                        variant="ghost"
                        onClick={() => {}}
                    >
                        <ImageIcon className='size-4' />
                    </Button></Hint>
                    <Button disabled={false}
                    className='ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white' size="iconSm">
                        <MdSend className='size-4'/>
                    </Button>
                </div>
            </div>
            <div className='p-2 flex justify-end text-[10px] text-muted-foreground'>
                <p>
                    <strong>Shift+Return</strong> to add a new line
                </p>
            </div>
        </div>
    )
};

export default Editor;