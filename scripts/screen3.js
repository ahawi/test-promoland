const countrySelect = document.querySelector('[data-js-form-country]')
const phoneInput = document.querySelector('[data-js-form-phone]')
const form = document.querySelector('[data-js-form]')
const formAlert = document.querySelector('[data-js-form-alert]')
const finalTitleElement = document.querySelector('[data-js-final-title]')
const finalDescElement = document.querySelector('[data-js-final-desc]')
const finalImageElement = document.querySelector('[data-js-final-image]')

//запрещаем ввод чего-либо кроме цифр
phoneInput.addEventListener('input', () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, '')
})

//получаем флаг + код + название страны
let countryMap = {}
let detectedCountry = null

const generateCountryMap = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,idd,flag')
    const data = await response.json()

    data.forEach((country) => {
      const code = country.cca2
      const flag = country.flag

      const root = country.idd?.root || ''
      const dial = root

      if (!code || !dial) return

      countryMap[code] = [flag, dial, /^\d{6,15}$/]
    })
  } catch (e) {
    console.error('Ошибка загрузки стран', e)
  }
}

const countryCodeSelect = () => {
  for (const code in countryMap) {
    const [flag, dial] = countryMap[code]
    const option = document.createElement('option')
    option.value = code
    option.textContent = `${flag} ${dial}`
    countrySelect.appendChild(option)
  }
}

const detectUserCountry = async () => {
  try {
    const response = await fetch('https://ipinfo.io/json')
    const data = await response.json()
    const userCountry = data.country

    if (countryMap[userCountry]) {
      countrySelect.value = userCountry
      detectedCountry = userCountry
    }
  } catch {}
}

document.addEventListener('DOMContentLoaded', async () => {
  await generateCountryMap()
  countryCodeSelect()
  await detectUserCountry()
  showSelectedProduct()
})

window.showSelectedProduct = () => {
  const product = window.selectedProduct
  if (!product) return

  finalTitleElement.textContent = `Ваше предложение — ${product.name}!`
  finalDescElement.textContent = product.desc
  finalImageElement.src = product.img
}

//работа с формой
const formValidation = (event) => {
  event.preventDefault()
  if (!formAlert) return (formAlert.textContent = '')

  const name = document.querySelector('[data-js-form-name]')?.value.trim()
  const surname = document.querySelector('[data-js-form-surname]')?.value.trim()
  const countryCode = countrySelect?.value
  const dial = countryMap[countryCode]?.[1]
  const regex = countryMap[countryCode]?.[2]
  const phone = phoneInput?.value.trim()
  const email = document.querySelector('[data-js-form-email]')?.value.trim()

  if (!name || !surname || !phone || !email || !countryCode) {
    formAlert.textContent = 'Заполните все поля'
    return
  }

  if (!/.+@.+\..+/.test(email)) {
    formAlert.textContent = 'Введите корректный email'
    return
  }

  if (!regex.test(phone)) {
    formAlert.textContent = 'Введите корректный номер телефона для выбранной страны'
    return
  }

  formAlert.textContent =
    'Отлично! Вы получили персональное предложение. Менеджер скоро свяжется с вами'

  console.log('Данные:', {
    name,
    surname,
    phone: dial + phone,
    email,
    product: window.selectedProduct?.name,
  })

  form.reset()
  if (detectedCountry) {
    countrySelect.value = detectedCountry
  }
}

form.addEventListener('submit', formValidation)
