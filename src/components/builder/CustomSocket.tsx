import * as React from 'react';
import { ClassicPreset } from 'rete';
import styled from 'styled-components';

const $socketsize = 16;

const Styles = styled.div`
  display: inline-block;
  cursor: pointer;
  border: 1px solid black;
  width: ${$socketsize}px;
  height: ${$socketsize}px;
  border-radius: 50%;
  vertical-align: middle;
  background: #fff;
  z-index: 2;
  box-sizing: border-box;
  &:hover {
    background: #ddd;
  }
`;

export function CustomSocket<T extends ClassicPreset.Socket>(props: { data: T }) {
  return <Styles title={props.data.name} />;
}
