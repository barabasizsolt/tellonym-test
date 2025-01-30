// eslint-disable-next-line import/no-mutable-exports
export let mirageServer = {
  create: () => {},
  createList: () => {},
  loadFixtures: () => {},
  passthrough: () => {},
  shutdown: () => {},
}

export const setMirageServer = (server) => {
  mirageServer = server
}
