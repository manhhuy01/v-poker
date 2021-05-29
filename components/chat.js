import { useState, useEffect, useRef } from 'react'
import * as socket from '../api/socket'



const ChatElement = ({ userName, message, isYour }) => {
  return (
    <div className={`w-full flex mb-2 ${isYour ? 'pl-12' : 'pr-12'}`}>
      <div className="w-full flex items-center">
        <div className="w-full flex flex-col">
          {!!userName && <div className="font-bold">{userName}</div>}
          <div className={`${isYour ? 'bg-blue-300' : 'bg-blue-100'} p-1 rounded-md w-auto pl-4 pr-4`}>{message}</div>
        </div>
      </div>
    </div>
  )
}


export default function chat({ user }) {
  const inputRef = useRef(null);
  const [isOpen, setOpen] = useState(false)
  const [data, setData] = useState({ count: 0, messages: [] })
  const [newNumber, setNewNumber] = useState(0)
  const [readNumber, setReadNumber] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      socket.subscribeToGetMessage((err, dataAPI) => {
        if (err) {
          alert(err)
        }

        setData({
          ...dataAPI,
          messages: dataAPI.messages.reduce((agg, chat, i) => {
            if (i && chat.userName === agg[i - 1].userName) {
              agg.push({ ...chat, owner: chat.userName === user.userName, hiddenUserName: true })
            } else {
              agg.push({ ...chat, owner: chat.userName === user.userName })
            }
            return agg;
          }, [])
        });
        setTimeout(() => {
          var objDiv = document.getElementById("chat-body");
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 100);
      })
    }, 1000);

  }, [user])

  useEffect(() => {
    let newReadNumber = readNumber;
    if (isOpen) {
      newReadNumber = data.count;
      setReadNumber(newReadNumber);
    }
    setNewNumber(data?.count - newReadNumber);
  }, [data?.count])

  useEffect(() => {
    if(isOpen){
      setReadNumber(data.count)
    }
  }, [isOpen])

  useEffect(() => {
    setNewNumber(data?.count - readNumber);
  }, [readNumber])

  const send = (e) => {
    e.preventDefault();
    let message = inputRef.current.value.trim();
    if (message) {
      socket.sendMessage({ message, userName: user.userName })
      setData({
        ...data,
        messages: [
          ...data.messages,
          {
            message,
            owner: true,
          }
        ]
      })
    }

    inputRef.current.value = '';
    setTimeout(() => {
      var objDiv = document.getElementById("chat-body");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 100);

  }
  const open = () => {
    var objDiv = document.getElementById("chat-body");
    objDiv.scrollTop = objDiv.scrollHeight;
    setOpen(true)
    setReadNumber(data.count)
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  }

  const close = () => {
    setTimeout(() => {
      inputRef.current.blur();
    }, 0);
    setOpen(false)
  }

  return (
    <>
      <span className="absolute bottom-1/6 right-12 ">
        <button onClick={open} className="bg-white rounded p-2 ">
          {`Chat ${newNumber ? `(${newNumber})` : ''}`}
        </button>
        {
          !!newNumber && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )
        }

      </span>

      <div className={`${isOpen ? '' : 'invisible'} absolute w-full h-full top-0 left-0 z-20 flex justify-center`}>
        <div onClick={close} className="absolute w-full h-full top-0 left-0 bg-white bg-opacity-50" />
        <div className="absolute w-full h-screen flex flex-col md:w-1/2 md:m-auto">
          <div className="w-full h-12 bg-green-800 flex justify-between items-center pl-2 text-white">
            <span>Chat</span>
            <button onClick={close} className="p-4 focus:outline-none">✖</button>
          </div>
          <div id='chat-body' className="h-full bg-white p-4 overflow-auto">
            {
              data.messages && data.messages.map((chat, i) => (
                <ChatElement
                  key={i}
                  userName={(chat.owner || chat.hiddenUserName) ? '' : chat.userName}
                  isYour={chat.owner}
                  message={chat.message}
                />
              ))
            }
          </div>
          <form className="w-full flex h-16 p-2 bg-gray-800" onSubmit={send}>
            <input ref={inputRef} className="pl-2 w-full h-full border border-gray-800" type="input" />
            <button onClick={send} className="focus:outline-none bg-white w-max h-full bg-green-600 text-white pl-2 pr-2 ml-2" type="submit">Send</button>
          </form>

        </div>
      </div>
    </>
  )
}