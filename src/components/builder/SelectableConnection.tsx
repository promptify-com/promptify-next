import React from 'react';
import { ClassicScheme, Presets } from 'rete-react-render-plugin';
import styled from 'styled-components';

const Svg = styled.svg`
  overflow: visible !important;
  position: absolute;
  pointer-events: none;
`;

const Path = styled.path<{ selected?: boolean; styles?: (props: any) => any }>`
  fill: none;
  stroke-width: 3px;
  stroke: ${props => (props.selected ? 'red' : '#ebebeb')};
  pointer-events: auto;
  ${props => props.styles && props.styles(props)}
`;

const HoverPath = styled.path`
  fill: none;
  stroke-width: 15px;
  pointer-events: auto;
  stroke: transparent;
`;

export function SelectableConnection(props: {
  data: ClassicScheme['Connection'] & {
    selected?: boolean;
    isLoop?: boolean;
  };
  click?: () => void;
  styles?: () => any;
}) {
  const { path } = Presets.classic.useConnection();

  if (!path) return null;

  return (
    <Svg
      //   onPointerDown={(e: PointerEvent) => e.stopPropagation()}
      onClick={props.click}
      data-testid="connection"
    >
      <HoverPath d={path} />
      <Path selected={props.data.selected} styles={props.styles} d={path} />
    </Svg>
  );
}
