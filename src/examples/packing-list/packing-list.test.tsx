import { render, screen, waitFor } from 'test/utilities';
import { PackingList } from '.';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from './store';

const store = createStore();

const renderPackingList = () => {
  const user = userEvent.setup();
  render(
    <Provider store={store}>
      <PackingList />
    </Provider>,
  );
  const input = screen.getByTestId('new-item-input');
  const addButton = screen.getByRole('button', { name: 'Add New Item' });
  const title = screen.getByText('Packing List');
  return { input, addButton, title, user };
};

const expectInitialState = (addButton: HTMLElement, input: HTMLElement) => {
  expect(input).toHaveValue('');
  expect(addButton).toBeDisabled();
};

it('renders the Packing List application', () => {
  renderPackingList();
});

it('has the correct title', async () => {
  const { title } = renderPackingList();
  expect(title).toBeInTheDocument();
});

it('has an input field for a new item', () => {
  const { input } = renderPackingList();
  expect(input).toBeInTheDocument();
});

it('has a "Add New Item" button that is disabled when the input is empty', () => {
  const { input, addButton } = renderPackingList();
  expectInitialState(addButton, input);
});

it('enables the "Add New Item" button when there is text in the input field', async () => {
  const { input, addButton, user } = renderPackingList();
  expectInitialState(addButton, input);

  await user.type(input, 'New Item');
  expect(input).toHaveValue('New Item');
  expect(addButton).toBeEnabled();
});

it('adds a new item to the unpacked item list when the clicking "Add New Item"', async () => {
  const { input, addButton, user } = renderPackingList();
  await user.type(input, 'New Item LOL');
  await user.click(addButton);
  expectInitialState(addButton, input);

  const newItem = screen.getByText('New Item LOL');
  expect(newItem).toBeInTheDocument();
  expect(newItem).not.toBeChecked();
});

it('removes an item', async () => {
  const { input, addButton, user } = renderPackingList();
  await user.type(input, 'Remove Me LOL');
  await user.click(addButton);
  expectInitialState(addButton, input);

  const newItem = screen.getByText('Remove Me LOL');
  expect(newItem).toBeInTheDocument();
  expect(newItem).not.toBeChecked();

  const removeButton = screen.getByRole('button', {
    name: 'Remove Remove Me LOL',
  });
  await user.click(removeButton);

  waitFor(() => {
    expect(newItem).not.toBeInTheDocument();
  });
});
