export const reducer = (state = [24.97, 121.53], action) => {
  switch (action.type) {
    case 'updateLocation':
      return action.location
    default:
      return state
  }
}