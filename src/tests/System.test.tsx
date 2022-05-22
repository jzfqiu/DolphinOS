import { render, screen } from './test-utils'
import System from "../components/System"
import React from 'react';

test('basic test', () => {
    render(<System />);
    const linkElement = screen.getByText("about");
    expect(linkElement).toBeInTheDocument();
  });