import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import MainBoard from './components/mainBoard';

test('renders 2048 title, score boxes, and action toolbar', () => {
    const { getAllByText, getByText } = render(<MainBoard />);
    expect(getAllByText('2048')[0]).toBeInTheDocument();
    expect(getByText('SCORE')).toBeInTheDocument();
    expect(getByText('BEST')).toBeInTheDocument();
    expect(getByText(/New Game/i)).toBeInTheDocument();
    expect(getByText(/Undo/i)).toBeInTheDocument();
});
