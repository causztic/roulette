import { Person } from '../types/person';
import { colorFor } from './colors';

export const Slice = ({ index, person }: { index: number, person: Person }) => {
  const y = (t: number) => 250 * Math.cos(t);
  const x = (t: number) => 250 * Math.sin(t);

  const average = (person.maxAngle + person.minAngle) / 2;

  return (
    <>
      <path
        d={`M0 0 L${x(person.minAngle)} ${y(person.minAngle)} A250 250 0 0 0 ${x(person.maxAngle)} ${y(person.maxAngle)} Z`}
        fill={colorFor(index)} />
      <path
        id={`path-${index}`}
        d={`M0 0 L${x(average)} ${y(average)}`}
        fill="none" />
      <text textAnchor="middle">
        <textPath href={`#path-${index}`} startOffset="50%" dominantBaseline="middle" fontSize={20}>
          {person.name}
        </textPath>
      </text>
    </>
  )
}