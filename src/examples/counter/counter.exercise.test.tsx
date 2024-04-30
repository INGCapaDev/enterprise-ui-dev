import { screen } from '@testing-library/react';
import Counter from '.';
import { render } from 'test/utilities';

const renderCounter = (initialCount?: number) => {
  const { user } = render(<Counter initialCount={initialCount} />);
  const currentCount = screen.getByTestId('current-count');
  const incrementButton = screen.getByRole('button', { name: 'Increment' });
  const resetButton = screen.getByRole('button', { name: 'Reset' });
  return { user, currentCount, incrementButton, resetButton };
};

test('it should render the component', () => {
  const { currentCount } = renderCounter();

  expect(currentCount).toHaveTextContent('0');
});

test('it should increment when the "Increment" button is pressed', async () => {
  const { user, currentCount, incrementButton } = renderCounter();

  await user.click(incrementButton);

  expect(currentCount).toHaveTextContent('1');
});

test('it should render the component with an initial count', () => {
  const { currentCount } = renderCounter(5);
  expect(currentCount).toHaveTextContent('5');
});

test('it should reset the count when the "Reset" button is pressed', async () => {
  const initialCount = 5;
  const { user, currentCount, incrementButton, resetButton } =
    renderCounter(initialCount);

  expect(currentCount).toHaveTextContent(initialCount.toString());
  await user.click(incrementButton);
  await user.click(incrementButton);
  expect(currentCount).toHaveTextContent((initialCount + 2).toString());

  await user.click(resetButton);
  expect(currentCount).toHaveTextContent(initialCount.toString());
});
