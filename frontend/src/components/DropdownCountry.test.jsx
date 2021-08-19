import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import DropdownCountry from './DropdownCountry';

const testCountries = [
  {
    id: 72,
    name: "Côte d'Ivoire",
    code: 384,
    company: [
      {
        id: 5,
        name: "Company 5",
        country: 72
      },
      {
        id: 13,
        name: "Company 13",
        country: 72
      }
    ]
  },
  {
    id: 73,
    name: "Cameroon",
    code: 120,
    company: [
      {
        id: 7,
        name: "Company 7",
        country: 73
      }
    ]
  }
];

test('call function when dropdown clicked', async () => {
  const handleOnChange = jest.fn();
  const { getByRole, getByTitle } = render(<DropdownCountry options={testCountries} onChange={handleOnChange} placeholder="Select Country" />);
  fireEvent.click(getByRole('combobox'));
  fireEvent.mouseDown(getByRole('combobox'));
  fireEvent.click(getByTitle('Cameroon'));

  await waitFor(() => {
    expect(handleOnChange).toHaveBeenCalledTimes(1);
  });
});
