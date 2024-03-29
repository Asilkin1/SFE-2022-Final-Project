// This is a game mode with guessing words with a validation
// done through Words API

import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';


type pageProps = {
    CHARS: number
}

const Mode1: NextPage<pageProps> = ({ CHARS }) => {

    // Keyboard layout can set character constraints
    const layout = {
        layout: {
            'default': [
                'q w e r t y u i o p',
                'a s d f g h j k l',
                'z x c v b n m'
            ],
            '3': ['w e r t l',
                'y u i o p',
                'a s g j k'],
            '4': [
                'a s d j k',
                'c v b n m',
                'i e r q l'],
            '5': ['q w y u i o p',
                'a k l',
                'z x c v b n m'],
            '6': ['q w e r t',
                'a s d h j k l',
                'z x v n m'],
            '7': ['q y u i o p',
                'a s d f g h',
                'z'],
            '8': ['q w e r t y u i o p',
                'a s d f g h j k l'],
            '9': [
                'a s d f g h j k l',
                'z x c v b n m'],
            '10': [
                'q w e u i o',
                'a s d h j k',
                'c b p z n m']
        }
    }


    const [virtualKeyValue, setVirtualKey] = useState([]);
    let [lettersLeft, setLeft] = useState(CHARS);

    // handle virtual keyboard 
    const onKeyPress = (button: any) => {

        setVirtualKey([...virtualKeyValue, button])
        console.log('typed : ', virtualKeyValue.join(''));

        if (lettersLeft === 1) {
            console.log('Word is finished');

            setLeft(CHARS);
        }

    }

    const onChange = (input: any) => {
        console.log(input);
        console.log('input changed: ', lettersLeft);

        // setLeft(Array.from(chars).fill('a').length)
        setLeft(lettersLeft -= 1);

        if (lettersLeft === 0) {
            setLeft(CHARS);
            isAWord(virtualKeyValue.join(''));
            setVirtualKey([]);
        }

    }


    // Render words here
    const [guessed, setGuessed] = useState([]);
    // Use to have a unique word
    const [uniqWords, setUnique] = useState(new Set());

    // Correct
    const [isCorrect, setCorrect] = useState(false);

    // Use to loop over the length and create input boxes
    const [arrayForInputFields, setArrayLength] = useState([]);


    // Re-render when one of the values in the dependency array has changed
    useEffect(() => {
        setArrayLength(new Array(CHARS).fill('a'));
        console.log('Guessed : ', guessed)


    }, [guessed.length, uniqWords.size, isCorrect, CHARS, lettersLeft, virtualKeyValue, guessed])



    // Check if typed in word is actually a word
    async function isAWord(word: string) {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const found = await res.json();

        // make sure if a key doesn't exist 
        // the program won't crash
        try {
            if (found[0]['word']) {
                console.log(found);
                console.log(found[0]['word']);
                uniqWords.add(found[0]['word']);
                setGuessed([...Array.from(uniqWords)])
                setCorrect(true);
            }
        }
        // Incorrect word case
        catch (e) {
            setCorrect(false);
            console.log('word is not found');
        }

    }

    function submitMultipleFields(e: any) {

        let word = ''
        e.preventDefault();

        for (let i = 0; i < e.target.length; i++) {
            word += e.target[i].value;
        };

        // Call WORD API
        isAWord(word);

        // Erase all fields
        for (let i = 0; i < e.target.length; i++) {
            e.target[i].value = '';
        };

        // Focus on the first letter
        e.target[0].focus();
        setVirtualKey([]);

    }


    return (
        <>
            <div className='flex flex-col flex-wrap h-full  text-orange-200 text-2xl  font-mono font-bold'>
                <div className="text-center font-thin">

                    <h1 className="text-center text-orange-200 p-2 text-6xl font-mono font-bold underline decoration-dashed">All you can type in game mode</h1>
                    <p className="">Correct:</p>
                    <p className='font-mono tracking-widest py-2 text-6xl'>🏆 {guessed.length}</p>
                    <div className="flex flex-1">
                        <div className={`flex  w-${CHARS * 3} p-2 gap-1 justify-center `}>

                            {
                                guessed.map((w, i) => (

                                    <div key={i + CHARS} className='flex flex-1 p-2 gap-0.5'>
                                        {
                                            [...w].map((char) => (

                                                <input key={i + 'sss'}

                                                    value={char}
                                                    disabled
                                                    className={`flex w-10 h-10 border-2 border-green-200 bg-green-100  text-center rounded-lg drop-shadow-md opacity-75 font-bold text-xl text-orange-800 `} />
                                            ))
                                        }

                                    </div>

                                ))}


                        </div>
                    </div>

                    <p>Characters to type in {CHARS}</p>


                    {virtualKeyValue.length !== 0 ? (
                        <form className="flex justify-center" onSubmit={(e) => { submitMultipleFields(e) }}>

                            {virtualKeyValue && virtualKeyValue.map((el, index) => (

                                <input key={index}
                                    className={`p-2 m-2 w-16 h-16 text-3xl justify-center rounded-md text-center font-thick outline-none focus:bg-orange-200 focus:decoration-red-500 uppercase drop-shadow-md focus:underline caret-transparent cursor-pointer`}
                                    required
                                    value={el}
                                    maxLength={1}
                                    disabled={true}
                                />
                            ))}
                            <input type="submit" className="hidden" />

                        </form>
                    ) : (
                        arrayForInputFields && arrayForInputFields.map((el, index) => (

                            <input key={index}
                                className={`p-2 m-2 w-16 h-16 text-3xl justify-center rounded-md text-center font-thick outline-none focus:bg-orange-200 focus:decoration-red-500 uppercase drop-shadow-md focus:underline caret-transparent cursor-pointer`}
                                value={'?'}
                                disabled={true}
                            />
                        ))
                    )}


                    <div className="flex p-4 m-auto max-w-md items-center text-slate-700 text-3xl">
                        <Keyboard
                            onKeyPress={onKeyPress}
                            onChange={onChange}
                            layout={layout.layout}

                            layoutName={CHARS.toString()}
                            physicalKeyboardHighlight={true}
                            physicalKeyboardHighlightTextColor={'white'}
                            physicalKeyboardHighlightBgColor={"red"}
                            onInit={(keyboard) => console.log("simple-keyboard initialized", keyboard)}
                        />
                    </div>


                </div>




            </div>




        </>
    );
};


// Get the number of chars ready, before the react component is rendered
export async function getStaticProps() {

    // Get random number of chars
    function getRandomArbitrary(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the 
    }


    const CHARS = getRandomArbitrary(3, 10);


    return {
        props: {
            CHARS
        }
    }
}



export default Mode1;
