import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
  window.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
  window.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  window.scrollTo = () => {};
});

test('renders the portfolio sections', () => {
  render(<App />);
  expect(screen.getAllByText(/Kaya/).length).toBeGreaterThan(0);
  expect(screen.getByText('Arşiv')).toBeInTheDocument();
});
