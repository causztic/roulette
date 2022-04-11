import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { Slice } from '../components/Slice';
import { Person } from '../types/person'
import { colorFor } from '../components/colors';

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAddPerson = (event: KeyboardEvent) => {
    if (event.key.length === 1) {
      setCurrentPerson(person => `${person}${event.key}`)
    } else if (event.key === 'Enter') {
      setPeople(previousList => [...previousList, currentPerson])
      setCurrentPerson('')
    } else if (event.key === 'Backspace') {
      setCurrentPerson(person => person.slice(0, person.length - 1))
    }
  }

  const finishSpinning = () => {
    if (roulette.current) {
      roulette.current.style.transform = `rotate(${chosen?.maxAngle}deg)`;
      roulette.current.classList.remove(styles.rotating);
      setShowChosen(true)
    }
  }

  const reset = () => {
    setChosen(undefined);
    if (roulette.current) {
      roulette.current.style.transform = 'rotate(0deg)';
      roulette.current.classList.remove(styles.rotating);
    }

    setShowChosen(true)
    localStorage.clear();
    setPeople([]);
  }

  useEffect(() => {
    if (roulette.current && chosen !== undefined) {
      roulette.current.style.transform = `rotate(${360 * 10 + chosen.maxAngle}deg)`;
      roulette.current.classList.add(styles.rotating);
    }
  }, [chosen])

  useEffect(() => {
    const people = localStorage.getItem('people')
    if (people) {
      setPeople(people.split('|'))
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleAddPerson)

    return () => window.removeEventListener('keydown', handleAddPerson)
  }, [handleAddPerson])

  useEffect(() => {
    localStorage.setItem('people', people.join('|'))
  }, [people])

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
            <circle cx="0" cy="0" r="245" fill={colorFor(0)} />
            <g ref={roulette} onTransitionEnd={finishSpinning}>
              {slices(people.length).map((slice, index) =>
                <Slice key={index} person={slice} index={index} />
              )}
            </g>
          </g>
          <path d="M240 0 L250 30 L260 0 Z" fill="black" />
        </svg>
        {people.length > 1 && <button onClick={getWinner}>Spin</button>}
        {people.length > 0 && <button onClick={reset}>Reset</button>}
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
