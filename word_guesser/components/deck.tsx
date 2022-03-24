import styles from "../styles/Home.module.css";
import Word from "./word";
import Words from "./word/words";
import Keyboard from "./keyboard";
import { useState } from "react";

/**
 * This component:
 * 1. Create a list of Words that user typed in
 * 2. Pass user input into the Word component
 * */



const Deck = ({ wordsProp }: any) => {
  return (
    <>
      <main className="flex justify-center">
        {/* Here we pass chars typed by a user */}
        <div className="flex flex-col">
          <Words key={'s'} />
        </div>

      </main>
    </>
  );
};

export default Deck;
