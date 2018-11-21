// eslint-disable-next-line import/prefer-default-export
export function actionNames(action) {
  return [action, `${action}_REQUEST`, `${action}_SUCCESS`, `${action}_ERROR`]
}
