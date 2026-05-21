export function updateLocation(location) {
  console.log(location)
  return { type: "updateLocation", location };
}
