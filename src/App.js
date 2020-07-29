import React from 'react';
import AutoSizer from "react-virtualized-auto-sizer";
import { Observer, observer } from "mobx-react";
import { observable } from "mobx";
import { VariableSizeList as List } from "react-window";

import './App.css';

const APPLY_CHANGES_INTERVAL = 300;

const Row = observer(({ index, style, setSize }) => {
  const el = index > waiting.length ? accepted[index - waiting.length] : (waiting[index] || waiting[index - 1]);

  React.useEffect(() => {
    if (el.isOpen) {
      setSize(index, 140);
    } else {
      setSize(index, 40);
    }
  }, [el.isOpen]);

  const styleEl = {
    ...style,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column'
  };

  if (index === waiting.length + 1) {
    styleEl.borderTop = '3px solid black';
  }

  const handleToggle = () => {
    el.isOpen = !el.isOpen;
  };

  return (
    <div style={styleEl}>
      <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} onClick={handleToggle}>
        {el.name}
      </div>
      {el.isOpen && (
        <div className="ListItemContent">
          Content
        </div>
      )}
    </div>
  );
});

function App({ accepted, waiting }) {

  const listRef = React.useRef(null);
  const sizeMap = React.useRef({});

  const setSize = React.useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  }, []);

  const getSize = React.useCallback((index) => {
    const height = sizeMap.current && sizeMap.current[index];
    return height || 40;
  }, []);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Observer>{
          () => {
            return (
              <List
                ref={listRef}
                className="List"
                height={height}
                itemCount={accepted.length + waiting.length}
                itemSize={getSize}
                width={width}
              >
                {props => <Row {...props} setSize={setSize} />}
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
  accepted.unshift({ id: accepted.length, name: `accepted ${accepted.length}`, isOpen: false })
}, APPLY_CHANGES_INTERVAL);

setInterval(() => {
  waiting.unshift({ id: waiting.length, name: `waiting ${waiting.length}`, isOpen: false })
}, APPLY_CHANGES_INTERVAL);

export default () => <App accepted={accepted} waiting={waiting} />;
