import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Slice } from '../components/Slice';
import { Person } from '../types/person'
import { colorFor } from '../components/colors';

const Home: NextPage = () => {
  const roulette = useRef<SVGGElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [currentPerson, setCurrentPerson] = useState('');
  const [people, setPeople] = useState<string[]>([]);
  const [chosen, setChosen] = useState<Person>();
  const [showChosen, setShowChosen] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);

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

  const startSpinning = () => {
    setSpinning(true)
    setShowChosen(false)
    const winnerIndex = Math.floor(Math.random() * people.length)
    const { name, minAngle: min, maxAngle: max } = slices(people.length)[winnerIndex]
    const angle = (Math.random() * (max - min) + min) * 180 / Math.PI + 180
    const winner = { name, minAngle: angle, maxAngle: angle }

    setChosen(winner)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && currentPerson.length > 1) {
      setPeople(previousList => [...previousList, currentPerson])
      setCurrentPerson('')
    }
  }

  const finishSpinning = () => {
    setSpinning(false)
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
    input?.current?.focus();
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

    input?.current?.focus();
  }, [])

  useEffect(() => {
    localStorage.setItem('people', people.join('|'))
  }, [people])

  return (
    <>
      <Head>
        <title>Roulette</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center">
        <h1 className="h-24 text-8xl dark:text-white">{showChosen && chosen?.name}</h1>
        <svg height="550" width="500">
          <g transform="matrix(1 0 0 1 250 275)">
            <circle cx="0" cy="0" r="245" fill={colorFor(0)} />
            <g ref={roulette} onTransitionEnd={finishSpinning}>
              {slices(people.length).map((slice, index) =>
                <Slice key={index} person={slice} index={index} />
              )}
            </g>
          </g>
          <path d="M240 0 L250 30 L260 0 Z" fill="darkgray" stroke="black" />
        </svg>
        <div className="w-64">
          <input disabled={spinning} ref={input} className="w-full mb-2 p-2 rounded border-2 border-gray-400" type="text" autoFocus={true} value={currentPerson} onChange={(e) => setCurrentPerson(e.target.value)} onKeyDown={onKeyDown}></input>
          <button onClick={startSpinning} disabled={people.length < 2} className="disabled:bg-gray-100 disabled:text-gray-400 rounded bg-sky-100 hover:bg-sky-300 w-full p-2 text-4xl mb-2">Spin</button>
          <button onClick={reset} disabled={people.length === 0} className="disabled:bg-gray-100 disabled:text-gray-400 rounded bg-red-100 hover:bg-red-300 w-full">Reset</button>
        </div>
      </main>
    </>
  )
}

export default Home
