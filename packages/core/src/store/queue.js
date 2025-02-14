export const queue = {
  enqueue: (actions, action) =>
    action.meta?.offline?.shouldNotEnqueueMultiple ||
    action.type.includes('REFRESH')
      ? [...actions.filter((a) => a.type !== action.type), action]
      : [...actions, action],
  dequeue: (actions) => actions.slice(1),
  peek: (actions) => actions[0],
}
