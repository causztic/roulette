import { colorFor } from './utils';

export const Slice = ({ index, person: [name, angleFrom, angleTo] }) => {
  const y = (t) => 250 * Math.cos(t);
  const x = (t) => 250 * Math.sin(t);
  return (
    <>
      <path
        d={`M0 0 L${x(angleFrom)} ${y(angleFrom)} A250 250 0 0 0 ${x(angleTo)} ${y(angleTo)} Z`}
        fill={colorFor(index)} />
      <path
        id={`path-${index}`}
        d={`M${x(angleFrom)} ${y(angleFrom)} A250 250 0 0 0 ${x(angleTo)} ${y(angleTo)}`}
        fill="none" />
      <text dy={-10} textAnchor="middle">
        <textPath href={`#path-${index}`} startOffset="50%" dominantBaseline="text-after-edge">
          {name}
        </textPath>
      </text>
    </>
  )
}