import { Person } from '../types/person';
import { colorFor } from './colors';

export const Slice = ({ index, person, radius }: { index: number, person: Person, radius: number }) => {
  const y = (t: number) => radius * Math.cos(t);
  const x = (t: number) => radius * Math.sin(t);

  const average = (person.maxAngle + person.minAngle) / 2;

  return (
    <>
      <path
        d={`M0 0 L${x(person.minAngle)} ${y(person.minAngle)} A${radius} ${radius} 0 0 0 ${x(person.maxAngle)} ${y(person.maxAngle)} Z`}
        fill={colorFor(index)} />
      <path
        id={`path-${index}`}
        d={`M${x(average)} ${y(average)} L0 0`}
        fill="none" />
      <text textAnchor="middle">
        <textPath href={`#path-${index}`} startOffset="50%" dominantBaseline="middle" fontSize={20}>
          {person.name}
        </textPath>
      </text>
    </>
  );
};