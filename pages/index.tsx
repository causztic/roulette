import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { Slice } from '../components/Slice';
import { Person } from '../types/person'

const Home: NextPage = () => {
  const roulette = useRef<SVGGElement>(null);
  const [currentPerson, setCurrentPerson] = useState('');
  const [people, setPeople] = useState<string[]>([]);
  const [chosen, setChosen] = useState<Person>();
  const [showChosen, setShowChosen] = useState<boolean>(false);

  const interval = (number: number) => (2 * Math.PI) / number;
  const slices = (number: number): Person[] => {
    const array = Array.from(Array(number).keys()).map((index) => {
      return {
        name: people[index],
        minAngle: index * interval(number),
        maxAngle: (index + 1) * interval(number)
      }
    });

    return array;
  }

  const getWinner = () => {
    setShowChosen(false)
    const winnerIndex = Math.floor(Math.random() * people.length)
    const { name, minAngle: min, maxAngle: max } = slices(people.length)[winnerIndex]
    const angle = (Math.random() * (max - min) + min) * 180 / Math.PI + 180
    const winner = { name, minAngle: angle, maxAngle: angle }

    setChosen(winner)
  }

  const handleAddPerson = (event: KeyboardEvent) => {
    if (event.key.length === 1) {
      setCurrentPerson(person => `${person}${event.key}`)
    }

    if (event.key === 'Enter') {
      setPeople(previousList => [...previousList, currentPerson]);
      setCurrentPerson('');
    }
  }

  const finishSpinning = () => {
    if (roulette.current) {
      roulette.current.style.transform = `rotate(${chosen?.maxAngle}deg)`;
      roulette.current.classList.remove(styles.rotating);
      setShowChosen(true)
    }
  }

  useEffect(() => {
    if (roulette.current && chosen !== undefined) {
      roulette.current.style.transform = `rotate(${360 * 10 + chosen.maxAngle}deg)`;
      roulette.current.classList.add(styles.rotating);
    }
  }, [chosen])

  useEffect(() => {
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
        <h1 style={{ height: '100px' }}>{showChosen && chosen?.name}</h1>
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

export default Home
