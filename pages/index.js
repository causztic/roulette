import Head from 'next/head'
import { useState, useEffect, useRef, Fragment } from 'react'
import { Slice } from '../components/Slice';
import styles from '../styles/Home.module.css'

export default function Home() {
  const roulette = useRef();
  const [currentPerson, setCurrentPerson] = useState('');
  const [people, setPeople] = useState(['test']);
  const [chosen, setChosen] = useState(['', 0]);

  const interval = (number) => (2 * Math.PI) / number;
  const slices = (number) => {
    const array = Array.from(Array(number).keys()).map((index) => {
      return [people[index], index * interval(number), (index + 1) * interval(number)]
    });

    return array;
  }

  const getWinner = () => {
    const winnerIndex = Math.floor(Math.random() * people.length)
    const [min, max] = slices(people.length)[winnerIndex]
    const randomWinnerAngle = (Math.random() * (max - min) + min) * 180 / Math.PI + 180
    const winner = people[winnerIndex]

    setChosen([winner, randomWinnerAngle])
  }

  const handleAddPerson = (event) => {
    if (event.key.length === 1) {
      setCurrentPerson(person => `${person}${event.key}`)
    }

    if (event.key === 'Enter') {
      setPeople(previousList => [...previousList, currentPerson]);
      setCurrentPerson('');
    }
  }

  const finishSpinning = () => {
    roulette.current.style.transform = `rotate(${chosen[1]}deg)`;
    roulette.current.classList.remove(styles.rotating);
  }

  useEffect(() => {
    if (chosen[0] !== '') {
      roulette.current.style.transform = `rotate(${360 * 10 + chosen[1]}deg)`;
      roulette.current.classList.add(styles.rotating);
    }
  }, [chosen])

  useEffect(() => {
    // TODO: remove event listener
    window.addEventListener('keydown', handleAddPerson)

    return () => window.removeEventListener('keydown', handleAddPerson)
  }, [handleAddPerson])

  return (
    <div className={styles.container}>
      <Head>
        <title>Roulette</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <svg height="550" width="500">
          <g transform="matrix(1 0 0 1 250 275)">
            <circle cx="0" cy="0" r="245" fill="white" />
            <g ref={roulette} onTransitionEnd={finishSpinning}>
              {slices(people.length).map((slice, index) =>
                <Slice key={index} person={slice} index={index} />
              )}
            </g>
          </g>
          <path d="M240 0 L250 30 L260 0 Z" fill="black" />          
        </svg>
        <button onClick={getWinner}>Spin</button>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}
