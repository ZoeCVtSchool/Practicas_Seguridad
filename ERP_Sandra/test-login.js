// Script para probar el login
// Ejecutar en la consola del navegador

// Limpiar localStorage
localStorage.removeItem('registered_users');

// Verificar usuarios
const authService = {
  getUsers: () => {
    const data = localStorage.getItem('registered_users');
    return data ? JSON.parse(data) : [];
  }
};

console.log('Usuarios actuales:', authService.getUsers());