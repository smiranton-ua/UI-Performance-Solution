import React from 'react';
import AutoSizer from "react-virtualized-auto-sizer";
import { Observer } from "mobx-react";
import { observable } from "mobx";
import { FixedSizeList as List } from "react-window";

import './App.css';

const Row = ({ index, style }) => {
  const el = index > waiting.length ? accepted[index - waiting.length] : (waiting[index] || waiting[index - 1]);
  const styleEl = { ...style };

  if (index === waiting.length + 1) {
    styleEl.borderTop = '3px solid black';
  }

  return (
    <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={styleEl}>
      {el.name}
    </div>
  );
};

function App({ accepted, waiting }) {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Observer>{
          () => {
            return (
              <List
                className="List"
                height={height}
                itemCount={accepted.length + waiting.length}
                itemSize={35}
                width={width}
              >
                {Row}
              </List>
            )
          }}
        </Observer>
      )}
    </AutoSizer>
  );
}

const accepted = observable(Array(50000).fill(null).map((el, i) => ({ id: i, name: `accepted ${i}` }))); // 5000
const waiting = observable(Array(50000).fill(null).map((el, i) => ({ id: i, name: `waiting ${i}` }))); // 5000

setInterval(() => {
  accepted.unshift({ id: accepted.length, name: `accepted ${accepted.length}` })
}, 300);

setInterval(() => {
  waiting.unshift({ id: waiting.length, name: `waiting ${waiting.length}` })
}, 300);

export default () => <App accepted={accepted} waiting={waiting} />;
