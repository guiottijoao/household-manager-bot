const icons = {
  louça: '🧼',
  varrer: '🧹',
  lixos: '🗑️',
  roupas: '🧺',
  pano: '🧼'
}
const taskFormatter = (task) => {
  const content = task.content.toLowerCase()

  const key = Object.keys(icons).find(key => content.includes(key))
  const icon = key ? icons[key] : '🗒️'

  return ` ${icon} *${task.content}*
🤺 Responsável: ${task.person}
⏳ Tempo estimado: ${task.estimatedTimeMin}min`
}

export default taskFormatter