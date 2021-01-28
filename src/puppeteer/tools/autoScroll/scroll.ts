async function autoScroll(page: any, scrollStep: number = 250, scrollDelay: number = 50) {
    const lastPosition = await page.evaluate(
      async (step: any, delay: any) => {
        const getScrollHeight = (element: any) => {
          if (!element) return 0

          const { scrollHeight, offsetHeight, clientHeight } = element
          return Math.max(scrollHeight, offsetHeight, clientHeight)
        }

        const position = await new Promise((resolve) => {
          let count = 0
          const intervalId = setInterval(() => {
            const { body } = document
            const availableScrollHeight = getScrollHeight(body)

            window.scrollBy(0, step)
            count += 1

            if (count >= 100) {
              clearInterval(intervalId)
              resolve(count)
            }
          }, delay)
        })

        return position
      },
      scrollStep,
      scrollDelay
    )
    return lastPosition
  }

export default autoScroll;
