import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as authService from '../services/authService';

// Mock de la función guardarSesion y useNavigate
vi.mock('../services/authService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    saveSession: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  test('1. Renderiza correctamente el formulario de login', () => {
    renderComponent();
    
    // Verifica que los elementos principales existan en pantalla
    expect(screen.getByRole('heading', { name: /validador de datos/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tu correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tu contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('2. Permite escribir en los campos de correo y contraseña', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText(/tu correo electrónico/i);
    const passwordInput = screen.getByPlaceholderText(/tu contraseña/i);

    // Escribir en los inputs
    await user.type(emailInput, 'test@mail.com');
    await user.type(passwordInput, 'mypassword');

    // Verificar que los valores se actualizaron
    expect(emailInput).toHaveValue('test@mail.com');
    expect(passwordInput).toHaveValue('mypassword');
  });

  test('3. Muestra mensaje de error cuando las credenciales son inválidas', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Completar el formulario con datos inválidos
    await user.type(screen.getByPlaceholderText(/tu correo electrónico/i), 'wrong@mail.com');
    await user.type(screen.getByPlaceholderText(/tu contraseña/i), 'wrongpass');
    
    // Enviar el formulario
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // El mensaje de error debe aparecer después de procesar la solicitud (el mock del authService tiene delay)
    const errorMessage = await screen.findByText(/credenciales inválidas/i);
    expect(errorMessage).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('4. Inicia sesión exitosamente con las credenciales correctas', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Usar las credenciales definidas en authService (victor.stone@test.com / victorpass)
    await user.type(screen.getByPlaceholderText(/tu correo electrónico/i), 'victor.stone@test.com');
    await user.type(screen.getByPlaceholderText(/tu contraseña/i), 'victorpass');
    
    // Enviar el formulario
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Esperar a que se llame guardarSesion (lo que indicaría un login exitoso)
    // Usamos waitFor internamente al chequear un mock después de una acción asíncrona no-UI,
    // o podemos simplemente verificar el llamado a mockNavigate.
    // Puesto que el submit cambia estado asincrónicamente, findByRole no ayuda a esperar la redirección.
    // Haremos una aserción de que la navegación sucedió.
    await vi.waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    
    // Asegurarse de que el token fue guardado
    expect(authService.saveSession).toHaveBeenCalled();
  });

  test('5. El botón muestra el estado de "Cargando..." y se deshabilita mientras se procesa la solicitud', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i });
    
    // Escribir datos
    await user.type(screen.getByPlaceholderText(/tu correo electrónico/i), 'victor.stone@test.com');
    await user.type(screen.getByPlaceholderText(/tu contraseña/i), 'victorpass');
    
    // Clic en iniciar sesión
    await user.click(submitBtn);
    
    // Inmediatamente después del clic, el botón debe decir "Cargando..." y estar deshabilitado
    expect(screen.getByRole('button', { name: /cargando\.\.\./i })).toBeDisabled();
    
    // Cuando termine la operación, volverá a la normalidad o será desmontado por la redirección
    await vi.waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  });
});
