import { useState, useEffect } from 'react'

const useChromeStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const loadData = async () => {
      const result = await chrome.storage.local.get([key])
      if (result[key] !== undefined) {
        setValue(result[key])
      }
    }
    loadData()
  }, [key])

  const setStoredValue = async (newValue) => {
    setValue(newValue)
    await chrome.storage.local.set({ [key]: newValue })
  }

  return [value, setStoredValue]
}

export default useChromeStorage