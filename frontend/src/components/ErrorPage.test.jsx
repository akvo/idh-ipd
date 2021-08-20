import { act, fireEvent, render, screen } from '@testing-library/react'
import ErrorPage from './ErrorPage'

describe('ErrorPage', () => {


  it('should render 404 not found', () => {
    render(<ErrorPage status={404} />);
    expect(screen.getByText('Page not found')).toBeTruthy();
  });

});

describe('ErrorPage reload page', () => {
  const { location } = window;
  delete window.location;
  window.location = { reload: jest.fn() };

  it('mocks should not dispatch window.location.reload', () => {
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it('should fire window location reload', () => {
    act(() => {
      const { getByRole } = render(<ErrorPage />)
      fireEvent.click(getByRole('button'))
      expect(window.location.reload).toHaveBeenCalled();
    })
  })
})