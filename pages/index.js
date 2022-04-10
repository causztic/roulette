import Head from 'next/head'
import { useState, useEffect, useRef, Fragment } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const roulette = useRef();
  // Okabe & Ito
  const colors = ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7", "#999999"]

  const [currentPerson, setCurrentPerson] = useState('');
  const [people, setPeople] = useState(['test']);
  const [chosen, setChosen] = useState(['', 0]);

  const interval = (number) => (2 * Math.PI) / number;
  const angles = (number) => {
    const array = Array.from(Array(number).keys()).map((index) => {
      return [index * interval(number), (index + 1) * interval(number)]
    });

    return array;
  }

  const y = (t) => 250 * Math.cos(t);
  const x = (t) => 250 * Math.sin(t);

  const getWinner = () => {
    const winnerIndex = Math.floor(Math.random() * people.length)
    const [min, max] = angles(people.length)[winnerIndex]
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

  const finishSpinning = () => {
    roulette.current.style.transform = `rotate(${chosen[1]}deg)`;
    roulette.current.classList.remove(styles.rotating);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Roulette</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <svg height="550" width="500">
          <g transform="matrix(1 0 0 1 250 275)">
            <circle cx="0" cy="0" r="245" fill="white" />
            <g ref={roulette} onTransitionEnd={finishSpinning}>
              {angles(people.length).map((angle, index) =>
                <Fragment key={index}>
                  <path
                    d={`M0 0 L${x(angle[0])} ${y(angle[0])} A250 250 0 0 0 ${x(angle[1])} ${y(angle[1])} Z`}
                    fill={colors[index % colors.length]} />
                  <path
                    id={`path-${index}`}
                    d={`M${x(angle[0])} ${y(angle[0])} A250 250 0 0 0 ${x(angle[1])} ${y(angle[1])}`}
                    fill="none" />
                  <text dy={-10} textAnchor="middle">
                    <textPath href={`#path-${index}`} startOffset="50%" dominantBaseline="text-after-edge">
                      {people[index]}
                    </textPath>
                  </text>
                </Fragment>
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
