import { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import Head from 'next/head'
import useSound from 'use-sound';
import NoSleep from 'nosleep.js';


import * as api from '../api/poker'
import * as socket from '../api/socket'
import MenuSide from '../components/menuSide'
import Game from '../components/game'
import Setting from '../components/setting'
import { transformPosition } from '../utils'
import UserModal from '../components/userModal'
import AddModal from '../components/addModal'
import Loading from '../components/loading'
import Chat from '../components/chat';


export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  try {
    const res = await api.getInfo(token);

    return {
      props: { user: res.data, token },
    }
  } catch (err) {
    console.log(err)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }


}

export default function Home({ user, token }) {
  const [data, setData] = useState({});

  const [openMenuEdit, setMenuEdit] = useState(false)
  const [profileEdit, setProfileEdit] = useState();

  const [openAddModal, setAddModal] = useState(false);
  const [waitingPlayers, setWaitingPlayers] = useState([])
  const [addPosition, setAddPosition] = useState()
  const [notification, setNotification] = useState({})

  const [playChipSound] = useSound('/chip-sound.mp3');
  const [playCheckSound] = useSound('/check-sound.mp3');
  const [playTipSound] = useSound('/tip.mp3');
  const [playCashSound] = useSound('/cash.mp3');
  const [playShuffleSound] = useSound('/shuffle.mp3');
  let betSounds = [1, 2, 3, 4, 5, 6, 7].map(i => {
    const [playGGSound] = useSound(`/bet_${i}.mp3`);
    return playGGSound
  })
  const { addToast } = useToasts()

  useEffect(()=> {
    var noSleep = new NoSleep();
    document.addEventListener('click', function enableNoSleep() {
      document.removeEventListener('click', enableNoSleep, false);
      noSleep.enable();
    }, false);
  }, [])

  useEffect(() => {
    if (user) {
      socket.initiateSocket({ token });
    }
    socket.subscribeToGetData((err, roomInfo) => {
      if (err) {
        alert(err)
      }

      let newPosition = transformPosition(user.userName, roomInfo.position)
      let pos = Object.keys(newPosition).find(p => newPosition[p].user?.userName === user.userName);

      let normalizeData = {
        ...roomInfo,
        players: roomInfo.players.map((player) => ({
          ...player,
          isDealer: player.userName === roomInfo.dealer,
        })),
        user: {
          ...user,
          isDealer: user.userName === roomInfo.dealer,
          isThinking: !!Object.keys(roomInfo.position).find(p => roomInfo.position[p].isThinking
            && roomInfo.position[p].user?.userName === user.userName),
          position: newPosition && newPosition[pos],

        },
        position: newPosition
      }

      setData(normalizeData);
    })
    socket.subscribeToGetNotification((err, notificationData) => {
      setNotification({ ...notificationData })
    })
    socket.subscribeToDisconnect((err, disconnected ) => {
      if(disconnected){
        // reload
        window.location.href = '/'
      }
    })
    return () => {
      // socket.disconnectSocket();
    }
  }, [user]);

  useEffect(() => {
    switch (notification.action) {
      case 'BET':
        playChipSound();
        setTimeout(() => {
          betSounds[notification.indexSound % 7 || 0]();
        }, 500);
        break;
      case 'CALL':
        playChipSound();
        break;
      case 'CHECK':
        playCheckSound();
        break;
      case 'TIP':
        playTipSound();
        addToast(`${notification.userName} đã tip ${notification.tip} cho dealer`, { appearance: 'success' })
        break;
      case 'CASH-IN-OUT':
        playCashSound();
        addToast(`Số dư của ${notification.userName} đã thay đổi thành ${notification.accBalance}`, { appearance: 'success' })
        break;
      case 'SHUFFLE':
        playShuffleSound();
        break;
      default:
        break;
    }
  }, [notification?.id])

  const onEditClick = (userName) => {
    if (!data?.user?.isDealer) return;
    let userProfile = data.players.find(x => x.userName === userName);
    if (!userProfile) {
      return addToast('Không tìm thấy user', {
        appearance: 'error',
      })
    }
    setProfileEdit(userProfile);
    setMenuEdit(true);
  }

  const onAddClick = (position) => {
    if (!data?.user?.isDealer) {
      return addToast('Liên hệ/chờ dealer thêm vô', {
        appearance: 'info',
      })
    }
    let playingPlayers = Object.keys(data.position).map(pos => data.position[pos]?.user?.userName).filter(Boolean);
    let allPlayers = data.players.map(x => x.userName);
    let waitingPlayers = [allPlayers, playingPlayers].reduce((a, b) => a.filter(c => !b.includes(c)))
    setWaitingPlayers(waitingPlayers);
    setAddPosition(position)
    setAddModal(true);
  }

  const onAddPlayer = async (userName) => {

    try {
      await api.joinTable({ userName, position: addPosition });
    } catch (err) {
      return addToast('error join table', {
        appearance: 'error',
      })
    }
    setAddModal(false)
  }

  return (

    <div>
      <Head>
        <title>V-Poker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main>
        <MenuSide
          data={data}
          onEditClick={onEditClick}
        />

        <div className="flex w-screen h-screen">
          <div className="relative w-full h-full">
            <Game
              data={data}
              user={user}
              onEditClick={onEditClick}
              onAddClick={onAddClick}
            />
            {
              data?.user?.isDealer && <Setting
                data={data?.setting}
              />
            }
          </div>
          <Chat user={user} />
        </div>

        {
          !!profileEdit && (
            <UserModal
              isOpen={openMenuEdit}
              profile={profileEdit}
              onClose={() => setMenuEdit(false)}
              loading={false}
            />
          )
        }
        {
          !!openAddModal && (
            <AddModal
              isOpen={openAddModal}
              waitingPlayers={waitingPlayers}
              onClose={() => setAddModal(false)}
              loading={false}
              onChose={onAddPlayer}
            />
          )
        }

        {
          !data.players && <Loading />
        }
      </main>
    </div>

  )
}
