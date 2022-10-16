import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { saveCartItems } from "./utkonos/cart";
import { extractData } from "./parsing";

export default function App() {
  const [visible, setVisible] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      rrToUtkAdapter.onCartItems(() => {
        setShowProgress(false)
      })
    }, 1000)
  }, [])

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.key == 'Escape' || ((ev.key == 'k' || ev.key == 'к') && ev.ctrlKey)) {
        setVisible(!visible)
      }
    }
    document.addEventListener('keyup', handler)
    return () => {
      document.removeEventListener('keyup', handler)
    }
  }, [visible])

  const save = useCallback(() => {
    if (editorRef.current == null) return

    const items = extractData(editorRef.current)

    if (items.length == 0) {
      console.log('no data extracted')
      return
    }

    console.log('adding items', items)
    setShowProgress(true)
    saveCartItems(items).then(() => {
      // @ts-ignore
      rrToUtkAdapter.modifyItemAtCart(items[0]) // fake cart modification to trigger reload
    })
  }, [])

  return (
    <React.StrictMode>
      {visible && (
        <Root>
          <TextArea
            contentEditable={true}
            ref={editorRef}
          />
          <Button onClick={save} disabled={showProgress}>
            {showProgress && "Сохраняем..."}
            {!showProgress && "Добавить"}
          </Button>
        </Root>
      )}
      <Badge onClick={() => setVisible(!visible)} />
    </React.StrictMode>
  )
}

const Root = styled.div`
  position: fixed;
  width: 400px;
  height: 80vh;
  top: calc(50% - 40vh);
  right: 0;
  background: #ffd9d9;
  z-index: 1000;
  border: 1px solid #555;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const TextArea = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 7px;
  background: white;
  overflow: scroll;
  
  padding: 5px 10px;
`;

const Button = styled.button`
  margin: 5px;
  border: 1px solid black;
  border-radius: 3px;
`

const Badge = styled.div`
  position: fixed;
  height: 73px;
  width: 36px;
  top: 0;
  right: 0;
  z-index: 1000;
  background: url(https://mayak.help/wp-content/themes/mayak/img/logo.png);
  transform: scale(0.8);
  -webkit-transform-origin-x: right;
  -webkit-transform-origin-y: top;
`;