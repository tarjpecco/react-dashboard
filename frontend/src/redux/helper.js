// eslint-disable-next-line import/prefer-default-export
export function actionNames(action) {
  return [action, `${action}_REQUEST`, `${action}_SUCCESS`, `${action}_ERROR`]
}


export function createActions(duck, ...names) {
  return names.reduce((actions, name) => {
    const lowerName = name.toLowerCase()
    const uperName = name.toUpperCase()
    const type = duck.defineType(uperName)
    actions[uperName] = type
    actions[lowerName] = duck.createAction(type)
    return actions
  }, {})
}
