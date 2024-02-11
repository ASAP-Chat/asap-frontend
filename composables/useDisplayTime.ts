export const showDisplayTime = (filteredMessages: any, index: number) => {
  if (index === 0) {
    return true
  }

  const currentMessage = filteredMessages.data[index]
  const previousMessage = filteredMessages.data[index - 1]

  const currentDate = new Date(currentMessage.sourceTimestamp)
  const previousDate = new Date(previousMessage.sourceTimestamp)

  const isDifferentDay = currentDate.getDate() !== previousDate.getDate()

  return isDifferentDay
}
