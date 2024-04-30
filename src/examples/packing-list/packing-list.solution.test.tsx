import { render, screen } from 'test/utilities';
import { PackingList } from '.';
import { createStore } from './store';
import { Provider } from 'react-redux';

const store = createStore();
const renderWithProvider = () =>
  render(
    <Provider store={store}>
      <PackingList />
    </Provider>,
  );

it('renders the Packing List application', () => {
  renderWithProvider();
});

it('has the correct title', async () => {
  renderWithProvider();
  screen.getByText('Packing List');
});

it('has an input field for a new item', () => {
  renderWithProvider();
  screen.getByLabelText('New Item Name');
});

it('has a "Add New Item" button that is disabled when the input is empty', () => {
  renderWithProvider();
  const newItemInput = screen.getByLabelText('New Item Name');
  const addNewItemButton = screen.getByRole('button', { name: 'Add New Item' });

  expect(newItemInput).toHaveValue('');
  expect(addNewItemButton).toBeDisabled();
});

it('enables the "Add New Item" button when there is text in the input field', async () => {
  const { user } = renderWithProvider();
  const newItemInput = screen.getByLabelText<HTMLInputElement>('New Item Name');
  const addNewItemButton = screen.getByRole('button', { name: 'Add New Item' });

  await user.type(newItemInput, 'MacBook Pro');

  expect(addNewItemButton).toBeEnabled();
});

it('adds a new item to the unpacked item list when the clicking "Add New Item"', async () => {
  const { user } = renderWithProvider();
  const newItemInput = screen.getByLabelText<HTMLInputElement>('New Item Name');
  const addNewItemButton = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Add New Item',
  });

  await user.type(newItemInput, 'MacBook Pro');
  await user.click(addNewItemButton);

  expect(screen.getByLabelText('MacBook Pro')).not.toBeChecked();
});

// This test is sublty flawed.
it('removes an item when the remove button is clicked', async () => {
  const { user } = renderWithProvider();

  const newItemInput = screen.getByLabelText<HTMLInputElement>('New Item Name');
  const addNewItemButton = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Add New Item',
  });

  await user.type(newItemInput, 'iPad Pro');
  await user.click(addNewItemButton);

  const item = screen.getByLabelText('iPad Pro');
  const removeButton = screen.getByRole('button', {
    name: 'Remove iPad Pro',
  });

  await user.click(removeButton);

  expect(item).not.toBeInTheDocument();
});
