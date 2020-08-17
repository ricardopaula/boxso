export const isAuthenticated = () => {
  if (localStorage.getItem('token')) {
    console.log(`Tem Token ${localStorage.getItem('token')}`)
    return true
  } else {
    console.log('Nao tem token')
    return false
  }
};
